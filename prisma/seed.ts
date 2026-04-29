import 'dotenv/config';
import { PrismaClient, PackageCategory, SampleType, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Prices in paise (₹1 = 100).
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
    sampleType: SampleType.BLOOD,
    biomarkerCount: 200,
    recommended: true,
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
    slug: 'cancer-risk-hereditary',
    name: 'Hereditary Cancer Risk Panel',
    category: PackageCategory.CANCER_RISK,
    tagline: 'Screen for 30+ hereditary cancer syndromes with clinical-grade accuracy.',
    description:
      'BRCA1, BRCA2, Lynch syndrome and more. Counsellor review mandatory. Critical findings trigger a proactive call before digital delivery.',
    price: 2499900,
    tatMinDays: 12,
    tatMaxDays: 14,
    sampleType: SampleType.BLOOD,
    biomarkerCount: 45,
    highlights: [
      'BRCA1 / BRCA2 (breast, ovarian)',
      'MLH1, MSH2, MSH6, PMS2 (Lynch / colorectal)',
      'TP53 (Li-Fraumeni)',
      'Counsellor review pre-delivery',
    ],
    biomarkerList: ['BRCA1', 'BRCA2', 'MLH1', 'MSH2', 'MSH6', 'PMS2', 'TP53', 'APC', 'CDH1', 'PALB2'],
    faq: [
      {
        q: 'What if something is found?',
        a: 'Our counsellor calls you before the report is released digitally.',
      },
    ],
  },
  {
    slug: 'cardiac-health',
    name: 'Cardiac Health Panel',
    category: PackageCategory.CARDIAC,
    tagline: 'Familial cardiovascular risk - lipids, arrhythmia, cardiomyopathy.',
    description: 'For families with a history of heart disease, sudden cardiac events, or unexplained fainting.',
    price: 1999900,
    tatMinDays: 10,
    tatMaxDays: 14,
    sampleType: SampleType.BLOOD,
    biomarkerCount: 60,
    highlights: [
      'Familial hypercholesterolemia (LDLR, PCSK9)',
      'Long QT syndrome',
      'Dilated & hypertrophic cardiomyopathy',
      'Coronary artery disease risk score',
    ],
    biomarkerList: ['LDLR', 'APOB', 'PCSK9', 'KCNQ1', 'KCNH2', 'SCN5A', 'MYH7', 'MYBPC3'],
    faq: [{ q: 'Is a cardiologist included?', a: 'For critical findings, yes - at no extra cost.' }],
  },
  {
    slug: 'reproductive-carrier',
    name: 'Reproductive Carrier Screening',
    category: PackageCategory.REPRODUCTIVE,
    tagline: 'Planning a family? Screen 200+ autosomal & X-linked conditions.',
    description:
      'Designed for couples before or during pregnancy. Results are most useful when both partners are tested.',
    price: 2199900,
    tatMinDays: 14,
    tatMaxDays: 14,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 220,
    highlights: [
      'Cystic fibrosis, SMA, Thalassemia',
      'Fragile X, Duchenne muscular dystrophy',
      'Partner-match risk assessment',
      'Counsellor review included',
    ],
    biomarkerList: ['CFTR', 'SMN1', 'HBB', 'FMR1', 'DMD', 'GBA', 'GJB2', 'HEXA'],
    faq: [
      {
        q: 'Should both partners test?',
        a: 'Yes - a single result only tells you half the picture.',
      },
    ],
  },
  {
    slug: 'drug-sensitivity',
    name: 'Drug Sensitivity (Pharmacogenomics)',
    category: PackageCategory.DRUG_SENSITIVITY,
    tagline: 'How your body responds to 80+ common medications.',
    description: "From painkillers to antidepressants - know which drugs work, which don't, and which to avoid.",
    price: 1199900,
    compareAtPrice: 1499900,
    tatMinDays: 7,
    tatMaxDays: 10,
    sampleType: SampleType.SALIVA,
    biomarkerCount: 30,
    highlights: [
      'Painkillers (codeine, tramadol)',
      'Antidepressants (SSRIs, TCAs)',
      'Blood thinners (warfarin, clopidogrel)',
      'Statins & cardiovascular drugs',
    ],
    biomarkerList: ['CYP2D6', 'CYP2C19', 'CYP2C9', 'VKORC1', 'SLCO1B1', 'DPYD', 'TPMT', 'HLA-B'],
    faq: [
      {
        q: 'Do I need a prescription?',
        a: 'No - but share the report with your doctor before changing any medication.',
      },
    ],
  },
];

const delhiNcrPincodes = [
  {
    pincode: '110001',
    area: 'Connaught Place',
    district: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    active: true,
  },
  {
    pincode: '110002',
    area: 'Darya Ganj',
    district: 'Central Delhi',
    state: 'Delhi',
    city: 'Central Delhi',
    active: true,
  },
  {
    pincode: '110070',
    area: 'Vasant Kunj',
    district: 'South West Delhi',
    state: 'Delhi',
    city: 'South West Delhi',
    active: true,
  },
  { pincode: '122001', area: 'DLF Phase 1-3', district: 'Gurugram', state: 'Haryana', city: 'Gurugram', active: true },
  { pincode: '122002', area: 'Sushant Lok', district: 'Gurugram', state: 'Haryana', city: 'Gurugram', active: true },
  {
    pincode: '201301',
    area: 'Sector 62',
    district: 'Gautam Buddh Nagar',
    state: 'Uttar Pradesh',
    city: 'Gautam Buddh Nagar',
    active: true,
  },
  {
    pincode: '201304',
    area: 'Greater Noida West',
    district: 'Gautam Buddh Nagar',
    state: 'Uttar Pradesh',
    city: 'Gautam Buddh Nagar',
    active: true,
  },
  { pincode: '121001', area: 'Sector 1-9', district: 'Faridabad', state: 'Haryana', city: 'Faridabad', active: true },
];

async function main() {
  console.log('🌱 Seeding KYG database…');

  // ADMIN USER
  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kyg.in' },
    update: {},
    create: {
      name: 'KYG Admin',
      email: 'admin@kyg.in',
      phone: '9999900001',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // COUNSELLORS
  const counsellorPassword = await bcrypt.hash('Counsellor@123', 12);
  const priya = await prisma.user.upsert({
    where: { email: 'priya@kyg.in' },
    update: {},
    create: {
      name: 'Dr. Priya Menon',
      email: 'priya@kyg.in',
      phone: '9999900002',
      passwordHash: counsellorPassword,
      role: Role.COUNSELLOR,
      emailVerified: new Date(),
      counsellorProfile: {
        create: {
          credentials: 'M.Sc. Genetic Counselling, BGCI certified',
          specialty: 'Hereditary cancer & reproductive',
          languages: ['English', 'Hindi', 'Malayalam'],
          experience: '11 years',
        },
      },
    },
  });
  const arvind = await prisma.user.upsert({
    where: { email: 'arvind@kyg.in' },
    update: {},
    create: {
      name: 'Dr. Arvind Rao',
      email: 'arvind@kyg.in',
      phone: '9999900003',
      passwordHash: counsellorPassword,
      role: Role.COUNSELLOR,
      emailVerified: new Date(),
      counsellorProfile: {
        create: {
          credentials: 'MD, PhD (Medical Genetics)',
          specialty: 'Cardiac & metabolic disorders',
          languages: ['English', 'Hindi', 'Telugu'],
          experience: '14 years',
        },
      },
    },
  });
  console.log(`  ✓ Counsellors: ${priya.name}, ${arvind.name}`);

  // AGENTS
  const agentPassword = await bcrypt.hash('Agent@12345', 12);
  const agents = [
    { email: 'meera@kyg.in', name: 'Meera Shah', phone: '9811077200', zone: 'South Delhi' },
    { email: 'ravi@kyg.in', name: 'Ravi Kumar', phone: '9910122110', zone: 'Gurgaon' },
    { email: 'sneha@kyg.in', name: 'Sneha Kapoor', phone: '9876543210', zone: 'Noida' },
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

  // LAB PARTNERS
  const partnerPassword = await bcrypt.hash('Partner@12345', 12);
  const partners = [
    {
      email: 'ops@genomics-lab.in',
      name: 'GenomicsLab Diagnostics',
      phone: '9999900101',
      labName: 'GenomicsLab Diagnostics Pvt. Ltd.',
      accreditation: 'NABL, CAP, ISO 15189',
      contactEmail: 'ops@genomics-lab.in',
      contactPhone: '+91 11 4567 8901',
      addressLine: 'Plot 14, Okhla Industrial Area Phase II',
      city: 'New Delhi',
      pincode: '110020',
    },
  ];
  for (const p of partners) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        name: p.name,
        email: p.email,
        phone: p.phone,
        passwordHash: partnerPassword,
        role: Role.PARTNER,
        emailVerified: new Date(),
        labPartnerProfile: {
          create: {
            labName: p.labName,
            accreditation: p.accreditation,
            contactEmail: p.contactEmail,
            contactPhone: p.contactPhone,
            addressLine: p.addressLine,
            city: p.city,
            pincode: p.pincode,
          },
        },
      },
    });
  }
  console.log(`  ✓ Lab partners: ${partners.length}`);

  // PACKAGES
  for (const p of packages) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`  ✓ Packages: ${packages.length}`);

  // SERVICE AREA PINCODES
  for (const s of delhiNcrPincodes) {
    await prisma.serviceArea.upsert({
      where: { pincode: s.pincode },
      update: s,
      create: s,
    });
  }
  console.log(`  ✓ Service area pincodes: ${delhiNcrPincodes.length}`);

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
      expiresAt: new Date('2026-06-30'),
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
      expiresAt: new Date('2026-05-31'),
    },
  });
  console.log(`  ✓ Coupons: 2`);

  console.log('  ℹ Blog content lives in Sanity - seed it from the Studio at /studio');
  console.log('✅ Seed complete.\n');
  console.log('  Admin login:       admin@kyg.in             /  Admin@12345');
  console.log('  Counsellor login:  priya@kyg.in             /  Counsellor@123');
  console.log('  Agent login:       ravi@kyg.in              /  Agent@12345');
  console.log('  Partner login:     ops@genomics-lab.in      /  Partner@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
