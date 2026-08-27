import 'server-only';

import type { AmiBlock, Order, Patient, Specialist } from '../types';

/**
 * Serialises a patient for `POST /VendorPanel/savePatientDetails/`.
 *
 * FIELD NAMES ARE THEIRS, VERBATIM, including `ethinicity`, `cholestrol`,
 * `hdl_ldlRatio`, `mrno`, `docEmail` and `course_trf_img_file`. Rule 2. A
 * corrected spelling is not a nicer version of the same request - it is a field
 * their handler does not read, so the value silently never arrives.
 *
 * multipart/form-data rather than JSON because their endpoint takes a file
 * upload (the TRF) alongside the fields, and the boundary is built by FormData
 * rather than by hand.
 */

/**
 * Their checkboxes post `on` when ticked and are ABSENT when not.
 *
 * Sending `off`, `false` or an empty string reads as ticked to most form
 * handlers, since presence is the signal. So an unticked box must be omitted
 * entirely, which is why every append here is conditional.
 */
const CHECKBOX_ON = 'on';

function appendIf(form: FormData, key: string, value: string | number | undefined | null): void {
  if (value === undefined || value === null) return;
  const s = String(value);
  if (s === '') return;
  form.append(key, s);
}

/** Always appended, even when empty - these are the fields their form posts unconditionally. */
function appendAlways(form: FormData, key: string, value: string | number | undefined | null): void {
  form.append(key, value === undefined || value === null ? '' : String(value));
}

export interface PatientFormExtras {
  /** The TRF or any supporting document. Optional. */
  trf?: { blob: Blob; filename: string };
  ami?: AmiBlock;
}

export function buildPatientFormData(
  patient: Patient,
  specialist: Specialist,
  extras: PatientFormExtras = {}
): FormData {
  const form = new FormData();

  // ---- 3.1 specialist ----------------------------------------------------
  appendAlways(form, 'doctorFName', specialist.doctorFName);
  appendAlways(form, 'doctorLName', specialist.doctorLName);
  // Their selects default to the literal string N/A rather than empty, and an
  // empty value fails their dependent-dropdown validation.
  appendAlways(form, 'hospital', specialist.hospital || 'N/A');
  appendAlways(form, 'clinic', specialist.clinic || 'N/A');
  appendAlways(form, 'docMobileNo', specialist.docMobileNo);
  appendAlways(form, 'docEmail', specialist.docEmail);

  // ---- 3.2 identity ------------------------------------------------------
  appendAlways(form, 'patientFName', patient.patientFName);
  appendAlways(form, 'patientMName', patient.patientMName);
  appendAlways(form, 'patientLName', patient.patientLName);
  appendAlways(form, 'gender', patient.gender);
  appendIf(form, 'dob', patient.dob);
  appendAlways(form, 'age', patient.age);
  appendAlways(form, 'height', patient.height);
  // The cm multiplier, not the unit name. Rule 4.
  appendAlways(form, 'unit', patient.unit);
  appendAlways(form, 'weight', patient.weight);
  appendAlways(form, 'mrno', patient.mrno);
  appendAlways(form, 'address', patient.address);
  appendAlways(form, 'city', patient.city);
  appendAlways(form, 'country', patient.country || 'N/A');
  appendAlways(form, 'phoneNo', patient.phoneNo);
  appendAlways(form, 'mobileNo', patient.mobileNo);
  appendAlways(form, 'email', patient.email);
  appendAlways(form, 'nationality', patient.nationality);
  // Their spelling. Rule 2.
  appendAlways(form, 'ethinicity', patient.ethinicity);
  appendIf(form, 'lifestyle', patient.lifestyle);

  // ---- 3.3 history -------------------------------------------------------
  const h = patient.history;
  appendAlways(form, 'patientHistory', h?.patientHistory);
  appendAlways(form, 'smoking', h?.smoking ?? 'No');
  appendAlways(form, 'alcoholic', h?.alcoholic ?? 'No');
  appendAlways(form, 'medicalHistory', h?.medicalHistory);
  appendAlways(form, 'medication', h?.medication);

  // INDEX-PAIRED ARRAYS. `familyHistory[]` and `relationship[]` are two parallel
  // repeated fields matched by position, not a list of pairs - so both must be
  // appended once per entry, in the same order, and neither may be skipped for a
  // blank value or every later pair shifts by one.
  for (const entry of h?.familyHistory ?? []) {
    form.append('familyHistory[]', entry.condition);
    form.append('relationship[]', entry.relationship);
  }

  // Rule 9.
  appendAlways(form, 'isPatientConsent', patient.isPatientConsent);

  // ---- 3.4 AMI block -----------------------------------------------------
  const ami = extras.ami;
  if (ami) {
    if (ami.chestPain) form.append('chestPain', CHECKBOX_ON);
    if (ami.cardiacEnzyme) form.append('cardiacEnzyme', CHECKBOX_ON);
    appendIf(form, 'cholestrol', ami.cholestrol);
    appendIf(form, 'hdl', ami.hdl);
    appendIf(form, 'cholestrolHdlRatio', ami.cholestrolHdlRatio);
    appendIf(form, 'ldl', ami.ldl);
    appendIf(form, 'hdl_ldlRatio', ami.hdl_ldlRatio);
    appendIf(form, 'triglycerides', ami.triglycerides);
    appendIf(form, 'hbValue', ami.hbValue);
    appendIf(form, 'bp_systolic', ami.bp_systolic);
    appendIf(form, 'bp_diastolic', ami.bp_diastolic);
    appendIf(form, 'medications', ami.medications);
    appendIf(form, 'echocardiography', ami.echocardiography);
    appendIf(form, 'nct', ami.nct);
    appendIf(form, 'metabolomeRatio', ami.metabolomeRatio);
  }

  // ---- file --------------------------------------------------------------
  if (extras.trf) {
    form.append('course_trf_img_file', extras.trf.blob, extras.trf.filename);
  }

  return form;
}

/** Convenience for the common case of serialising a whole mapped order. */
export function buildPatientFormDataFromOrder(order: Order, extras: PatientFormExtras = {}): FormData {
  return buildPatientFormData(order.patient, order.specialist, { ami: order.ami, ...extras });
}

/**
 * Renders a FormData as a plain object for assertions and logging.
 *
 * Repeated keys - the `[]` arrays - collapse to a string array, which is what
 * makes an index-pairing bug visible in a test rather than only on their side.
 * Files become a placeholder; their bytes are not what anyone is checking.
 */
export function formDataToObject(form: FormData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of form.entries()) {
    const v = typeof value === 'string' ? value : `[file:${(value as File).name}]`;
    const existing = out[key];
    if (existing === undefined) out[key] = v;
    else if (Array.isArray(existing)) existing.push(v);
    else out[key] = [existing, v];
  }
  return out;
}
