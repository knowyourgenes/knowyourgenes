/**
 * Neotech ("Know Your Genes") Vendor Panel order schema.
 *
 * THEIR SHAPE, NOT OURS. Every field name, enum value and format below is copied
 * from the live panel at pensive.one/VendorPanel. Several are misspelled
 * (`ethinicity`, `cholestrol`, `hdl_ldlRatio`) and that is deliberate: those are
 * the keys their endpoint reads. Correcting one here silently drops the value on
 * their side, which is worse than an ugly identifier.
 *
 * Nesting is three deep and does not match ours:
 *
 *   ORDER  1 - n  SAMPLE  1 - n  TEST
 *
 * One physical sample carries several tests, so `sampleId` repeats across test
 * blocks. Status lives on the TEST, never on the order.
 *
 * DATES ARE dd/mm/yyyy ON THE WIRE. Their shipment list renders yyyy-mm-dd, so
 * reads must tolerate both; writes must not.
 */

/** `dd/mm/yyyy`. Aliased so the intent survives being passed around as a string. */
export type NeotechDate = string;

/** `HH:mm`, or empty. Collection time is frequently blank in their own data. */
export type NeotechTime = string;

export type Gender = 'M' | 'F' | 'O';

/**
 * The height unit, expressed as its multiplier to centimetres - which is what
 * their form actually posts. `1` is cm, `2.54` is inches, `30.48` is feet.
 */
export type HeightUnit = '1' | '2.54' | '30.48';

export type SampleType = 'SALIVA' | 'BLOOD' | 'SWAB' | 'BUCCAL SWAB';

export type Smoking = 'No' | 'Yes';

export type Alcoholic = 'No' | 'Occasional' | 'Regular' | 'Drunkyard';

export type Lifestyle = 'No Activity' | 'Light Activity' | 'Moderate Activity' | 'Extreme Activity';

export type YesNo = 'Yes' | 'No';

/**
 * Their ethnicity list, verbatim, including the bare abbreviations that sit
 * alongside their own expansions (`NI` and `North Indian` are both present).
 * `NoSelect` is the unset sentinel their form posts and is deliberately absent
 * here - it is not a value any real order may carry.
 */
export const ETHNICITIES = [
  'North Indian',
  'African Black',
  'Arabic',
  'Asian',
  'Caucasian',
  'Central Indian',
  'East Indian',
  'EI',
  'European',
  'Indian',
  'N/A',
  'NI',
  'Others',
  'Pakistani',
  'SI',
  'South Indian',
  'West Indian',
  'WI',
] as const;

export type Ethnicity = (typeof ETHNICITIES)[number];

export interface FamilyHistoryEntry {
  condition: string;
  relationship: string;
}

export interface PatientHistory {
  patientHistory: string;
  smoking: Smoking;
  alcoholic: Alcoholic;
  medicalHistory: string;
  medication: string;
  /** Serialised as index-paired `familyHistory[]` / `relationship[]` arrays. */
  familyHistory: FamilyHistoryEntry[];
}

export interface Patient {
  /** Issued by THEM: `KYG` + YYMMDD + 3-digit daily sequence. Absent until they mint it. */
  patientId?: string;
  patientFName: string;
  patientMName?: string;
  patientLName?: string;
  gender: Gender;
  /** dd/mm/yyyy */
  dob?: NeotechDate;
  age: number;
  height: number;
  unit: HeightUnit;
  /** kilograms */
  weight: number;
  /** Medical Record No. */
  mrno?: string;
  address?: string;
  city?: string;
  /** Full country name as text, e.g. `India`. `N/A` is accepted. */
  country?: string;
  phoneNo?: string;
  mobileNo?: string;
  email?: string;
  nationality?: string;
  /** Their spelling. Do not correct. */
  ethinicity: Ethnicity;
  lifestyle?: Lifestyle;
  isPatientConsent: YesNo;
  history?: PatientHistory;
}

export interface Specialist {
  doctorFName: string;
  doctorLName?: string;
  /** Must exist in their Hospitals master. `N/A` when there is none. */
  hospital?: string;
  /** Dependent on `hospital`. `N/A` when there is none. */
  clinic?: string;
  docMobileNo?: string;
  docEmail?: string;
}

/**
 * The acute-myocardial-infarction study block. Cardiac orders only, and every
 * field is optional even then.
 */
export interface AmiBlock {
  /** Prolonged chest pain over 30 min with ST elevation over 0.5 mV on two adjacent leads. */
  chestPain?: boolean;
  cardiacEnzyme?: boolean;
  /** Total cholesterol, mmol/l. Their spelling. */
  cholestrol?: number;
  hdl?: number;
  cholestrolHdlRatio?: number;
  ldl?: number;
  hdl_ldlRatio?: number;
  triglycerides?: number;
  hbValue?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  medications?: string;
  echocardiography?: string;
  /** Non-invasive cardiac CT: calcified plaque / CAD risk. */
  nct?: string;
  /** CH0:HMG ratio, for patients on statin therapy. */
  metabolomeRatio?: string;
}

export interface Test {
  testName: string;
  /**
   * Comma-separated, NO SPACES, even for a single id. A panel is one test with
   * several ids - never several test objects.
   */
  testIds: string;
  /** dd/mm/yyyy. Observed as testDate + 28 days. */
  expectedTAT: NeotechDate;
  /** Workflow stage, set by the lab. e.g. `Genotyping`. */
  status?: string;
}

export interface Sample {
  /** Vendor-assigned barcode. Repeats across every test run off this one sample. */
  sampleId: string;
  sampleType: SampleType;
  /** dd/mm/yyyy - collection date. */
  testDate: NeotechDate;
  testTime?: NeotechTime;
  tests: Test[];
}

export interface Shipment {
  /** Issued by them: `SH` + `KYG` + YYMMDD + 4-digit sequence. */
  shipmentNo?: string;
  /** AWB / tracking number. */
  courierNo: string;
  courierDate: NeotechDate;
  /** Carrier name. */
  courierService: string;
  /** Their `orderNo` values. */
  orders?: string[];
  status?: string;
}

export interface Order {
  /** Issued by them: `OR-` + YYMMDD + 5-digit sequence. Absent on submission. */
  orderNo?: string;
  orderDate: NeotechDate;
  patient: Patient;
  specialist: Specialist;
  samples: Sample[];
  /**
   * Our own order number, so reconciliation is possible without inventing a
   * value in their format. Rule 10: never fabricate their identifiers.
   */
  externalRef?: string;
  shipment?: Shipment;
  ami?: AmiBlock;
}
