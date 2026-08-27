import type { SampleType } from './types';

/**
 * Our package slug to their test panel.
 *
 * THIS TABLE IS THE INTEGRATION. Their test ids are opaque - `NMC-WL01.04` says
 * nothing about what it measures - so nothing can derive this and nothing can
 * validate it for us. A wrong mapping here does not fail: it orders the wrong
 * assay on a real person and comes back as a confident report about the wrong
 * thing. It has to be checked against their catalogue by a human, and rechecked
 * whenever either side adds a package.
 *
 * A PANEL IS ONE TEST WITH SEVERAL IDS. `My Wellness` is one `testName` carrying
 * four sub-panel ids in one comma-separated string, not four test objects. The
 * ids are listed here in the order their own order row showed them, which is not
 * sorted - preserved rather than tidied, in case the order carries meaning to
 * their pipeline.
 *
 * ONLY TWO ENTRIES ARE CONFIRMED. Everything else in our catalogue has no known
 * Neotech code, and `resolveTest` refuses rather than guessing.
 */

export interface NeotechTestMapping {
  testName: string;
  /** In their own order, not sorted. Joined with commas, no spaces, at emit time. */
  testIds: string[];
  sampleType: SampleType;
}

export const TEST_CATALOGUE: Record<string, NeotechTestMapping> = {
  // Confirmed against a live order row on their panel.
  'cardiometabolic-test': {
    testName: 'Cardiometabolic Test',
    testIds: ['NMC-CT01'],
    sampleType: 'SALIVA',
  },
  'my-wellness': {
    testName: 'My Wellness',
    testIds: ['NMC-WL01.04', 'NMC-WL01.01', 'NMC-WL01.02', 'NMC-WL01.03'],
    sampleType: 'SALIVA',
  },
};

export class UnmappedPackageError extends Error {
  constructor(public readonly slug: string) {
    super(
      `No Neotech test id is known for package "${slug}". Add it to TEST_CATALOGUE ` +
        `only after confirming the code against their catalogue - a guessed id orders the wrong assay.`
    );
    this.name = 'UnmappedPackageError';
  }
}

/** Throws rather than guessing. An unmapped package must stop the export. */
export function resolveTest(slug: string): NeotechTestMapping {
  const hit = TEST_CATALOGUE[slug];
  if (!hit) throw new UnmappedPackageError(slug);
  return hit;
}

export function isMapped(slug: string): boolean {
  return slug in TEST_CATALOGUE;
}
