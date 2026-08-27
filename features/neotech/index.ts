/**
 * Neotech Vendor Panel integration - the public surface.
 *
 * The mapper and the form serialiser are server-only. Types, the schema and the
 * test catalogue are safe on either side, which is what lets an admin screen
 * show "this package has no Neotech code yet" without pulling Prisma into the
 * bundle.
 */

export type {
  Alcoholic,
  AmiBlock,
  Ethnicity,
  FamilyHistoryEntry,
  Gender,
  HeightUnit,
  Lifestyle,
  NeotechDate,
  NeotechTime,
  Order,
  Patient,
  PatientHistory,
  Sample,
  SampleType,
  Shipment,
  Smoking,
  Specialist,
  Test,
  YesNo,
} from './types';
export { ETHNICITIES } from './types';

export {
  amiSchema,
  orderSchema,
  orderSchemaLenient,
  patientSchema,
  sampleSchema,
  shipmentSchema,
  specialistSchema,
  specialistSchemaLenient,
  testSchema,
  validateNeotechOrder,
  type ValidateOptions,
  type ValidatedOrder,
} from './schemas/neotech.schema';

export { TEST_CATALOGUE, UnmappedPackageError, isMapped, resolveTest, type NeotechTestMapping } from './test-catalogue';

export {
  HEIGHT_UNIT,
  MissingClinicalDataError,
  TAT_DAYS,
  ageFrom,
  expectedTatFrom,
  fromNeotechDate,
  splitName,
  toNeotechDate,
  toNeotechGender,
  toNeotechOrder,
  toNeotechSampleType,
  type ClinicalIntake,
  type SourceOrder,
} from './server/neotech.mapper';

export {
  buildPatientFormData,
  buildPatientFormDataFromOrder,
  formDataToObject,
  type PatientFormExtras,
} from './server/neotech.form';
