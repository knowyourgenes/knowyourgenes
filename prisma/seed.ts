import 'dotenv/config';
import { PrismaClient, PackageCategory, SampleType, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { createReadStream, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Pincode CSV loader - same parser as prisma/seed-pincodes.ts so re-running
// the main seed picks up new locations idempotently via skipDuplicates.
// ---------------------------------------------------------------------------

const PINCODE_CSV = path.join(process.cwd(), 'prisma', 'India_pincodes.csv');

const LOWERS = new Set(['and', 'of', 'the']);
function normaliseCase(s: string): string {
  if (!s) return s;
  return s
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i > 0 && LOWERS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

type ColMap = { pincode: number; area: number; district?: number; state?: number };

function resolveColumns(headers: string[]): ColMap | null {
  const lower = headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, '')
  );
  const pick = (candidates: string[]) => {
    for (const c of candidates) {
      const i = lower.indexOf(c);
      if (i >= 0) return i;
    }
    return undefined;
  };
  const pincode = pick(['pincode', 'pin', 'pincodenumber']);
  const area = pick(['name', 'officename', 'office', 'area', 'locality']);
  const district = pick(['districtname', 'district']);
  const state = pick(['statename', 'state']);
  if (pincode === undefined || area === undefined) return null;
  return { pincode, area, district, state };
}

async function seedAllIndiaPincodes(): Promise<{ inserted: number; existed: number; totalRows: number }> {
  if (!existsSync(PINCODE_CSV)) {
    console.log(`  ⚠ Pincode CSV not found at ${PINCODE_CSV}. Run pnpm db:seed-pincodes separately.`);
    return { inserted: 0, existed: 0, totalRows: 0 };
  }

  const rl = createInterface({
    input: createReadStream(PINCODE_CSV, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let colMap: ColMap | null = null;
  const byPincodeArea = new Map<string, { pincode: string; area: string; district: string; state: string }>();

  for await (const raw of rl) {
    const line = raw.replace(/﻿/g, ''); // strip BOM
    if (!line.trim()) continue;
    const row = parseCsvLine(line);
    if (!colMap) {
      colMap = resolveColumns(row);
      if (!colMap) {
        console.error('  ❌ Could not find Pincode/Name columns in CSV header - skipping pincode import.');
        return { inserted: 0, existed: 0, totalRows: 0 };
      }
      continue;
    }
    const pincode = (row[colMap.pincode] ?? '').trim();
    if (!/^\d{6}$/.test(pincode)) continue;
    const area = normaliseCase((row[colMap.area] ?? '').trim());
    if (!area) continue;
    const key = `${pincode}|${area.toLowerCase()}`;
    if (byPincodeArea.has(key)) continue;
    const district = colMap.district != null ? normaliseCase((row[colMap.district] ?? '').trim()) : '';
    const state = colMap.state != null ? normaliseCase((row[colMap.state] ?? '').trim()) : '';
    byPincodeArea.set(key, { pincode, area, district, state });
  }

  const rows = [...byPincodeArea.values()].map((r) => ({
    pincode: r.pincode,
    area: r.area,
    district: r.district,
    state: r.state,
    city: r.district,
    active: false,
  }));

  const BATCH = 5000;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const res = await prisma.serviceArea.createMany({ data: batch, skipDuplicates: true });
    inserted += res.count;
  }
  return { inserted, existed: rows.length - inserted, totalRows: rows.length };
}

// Delhi NCR core - matches the district names as they appear in
// prisma/India_pincodes.csv. Adjust here if launch coverage changes.
async function activateDelhiNcr(): Promise<number> {
  const filters = [
    // All districts of Delhi (Central, East, New, North, North East, North West,
    // South, South West, West Delhi).
    { where: { state: 'Delhi' } },
    // Haryana core NCR.
    {
      where: {
        state: 'Haryana',
        district: { in: ['Gurgaon', 'Faridabad', 'Jhajjar', 'Rewari', 'Rohtak', 'Sonipat'] },
      },
    },
    // UP core NCR. (CSV uses "Gautam Buddha Nagar" + "Bagpat".)
    {
      where: {
        state: 'Uttar Pradesh',
        district: { in: ['Gautam Buddha Nagar', 'Ghaziabad', 'Meerut', 'Bulandshahr', 'Bagpat', 'Muzaffarnagar'] },
      },
    },
    // Rajasthan NCR.
    {
      where: { state: 'Rajasthan', district: { in: ['Alwar', 'Bharatpur'] } },
    },
  ];

  let total = 0;
  for (const f of filters) {
    const res = await prisma.serviceArea.updateMany({ where: f.where, data: { active: true } });
    total += res.count;
  }
  return total;
}

// ---------------------------------------------------------------------------
// Categories - top-level groupings shown on the homepage.
// Today we only sell Wellness kits. Other categories are reserved for the
// roadmap but not seeded so admin doesn't see empty groups in the dashboard.
// ---------------------------------------------------------------------------
const categories = [
  {
    slug: 'wellness',
    name: 'Wellness & Nutrition',
    description:
      'Genetic insights into nutrition, fitness, sleep, skin and longevity. Plain-English reports you can act on tomorrow.',
    icon: '🥗',
    position: 0,
    active: true,
  },
];

// ---------------------------------------------------------------------------
// Packages - all under the Wellness category for launch.
// Prices in paise (₹1 = 100). Stock counted in kits sitting at the lab.
// ---------------------------------------------------------------------------
const packages = [
  {
    slug: 'wellness-starter',
    name: 'Wellness Starter',
    category: PackageCategory.WELLNESS,
    tagline: 'Your first DNA test - nutrition, fitness, skin & sleep.',
    description:
      'A friendly entry point into genetic testing. 80+ traits across diet, movement, and lifestyle - in plain English.',
    price: 899900,
    compareAtPrice: 1199900,
    tatMinDays: 7,
    tatMaxDays: 10,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 80,
    popular: true,
    fulfillmentType: 'KIT_BY_POST' as const,
    kitShippingFee: 19900,
    stockQuantity: 60,
    lowStockThreshold: 10,
    highlights: [
      'Nutrient sensitivity (lactose, gluten, caffeine)',
      'Fitness type - endurance vs. power',
      'Sleep chronotype & recovery',
      'Skin ageing & UV sensitivity',
    ],
    biomarkerList: ['MTHFR', 'FTO', 'ACTN3', 'PPARGC1A', 'CLOCK', 'MC1R', 'APOE', 'TCF7L2'],
    faq: [
      { q: 'Is this test painful?', a: 'No. Saliva sample - no needle.' },
      { q: 'Who is this for?', a: 'Anyone curious about their body. 18+ recommended.' },
    ],
  },
  {
    slug: 'comprehensive-wellness',
    name: 'Comprehensive Wellness',
    category: PackageCategory.WELLNESS,
    tagline: '200+ markers across nutrition, fitness, mental wellness & longevity.',
    description: 'Our flagship wellness panel. Deep, actionable insights with a counsellor-ready report.',
    price: 1499900,
    compareAtPrice: 1899900,
    tatMinDays: 10,
    tatMaxDays: 12,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 200,
    recommended: true,
    fulfillmentType: 'KIT_BY_POST' as const,
    kitShippingFee: 19900,
    stockQuantity: 40,
    lowStockThreshold: 10,
    highlights: [
      'Macro- and micronutrient metabolism',
      'VO₂ max potential & injury risk',
      'Stress, focus, and sleep quality',
      'Longevity markers',
    ],
    biomarkerList: ['MTHFR', 'VDR', 'COMT', 'BDNF', 'APOE', 'FOXO3', 'SIRT1', 'IL6'],
    faq: [{ q: 'Is a consultation included?', a: 'No - counselling is a separate paid service.' }],
  },
  {
    slug: 'nutrition-deep-dive',
    name: 'Nutrition Deep Dive',
    category: PackageCategory.WELLNESS,
    tagline: 'Exactly which foods your body thrives on - and which fight back.',
    description:
      'A focused panel on diet response. How you metabolise carbs, fats, caffeine, alcohol and key micronutrients. The diet plan you build from this actually fits your DNA.',
    price: 699900,
    compareAtPrice: 899900,
    tatMinDays: 7,
    tatMaxDays: 10,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 65,
    popular: false,
    fulfillmentType: 'KIT_BY_POST' as const,
    kitShippingFee: 19900,
    stockQuantity: 80,
    lowStockThreshold: 15,
    highlights: [
      'Lactose, gluten, caffeine, alcohol metabolism',
      'Vitamin D, B12, folate, iron absorption',
      'Carb vs. fat oxidation',
      'Sweet- and bitter-taste perception',
    ],
    biomarkerList: ['MTHFR', 'FTO', 'TCF7L2', 'LCT', 'ADH1B', 'ALDH2', 'CYP1A2', 'VDR'],
    faq: [
      {
        q: 'Do I need a nutritionist to read this?',
        a: 'No - but a counselling session can help personalise your plan.',
      },
    ],
  },
  {
    slug: 'fitness-performance',
    name: 'Fitness & Performance',
    category: PackageCategory.WELLNESS,
    tagline: 'Train smarter - endurance, strength, recovery, injury risk.',
    description:
      'Built for anyone who trains. Know your natural muscle composition, your recovery speed, your injury risk, and the workout pattern your body is built for.',
    price: 749900,
    compareAtPrice: 999900,
    tatMinDays: 7,
    tatMaxDays: 10,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 55,
    popular: false,
    fulfillmentType: 'KIT_BY_POST' as const,
    kitShippingFee: 19900,
    stockQuantity: 70,
    lowStockThreshold: 15,
    highlights: [
      'Muscle composition - power vs. endurance',
      'Recovery speed & inflammation response',
      'Soft-tissue injury risk',
      'Optimal training intensity',
    ],
    biomarkerList: ['ACTN3', 'ACE', 'PPARGC1A', 'IL6', 'COL1A1', 'COL5A1', 'AMPD1'],
    faq: [
      {
        q: 'Will this tell me what sport to play?',
        a: 'It tells you what your body responds to. The sport is your call.',
      },
    ],
  },
  {
    slug: 'skin-and-hair',
    name: 'Skin & Hair Wellness',
    category: PackageCategory.WELLNESS,
    tagline: 'Stop guessing at skincare. Match products to your DNA.',
    description:
      'How your skin ages, how your collagen behaves, your UV sensitivity, and why your hair does what it does. Built for anyone tired of buying products on hope alone.',
    price: 649900,
    compareAtPrice: 849900,
    tatMinDays: 7,
    tatMaxDays: 10,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 48,
    popular: false,
    fulfillmentType: 'KIT_BY_POST' as const,
    kitShippingFee: 19900,
    stockQuantity: 55,
    lowStockThreshold: 10,
    highlights: [
      'Collagen breakdown & skin firmness',
      'UV sensitivity & pigmentation',
      'Antioxidant response',
      'Hair growth, density and greying timeline',
    ],
    biomarkerList: ['MC1R', 'MMP1', 'GPX1', 'STXBP5L', 'IRF4', 'SLC45A2'],
    faq: [{ q: 'Does this replace a dermatologist?', a: 'No. It gives you a personalised baseline to take into one.' }],
  },
];

async function main() {
  console.log('🌱 Seeding KYG database…');

  // ADMIN USER
  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knowyourgenes.in' },
    update: {},
    create: {
      name: 'KYG Admin',
      email: 'admin@knowyourgenes.in',
      phone: '9999900001',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // COUNSELLORS
  const counsellorPassword = await bcrypt.hash('Counsellor@123', 12);
  const priya = await prisma.user.upsert({
    where: { email: 'priya@knowyourgenes.in' },
    update: {},
    create: {
      name: 'Dr. Priya Menon',
      email: 'priya@knowyourgenes.in',
      phone: '9999900002',
      passwordHash: counsellorPassword,
      role: Role.COUNSELLOR,
      emailVerified: new Date(),
      counsellorProfile: {
        create: {
          credentials: 'M.Sc. Genetic Counselling, BGCI certified',
          specialty: 'Wellness & nutrition genomics',
          languages: ['English', 'Hindi', 'Malayalam'],
          experience: '11 years',
        },
      },
    },
  });
  const arvind = await prisma.user.upsert({
    where: { email: 'arvind@knowyourgenes.in' },
    update: {},
    create: {
      name: 'Dr. Arvind Rao',
      email: 'arvind@knowyourgenes.in',
      phone: '9999900003',
      passwordHash: counsellorPassword,
      role: Role.COUNSELLOR,
      emailVerified: new Date(),
      counsellorProfile: {
        create: {
          credentials: 'MD, PhD (Medical Genetics)',
          specialty: 'Fitness & metabolic genomics',
          languages: ['English', 'Hindi', 'Telugu'],
          experience: '14 years',
        },
      },
    },
  });
  console.log(`  ✓ Counsellors: ${priya.name}, ${arvind.name}`);

  // AGENTS (kept for the AT_HOME roadmap track)
  const agentPassword = await bcrypt.hash('Agent@12345', 12);
  const agents = [
    { email: 'meera@knowyourgenes.in', name: 'Meera Shah', phone: '9811077200', zone: 'South Delhi' },
    { email: 'ravi@knowyourgenes.in', name: 'Ravi Kumar', phone: '9910122110', zone: 'Gurgaon' },
    { email: 'sneha@knowyourgenes.in', name: 'Sneha Kapoor', phone: '9876543210', zone: 'Noida' },
  ];
  for (const a of agents) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        name: a.name,
        email: a.email,
        phone: a.phone,
        passwordHash: agentPassword,
        role: Role.AGENT,
        emailVerified: new Date(),
        agentProfile: {
          create: {
            zone: a.zone,
            aadhaarVerified: true,
            policeVerified: true,
          },
        },
      },
    });
  }
  console.log(`  ✓ Agents: ${agents.length}`);

  // LAB PARTNERS + LAB LOCATIONS
  // Neotech is a parent organisation with multiple physical labs in Delhi.
  // Each lab gets its own login (one ID/password per lab).
  const neotech = await prisma.labPartner.upsert({
    where: { slug: 'neotech' },
    update: {},
    create: {
      slug: 'neotech',
      name: 'Neotech Diagnostics',
      accreditation: 'NABL, CAP, ISO 15189',
      contactEmail: 'partnerships@neotech.in',
      contactPhone: '+911140123456',
      active: true,
    },
  });
  console.log(`  ✓ Lab partner: ${neotech.name}`);

  const labPassword = await bcrypt.hash('Lab@12345', 12);
  const labs = [
    {
      slug: 'neotech-saket',
      name: 'Neotech Saket',
      addressLine: 'B-12, Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      phone: '+911140000201',
      contactEmail: 'saket@neotech.in',
      pickupLocationName: 'NEOTECH-SAKET',
      isDefault: true,
      loginEmail: 'saket@neotech.in',
      loginName: 'Neotech Saket Lab',
      loginPhone: '9990000201',
    },
    {
      slug: 'neotech-lajpat-nagar',
      name: 'Neotech Lajpat Nagar',
      addressLine: 'C-44, Central Market, Lajpat Nagar II',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
      phone: '+911140000202',
      contactEmail: 'lajpat@neotech.in',
      pickupLocationName: 'NEOTECH-LAJPAT',
      isDefault: false,
      loginEmail: 'lajpat@neotech.in',
      loginName: 'Neotech Lajpat Nagar Lab',
      loginPhone: '9990000202',
    },
  ];

  for (const l of labs) {
    const labUser = await prisma.user.upsert({
      where: { email: l.loginEmail },
      update: {},
      create: {
        name: l.loginName,
        email: l.loginEmail,
        phone: l.loginPhone,
        passwordHash: labPassword,
        role: Role.PARTNER,
        emailVerified: new Date(),
      },
    });
    await prisma.lab.upsert({
      where: { slug: l.slug },
      update: {
        partnerId: neotech.id,
        userId: labUser.id,
      },
      create: {
        partnerId: neotech.id,
        userId: labUser.id,
        slug: l.slug,
        name: l.name,
        addressLine: l.addressLine,
        city: l.city,
        state: l.state,
        pincode: l.pincode,
        phone: l.phone,
        contactEmail: l.contactEmail,
        pickupLocationName: l.pickupLocationName,
        isDefault: l.isDefault,
        active: true,
      },
    });
  }
  console.log(`  ✓ Lab locations under Neotech: ${labs.length}`);

  // CATEGORIES
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`  ✓ Categories: ${categories.length}`);

  // PACKAGES (all under Wellness)
  for (const p of packages) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`  ✓ Packages: ${packages.length}`);

  // SERVICE AREA PINCODES - full India import from CSV, all inactive by
  // default. Then activate Delhi NCR core delivery zone for soft launch.
  console.log(`  ⏳ Importing all-India pincodes from ${PINCODE_CSV}…`);
  const { inserted, existed, totalRows } = await seedAllIndiaPincodes();
  if (totalRows > 0) {
    console.log(
      `  ✓ Pincodes: ${inserted.toLocaleString('en-IN')} inserted, ` +
        `${existed.toLocaleString('en-IN')} already existed (out of ${totalRows.toLocaleString('en-IN')} parsed)`
    );
  }
  const activated = await activateDelhiNcr();
  console.log(`  ✓ Activated Delhi NCR: ${activated.toLocaleString('en-IN')} pincode-area rows`);

  // COUPONS
  await prisma.coupon.upsert({
    where: { code: 'WELCOME1000' },
    update: {},
    create: {
      code: 'WELCOME1000',
      type: 'FLAT',
      value: 100000, // ₹1,000 in paise
      minOrder: 500000, // ₹5,000 min order
      usageLimit: 2000,
      expiresAt: new Date('2026-12-31'),
    },
  });
  await prisma.coupon.upsert({
    where: { code: 'LAUNCH500' },
    update: {},
    create: {
      code: 'LAUNCH500',
      type: 'FLAT',
      value: 50000,
      usageLimit: 5000,
      expiresAt: new Date('2026-08-31'),
    },
  });
  console.log(`  ✓ Coupons: 2`);

  console.log('  ℹ Blog content lives in Sanity - seed it from the Studio at /studio');
  console.log('✅ Seed complete.\n');
  console.log('  Admin login:       admin@knowyourgenes.in       /  Admin@12345');
  console.log('  Counsellor login:  priya@knowyourgenes.in       /  Counsellor@123');
  console.log('  Agent login:       ravi@knowyourgenes.in        /  Agent@12345');
  console.log('  Lab login (Saket): saket@neotech.in             /  Lab@12345');
  console.log('  Lab login (Lajpat):lajpat@neotech.in            /  Lab@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
