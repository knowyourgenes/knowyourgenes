import 'server-only';

import type { Gender as PrismaGender } from '@prisma/client';

import { resolveTest } from '../test-catalogue';
import type {
  AmiBlock,
  Ethnicity,
  Gender,
  HeightUnit,
  Lifestyle,
  NeotechDate,
  Order,
  PatientHistory,
  Sample,
  SampleType,
  Specialist,
  Test,
} from '../types';

/**
 * Our order to theirs.
 *
 * THE IMPORTANT THING IN THIS FILE IS WHAT IT DEMANDS FROM THE CALLER.
 *
 * Neotech requires `height`, `weight`, `ethinicity` and `doctorFName` on every
 * order, and requires a `sampleId` barcode on every sample. We store none of
 * them: our User carries only an optional dateOfBirth and gender, our catalogue
 * has no barcode, and we are direct-to-consumer so there is no referring doctor
 * at all. There is therefore no function that turns one of our orders into a
 * valid Neotech order on its own, and pretending otherwise would produce
 * payloads that compile, look right, and are rejected on arrival.
 *
 * So the missing five are a REQUIRED PARAMETER (`clinical`). TypeScript refuses
 * to compile a call that omits them, which moves the discovery from their error
 * log to our editor. Filling them is a product problem - an intake form after
 * checkout, and a barcode printed on the kit - not a mapping problem.
 *
 * WE NEVER MINT THEIR IDENTIFIERS. `orderNo`, `patientId` and `shipmentNo` are
 * theirs to issue (rule 10). Our own number travels as `externalRef`.
 */

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/** Their wire format. Rule 1: emit dd/mm/yyyy, never anything else. */
export function toNeotechDate(d: Date): NeotechDate {
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getUTCFullYear()}`;
}

/**
 * Reads either format.
 *
 * Rule 1 again: their shipment list renders yyyy-mm-dd while their forms post
 * dd/mm/yyyy, so anything parsing their responses has to accept both. The
 * ambiguity is resolvable because the separator differs.
 */
export function fromNeotechDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number) as [number, number, number];
    return new Date(Date.UTC(y, m - 1, d));
  }
  const [d, m, y] = value.split('/').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}

/** Observed on their orders as collection date + 28 days. */
export const TAT_DAYS = 28;

export function expectedTatFrom(testDate: Date): NeotechDate {
  const due = new Date(testDate.getTime());
  due.setUTCDate(due.getUTCDate() + TAT_DAYS);
  return toNeotechDate(due);
}

/** Whole years at `asOf`, which is what their form derives from dob. */
export function ageFrom(dob: Date, asOf: Date = new Date()): number {
  let age = asOf.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    asOf.getUTCMonth() < dob.getUTCMonth() ||
    (asOf.getUTCMonth() === dob.getUTCMonth() && asOf.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

// ---------------------------------------------------------------------------
// Enum bridges
// ---------------------------------------------------------------------------

/**
 * Our Gender to theirs.
 *
 * PREFER_NOT_TO_SAY maps to `O`. Their enum has no fourth value, and `O` is the
 * closest honest reading - the alternative is inventing a sex for a genomics
 * order, which is both wrong and clinically consequential.
 */
export function toNeotechGender(g: PrismaGender): Gender {
  switch (g) {
    case 'MALE':
      return 'M';
    case 'FEMALE':
      return 'F';
    default:
      return 'O';
  }
}

/** Our SampleType to theirs. Their list is a superset, so this cannot fail. */
export function toNeotechSampleType(t: 'BLOOD' | 'SALIVA' | 'SWAB'): SampleType {
  return t;
}

/** cm / inch / feet, as the multiplier their form posts. Rule 4. */
export const HEIGHT_UNIT = {
  cm: '1',
  inch: '2.54',
  feet: '30.48',
} as const satisfies Record<string, HeightUnit>;

// ---------------------------------------------------------------------------
// The gap
// ---------------------------------------------------------------------------

/**
 * Everything Neotech requires that we do not hold.
 *
 * Required, not optional, and deliberately not defaulted. A default here would
 * be a fabricated clinical measurement travelling under a real patient name.
 */
export interface ClinicalIntake {
  /** Numeric value, paired with `heightUnit`. */
  height: number;
  heightUnit: HeightUnit;
  /** Kilograms. */
  weight: number;
  ethinicity: Ethnicity;
  /**
   * Barcode printed on the physical kit. One per sample - the same value repeats
   * across every test run off it.
   */
  sampleId: string;
  /**
   * Required by them even though we are direct-to-consumer with no referring
   * clinician. Supply the ordering clinician when there is one; otherwise the
   * caller decides what stands in, because that is a business call and not
   * something a mapper should invent.
   */
  specialist: Specialist;

  gender?: Gender;
  dob?: Date;
  age?: number;
  lifestyle?: Lifestyle;
  nationality?: string;
  mrno?: string;
  history?: PatientHistory;
  ami?: AmiBlock;
  /** Defaults to the order date. */
  collectionDate?: Date;
  collectionTime?: string;
}

/** The subset of our own order this mapper reads. */
export interface SourceOrder {
  orderNumber: string;
  createdAt: Date;
  paidAt: Date | null;
  slotDate: Date | null;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    dateOfBirth: Date | null;
    gender: PrismaGender | null;
  };
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    area: string;
    city: string;
    pincode: string;
  };
  items: { slugSnapshot: string; nameSnapshot: string }[];
  shipments?: { awb: string | null; courier: string; createdAt: Date }[];
}

export class MissingClinicalDataError extends Error {
  constructor(public readonly missing: string[]) {
    super(
      `Cannot build a Neotech order: ${missing.join(', ')}. Neotech rejects a payload ` +
        `missing any of these, and we do not store them - they must come from the ` +
        `post-checkout intake.`
    );
    this.name = 'MissingClinicalDataError';
  }
}

/**
 * Splits a display name into their three fields.
 *
 * Their form is first / middle / last, ours is one string. Two words means first
 * and last; three or more puts everything between into the middle, because
 * dropping a name part on a clinical record is worse than an odd-looking middle.
 */
export function splitName(full: string): { first: string; middle?: string; last?: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '' };
  if (parts.length === 1) return { first: parts[0]! };
  if (parts.length === 2) return { first: parts[0]!, last: parts[1]! };
  return { first: parts[0]!, middle: parts.slice(1, -1).join(' '), last: parts[parts.length - 1]! };
}

// ---------------------------------------------------------------------------
// The mapper
// ---------------------------------------------------------------------------

export function toNeotechOrder(order: SourceOrder, clinical: ClinicalIntake): Order {
  const gender = clinical.gender ?? (order.user.gender ? toNeotechGender(order.user.gender) : undefined);
  const dob = clinical.dob ?? order.user.dateOfBirth ?? undefined;
  const age = clinical.age ?? (dob ? ageFrom(dob) : undefined);

  // Checked before assembling rather than after, so the error names what is
  // missing instead of surfacing as a zod failure on a half-built object.
  const missing: string[] = [];
  if (!gender) missing.push('gender');
  if (age === undefined) missing.push('age (no dob on the account and none supplied)');
  if (!clinical.height) missing.push('height');
  if (!clinical.weight) missing.push('weight');
  if (!clinical.ethinicity) missing.push('ethinicity');
  if (!clinical.sampleId) missing.push('sampleId (kit barcode)');
  if (!clinical.specialist?.doctorFName) missing.push('specialist.doctorFName');
  if (missing.length) throw new MissingClinicalDataError(missing);

  // The address holds the name the kit was actually sent to, which is the person
  // the sample belongs to. The account name may be whoever paid.
  const name = splitName(order.address.fullName || order.user.name || '');

  const collection = clinical.collectionDate ?? order.slotDate ?? order.paidAt ?? order.createdAt;
  const testDate = toNeotechDate(collection);
  const expectedTAT = expectedTatFrom(collection);

  // ONE SAMPLE, MANY TESTS. Every package on the order is read off the same
  // saliva kit, so they belong in one sample block sharing one barcode - not one
  // sample each. Splitting them would present as duplicate barcodes on their side.
  const tests: Test[] = order.items.map((item) => {
    const mapping = resolveTest(item.slugSnapshot);
    return {
      testName: mapping.testName,
      testIds: mapping.testIds.join(','), // rule 5: commas, no spaces
      expectedTAT,
    };
  });

  const sampleType = order.items.length
    ? resolveTest(order.items[0]!.slugSnapshot).sampleType
    : ('SALIVA' as SampleType);

  const sample: Sample = {
    sampleId: clinical.sampleId,
    sampleType,
    testDate,
    testTime: clinical.collectionTime ?? '',
    tests,
  };

  const line2 = order.address.line2 ? `, ${order.address.line2}` : '';
  const fullAddress = `${order.address.line1}${line2}, ${order.address.area}, ${order.address.city} ${order.address.pincode}`;

  const forward = order.shipments?.find((s) => s.awb);

  return {
    // orderNo, patientId and shipmentNo are theirs to mint. Rule 10.
    orderDate: toNeotechDate(order.paidAt ?? order.createdAt),
    externalRef: order.orderNumber,
    patient: {
      patientFName: name.first,
      ...(name.middle ? { patientMName: name.middle } : {}),
      ...(name.last ? { patientLName: name.last } : {}),
      gender: gender!,
      ...(dob ? { dob: toNeotechDate(dob) } : {}),
      age: age!,
      height: clinical.height,
      unit: clinical.heightUnit,
      weight: clinical.weight,
      ...(clinical.mrno ? { mrno: clinical.mrno } : {}),
      address: fullAddress,
      city: order.address.city,
      country: 'India',
      phoneNo: order.address.phone,
      mobileNo: order.address.phone,
      email: order.user.email ?? '',
      ...(clinical.nationality ? { nationality: clinical.nationality } : {}),
      ethinicity: clinical.ethinicity,
      ...(clinical.lifestyle ? { lifestyle: clinical.lifestyle } : {}),
      // Rule 9. A paid order cannot exist without the consent captured at
      // checkout, and this mapper is only ever called on paid orders.
      isPatientConsent: 'Yes',
      ...(clinical.history ? { history: clinical.history } : {}),
    },
    specialist: clinical.specialist,
    samples: [sample],
    ...(clinical.ami ? { ami: clinical.ami } : {}),
    ...(forward
      ? {
          shipment: {
            courierNo: forward.awb!,
            courierDate: toNeotechDate(forward.createdAt),
            courierService: forward.courier,
          },
        }
      : {}),
  };
}
