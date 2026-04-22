import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums mirrored from Prisma (kept in sync manually — source of truth is Prisma)
// ---------------------------------------------------------------------------

export const RoleEnum = z.enum(['USER', 'AGENT', 'COUNSELLOR', 'PARTNER', 'ADMIN']);
export const PackageCategoryEnum = z.enum(['WELLNESS', 'CANCER_RISK', 'REPRODUCTIVE', 'CARDIAC', 'DRUG_SENSITIVITY']);
export const SampleTypeEnum = z.enum(['BLOOD', 'SALIVA', 'SWAB']);
export const SlotWindowEnum = z.enum(['MORNING', 'AFTERNOON', 'EVENING']);
export const OrderStatusEnum = z.enum([
  'BOOKED',
  'AGENT_ASSIGNED',
  'AGENT_EN_ROUTE',
  'SAMPLE_COLLECTED',
  'AT_LAB',
  'REPORT_READY',
  'CANCELLED',
  'REFUNDED',
]);
export const CouponTypeEnum = z.enum(['FLAT', 'PERCENT']);
export const AgentStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']);

// ---------------------------------------------------------------------------
// Packages
// ---------------------------------------------------------------------------

export const packageCreate = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Must be kebab-case'),
  name: z.string().min(1).max(120),
  category: PackageCategoryEnum,
  tagline: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().int().positive(), // paise
  compareAtPrice: z.number().int().positive().optional().nullable(),
  tatMinDays: z.number().int().min(1).max(30).default(7),
  tatMaxDays: z.number().int().min(1).max(30).default(14),
  sampleType: SampleTypeEnum,
  biomarkerCount: z.number().int().positive(),
  highlights: z.array(z.string()).default([]),
  biomarkerList: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  coverImageUrl: z.string().url().optional().nullable(),
  popular: z.boolean().default(false),
  recommended: z.boolean().default(false),
  active: z.boolean().default(true),
  position: z.number().int().default(0),
});

export const packageUpdate = packageCreate.partial();

// ---------------------------------------------------------------------------
// Counsellors (User + CounsellorProfile created together)
// ---------------------------------------------------------------------------

export const counsellorCreate = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  credentials: z.string().min(1),
  specialty: z.string().min(1),
  languages: z.array(z.string()).min(1),
  experience: z.string().min(1),
  photoUrl: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const counsellorUpdate = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),
  credentials: z.string().min(1).optional(),
  specialty: z.string().min(1).optional(),
  languages: z.array(z.string()).optional(),
  experience: z.string().optional(),
  photoUrl: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Users (list + role change)
// ---------------------------------------------------------------------------

export const userRoleUpdate = z.object({
  role: RoleEnum,
});

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export const agentCreate = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  zone: z.string().min(1),
  aadhaarVerified: z.boolean().default(false),
  policeVerified: z.boolean().default(false),
  dmltCertUrl: z.string().url().optional().nullable(),
});

export const agentUpdate = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),
  zone: z.string().optional(),
  status: AgentStatusEnum.optional(),
  aadhaarVerified: z.boolean().optional(),
  policeVerified: z.boolean().optional(),
  dmltCertUrl: z.string().url().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Lab partners (run the actual tests; upload reports)
// ---------------------------------------------------------------------------

export const partnerCreate = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  labName: z.string().min(1),
  accreditation: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  addressLine: z.string().min(1),
  city: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit pincode'),
});

export const partnerUpdate = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),
  labName: z.string().optional(),
  accreditation: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/)
    .optional(),
  active: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Orders (admin actions: status update, assign agent)
// ---------------------------------------------------------------------------

export const orderStatusUpdate = z.object({
  status: OrderStatusEnum,
  note: z.string().optional(),
});

export const orderAssignAgent = z.object({
  agentId: z.string().min(1),
});

export const orderQuery = z.object({
  status: OrderStatusEnum.optional(),
  agentId: z.string().optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),
  q: z.string().optional(), // search by orderNumber or user name
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(25),
});

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export const couponCreate = z.object({
  code: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[A-Z0-9_]+$/, 'Uppercase alphanumeric + underscore only'),
  type: CouponTypeEnum,
  value: z.number().int().positive(), // paise if FLAT, 0-100 if PERCENT
  minOrder: z.number().int().min(0).optional().nullable(),
  maxDiscount: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(), // ISO date
  usageLimit: z.number().int().positive().optional().nullable(),
  active: z.boolean().default(true),
});

export const couponUpdate = couponCreate.partial();

// ---------------------------------------------------------------------------
// Service area (pincodes)
// ---------------------------------------------------------------------------

export const serviceAreaCreate = z.object({
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit pincode'),
  area: z.string().min(1),
  city: z.string().min(1),
  active: z.boolean().default(true),
});

export const serviceAreaBulk = z.object({
  pincodes: z.array(serviceAreaCreate).min(1).max(500),
});

export const serviceAreaUpdate = z.object({
  area: z.string().optional(),
  city: z.string().optional(),
  active: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Type exports for API route authors
// ---------------------------------------------------------------------------

export type PackageCreate = z.infer<typeof packageCreate>;
export type CounsellorCreate = z.infer<typeof counsellorCreate>;
export type AgentCreate = z.infer<typeof agentCreate>;
export type CouponCreate = z.infer<typeof couponCreate>;
export type ServiceAreaCreate = z.infer<typeof serviceAreaCreate>;
