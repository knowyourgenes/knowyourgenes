import { describe, expect, it } from 'vitest';

import canonical from '@/features/neotech/fixtures/canonical-order.json';
import { buildPatientFormData, formDataToObject, validateNeotechOrder, type Order } from '@/features/neotech';
import {
  MissingClinicalDataError,
  ageFrom,
  expectedTatFrom,
  fromNeotechDate,
  splitName,
  toNeotechDate,
  toNeotechGender,
  toNeotechOrder,
  type ClinicalIntake,
  type SourceOrder,
} from '@/features/neotech/server/neotech.mapper';
import { UnmappedPackageError } from '@/features/neotech/test-catalogue';

/**
 * The fixture is their own order, copied from the spec. Anything that fails
 * against it is our bug, so it is the anchor for every test here.
 */
const FIXTURE = canonical as unknown as Order;

// A cardiometabolic + wellness order, matching the fixture, so the mapper output
// and the fixture can be compared field for field.
const SOURCE: SourceOrder = {
  orderNumber: 'KYG-2026-000042',
  createdAt: new Date(Date.UTC(2026, 6, 9)),
  paidAt: new Date(Date.UTC(2026, 6, 9)),
  slotDate: null,
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9810012345',
    dateOfBirth: new Date(Date.UTC(1985, 2, 12)),
    gender: 'MALE',
  },
  address: {
    fullName: 'John Doe',
    phone: '9810012345',
    line1: '12 Rose Villa',
    line2: null,
    area: 'Hauz Khas',
    city: 'New Delhi',
    pincode: '110016',
  },
  items: [
    { slugSnapshot: 'cardiometabolic-test', nameSnapshot: 'Cardiometabolic Test' },
    { slugSnapshot: 'my-wellness', nameSnapshot: 'My Wellness' },
  ],
};

const INTAKE: ClinicalIntake = {
  height: 175,
  heightUnit: '1',
  weight: 72,
  ethinicity: 'North Indian',
  sampleId: 'dxt01',
  specialist: { doctorFName: 'Arvind', doctorLName: 'Rao', hospital: 'N/A', clinic: 'N/A' },
  nationality: 'Indian',
  lifestyle: 'Moderate Activity',
  collectionTime: '',
};

// ---------------------------------------------------------------------------

describe('the canonical fixture', () => {
  it('validates as their panel presents it, once the specialist rule is relaxed', () => {
    const result = validateNeotechOrder(FIXTURE, { requireSpecialist: false });
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.ok).toBe(true);
  });

  it('documents the contradiction: their own example fails their own rule 8', () => {
    // Section 3.1 marks doctorFName required and rule 8 lists it among the
    // fields whose absence gets a payload rejected - yet the section-6 example
    // carries an empty one. This test exists so the conflict is recorded rather
    // than resolved by a guess sitting unexamined inside the validator. When
    // someone confirms which reading their endpoint takes, one of these two
    // tests is deleted and the default changes with it.
    const strict = validateNeotechOrder(FIXTURE);
    expect(strict.ok).toBe(false);
    if (!strict.ok) expect(strict.errors).toEqual(['specialist.doctorFName: doctorFName is required']);
  });

  it('round-trips through JSON without drift', () => {
    const again = JSON.parse(JSON.stringify(FIXTURE));
    expect(again).toEqual(FIXTURE);
    expect(validateNeotechOrder(again, { requireSpecialist: false }).ok).toBe(true);
  });

  it('keeps one sampleId across several tests', () => {
    // Rule 6. Two tests, one physical tube, one barcode.
    expect(FIXTURE.samples).toHaveLength(1);
    expect(FIXTURE.samples[0]!.tests).toHaveLength(2);
    expect(FIXTURE.samples[0]!.sampleId).toBe('dxt01');
  });

  it('carries status on the test, not the order', () => {
    // Rule 7.
    expect(FIXTURE.samples[0]!.tests[0]!.status).toBe('Genotyping');
    expect(FIXTURE).not.toHaveProperty('status');
  });
});

describe('dates', () => {
  it('emits dd/mm/yyyy', () => {
    expect(toNeotechDate(new Date(Date.UTC(2026, 6, 9)))).toBe('09/07/2026');
    // Single digits must stay padded, or their parser reads 9/7 as an ISO month.
    expect(toNeotechDate(new Date(Date.UTC(2026, 0, 1)))).toBe('01/01/2026');
  });

  it('reads both formats, because their shipment list uses the other one', () => {
    expect(fromNeotechDate('09/07/2026').toISOString()).toBe('2026-07-09T00:00:00.000Z');
    expect(fromNeotechDate('2026-07-09').toISOString()).toBe('2026-07-09T00:00:00.000Z');
  });

  it('rejects a date that is well formed but not real', () => {
    const bad = structuredClone(FIXTURE);
    bad.samples[0]!.testDate = '31/02/2026';
    const r = validateNeotechOrder(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join()).toMatch(/real calendar date/);
  });

  it('rejects mm/dd/yyyy that happens to look valid', () => {
    // 07/09/2026 is a legal dd/mm date, so this is not caught by shape - which is
    // exactly why the mapper must never be bypassed with hand-typed dates.
    const bad = structuredClone(FIXTURE);
    bad.orderDate = '2026-07-09';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });

  it('sets the TAT 28 days out', () => {
    expect(expectedTatFrom(new Date(Date.UTC(2026, 6, 9)))).toBe('06/08/2026');
  });

  it('derives age the way their form does', () => {
    const dob = new Date(Date.UTC(1985, 2, 12));
    expect(ageFrom(dob, new Date(Date.UTC(2026, 2, 11)))).toBe(40); // day before
    expect(ageFrom(dob, new Date(Date.UTC(2026, 2, 12)))).toBe(41); // birthday
  });
});

describe('testIds', () => {
  it('accepts a single id and a comma-joined panel', () => {
    expect(validateNeotechOrder(FIXTURE, { requireSpecialist: false }).ok).toBe(true);
  });

  it('rejects a space after the comma', () => {
    // Rule 5. The likeliest hand-editing mistake, and invisible on screen.
    const bad = structuredClone(FIXTURE);
    bad.samples[0]!.tests[1]!.testIds = 'NMC-WL01.04, NMC-WL01.01';
    const r = validateNeotechOrder(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join()).toMatch(/no whitespace/);
  });

  it('rejects a trailing comma', () => {
    const bad = structuredClone(FIXTURE);
    bad.samples[0]!.tests[0]!.testIds = 'NMC-CT01,';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });

  it('rejects the same id claimed by two different test names', () => {
    const bad = structuredClone(FIXTURE);
    bad.samples[0]!.tests[1]!.testIds = 'NMC-CT01';
    const r = validateNeotechOrder(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join()).toMatch(/claimed by both/);
  });
});

describe('the required set (rule 8) and the consent gate (rule 9)', () => {
  const required = ['patientFName', 'gender', 'age', 'height', 'unit', 'weight', 'ethinicity'] as const;

  for (const field of required) {
    it(`rejects a payload missing ${field}`, () => {
      const bad = structuredClone(FIXTURE);
      delete (bad.patient as unknown as Record<string, unknown>)[field];
      expect(validateNeotechOrder(bad).ok).toBe(false);
    });
  }

  it('rejects a payload missing doctorFName', () => {
    const bad = structuredClone(FIXTURE);
    bad.specialist.doctorFName = '';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });

  it('refuses an order without consent', () => {
    const bad = structuredClone(FIXTURE);
    (bad.patient as { isPatientConsent: string }).isPatientConsent = 'No';
    const r = validateNeotechOrder(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join()).toMatch(/consent must be Yes/);
  });

  it('rejects a full-word gender', () => {
    // Rule 3.
    const bad = structuredClone(FIXTURE);
    (bad.patient as { gender: string }).gender = 'Male';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });

  it('rejects a unit name in place of the multiplier', () => {
    // Rule 4.
    const bad = structuredClone(FIXTURE);
    (bad.patient as { unit: string }).unit = 'cm';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });

  it('rejects an age that contradicts the dob', () => {
    const bad = structuredClone(FIXTURE);
    bad.patient.age = 12;
    const r = validateNeotechOrder(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join()).toMatch(/age does not match dob/);
  });
});

describe('identifiers stay theirs (rule 10)', () => {
  it('the mapper emits no orderNo, patientId or shipmentNo', () => {
    const mapped = toNeotechOrder(SOURCE, INTAKE);
    expect(mapped.orderNo).toBeUndefined();
    expect(mapped.patient.patientId).toBeUndefined();
    expect(mapped.shipment?.shipmentNo).toBeUndefined();
  });

  it('our own number travels as externalRef', () => {
    expect(toNeotechOrder(SOURCE, INTAKE).externalRef).toBe('KYG-2026-000042');
  });

  it('rejects an id that does not match their pattern', () => {
    const bad = structuredClone(FIXTURE);
    bad.orderNo = 'ORDER-1';
    expect(validateNeotechOrder(bad).ok).toBe(false);
  });
});

describe('mapping our order to theirs', () => {
  it('produces a payload that validates', () => {
    const mapped = toNeotechOrder(SOURCE, INTAKE);
    const r = validateNeotechOrder(mapped);
    if (!r.ok) throw new Error(r.errors.join('\n'));
    expect(r.ok).toBe(true);
  });

  it('agrees with the fixture on every field it can know', () => {
    const mapped = toNeotechOrder(SOURCE, INTAKE);
    expect(mapped.orderDate).toBe(FIXTURE.orderDate);
    expect(mapped.patient.patientFName).toBe('John');
    expect(mapped.patient.patientLName).toBe('Doe');
    expect(mapped.patient.gender).toBe('M');
    expect(mapped.patient.dob).toBe('12/03/1985');
    expect(mapped.samples[0]!.sampleId).toBe('dxt01');
    expect(mapped.samples[0]!.sampleType).toBe('SALIVA');
    expect(mapped.samples[0]!.testDate).toBe('09/07/2026');
    expect(mapped.samples[0]!.tests.map((t) => t.testIds)).toEqual(FIXTURE.samples[0]!.tests.map((t) => t.testIds));
  });

  it('puts several packages in ONE sample, sharing one barcode', () => {
    // Rule 6. Two packages read off one saliva kit is one sample, two tests.
    const mapped = toNeotechOrder(SOURCE, INTAKE);
    expect(mapped.samples).toHaveLength(1);
    expect(mapped.samples[0]!.tests).toHaveLength(2);
  });

  it('names every missing clinical field at once rather than one per attempt', () => {
    const bare = { ...INTAKE, height: 0, weight: 0, sampleId: '' } as ClinicalIntake;
    try {
      toNeotechOrder(SOURCE, bare);
      throw new Error('should have refused');
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClinicalDataError);
      const missing = (err as MissingClinicalDataError).missing;
      expect(missing).toEqual(expect.arrayContaining(['height', 'weight', 'sampleId (kit barcode)']));
    }
  });

  it('refuses an account with no dob and no supplied age', () => {
    const noDob: SourceOrder = { ...SOURCE, user: { ...SOURCE.user, dateOfBirth: null } };
    expect(() => toNeotechOrder(noDob, INTAKE)).toThrow(MissingClinicalDataError);
  });

  it('refuses a package with no confirmed Neotech code rather than guessing', () => {
    const unknown: SourceOrder = { ...SOURCE, items: [{ slugSnapshot: 'skin-health', nameSnapshot: 'Skin' }] };
    expect(() => toNeotechOrder(unknown, INTAKE)).toThrow(UnmappedPackageError);
  });

  it('maps PREFER_NOT_TO_SAY to O rather than inventing a sex', () => {
    expect(toNeotechGender('PREFER_NOT_TO_SAY')).toBe('O');
    expect(toNeotechGender('OTHER')).toBe('O');
  });

  it('splits names without dropping a part', () => {
    expect(splitName('John Doe')).toEqual({ first: 'John', last: 'Doe' });
    expect(splitName('Ravi Shankar Kumar')).toEqual({ first: 'Ravi', middle: 'Shankar', last: 'Kumar' });
    expect(splitName('Meera')).toEqual({ first: 'Meera' });
  });
});

describe('savePatientDetails form', () => {
  const form = () => buildPatientFormData(FIXTURE.patient, FIXTURE.specialist);

  it('uses their spellings, not corrected ones', () => {
    // Rule 2. Correcting one of these drops the value silently on their side.
    const o = formDataToObject(form());
    expect(o).toHaveProperty('ethinicity', 'North Indian');
    expect(o).not.toHaveProperty('ethnicity');
    expect(o).toHaveProperty('mrno');
    expect(o).toHaveProperty('docEmail');
  });

  it('posts the height multiplier, not the unit name', () => {
    expect(formDataToObject(form()).unit).toBe('1');
  });

  it('pairs familyHistory[] with relationship[] by index', () => {
    const patient = structuredClone(FIXTURE.patient);
    patient.history!.familyHistory = [
      { condition: 'Diabetes', relationship: 'Father' },
      { condition: 'Hypertension', relationship: 'Mother' },
    ];
    const o = formDataToObject(buildPatientFormData(patient, FIXTURE.specialist));
    expect(o['familyHistory[]']).toEqual(['Diabetes', 'Hypertension']);
    expect(o['relationship[]']).toEqual(['Father', 'Mother']);
  });

  it('defaults hospital and clinic to N/A rather than empty', () => {
    const o = formDataToObject(buildPatientFormData(FIXTURE.patient, { doctorFName: 'A' }));
    expect(o.hospital).toBe('N/A');
    expect(o.clinic).toBe('N/A');
  });

  it('omits an unticked checkbox entirely', () => {
    // Presence is the signal - sending "off" would read as ticked.
    const on = formDataToObject(
      buildPatientFormData(FIXTURE.patient, FIXTURE.specialist, { ami: { chestPain: true } })
    );
    const off = formDataToObject(
      buildPatientFormData(FIXTURE.patient, FIXTURE.specialist, { ami: { chestPain: false } })
    );
    expect(on.chestPain).toBe('on');
    expect(off).not.toHaveProperty('chestPain');
  });

  it('carries the AMI numbers under their own spellings', () => {
    const o = formDataToObject(
      buildPatientFormData(FIXTURE.patient, FIXTURE.specialist, {
        ami: { cholestrol: 5.2, hdl_ldlRatio: 0.4, bp_systolic: 128 },
      })
    );
    expect(o.cholestrol).toBe('5.2');
    expect(o.hdl_ldlRatio).toBe('0.4');
    expect(o.bp_systolic).toBe('128');
  });

  it('attaches the TRF under their file field name', () => {
    const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    const o = formDataToObject(
      buildPatientFormData(FIXTURE.patient, FIXTURE.specialist, { trf: { blob, filename: 'trf.pdf' } })
    );
    expect(o.course_trf_img_file).toBe('[file:trf.pdf]');
  });

  it('sends consent', () => {
    expect(formDataToObject(form()).isPatientConsent).toBe('Yes');
  });
});
