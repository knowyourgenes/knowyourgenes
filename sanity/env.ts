export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

export const dataset = assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET, 'Missing env: NEXT_PUBLIC_SANITY_DATASET');

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

export const studioUrl = '/studio';

// Only used server-side for preview / draft fetches
export const readToken = process.env.SANITY_API_READ_TOKEN;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
