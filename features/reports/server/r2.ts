/**
 * Private object storage for reports and other confidential documents.
 *
 * PROVIDER-AGNOSTIC ON PURPOSE. Both Cloudflare R2 and Backblaze B2 speak the
 * S3 API, so the only thing that varies between them is the endpoint, the
 * region, and the shape of the credentials - never the calls. Everything below
 * (`putObject`, `presignGet`, ...) is unchanged whichever is configured, so
 * switching provider is an env change and no call site moves.
 *
 * CONFIGURE ONE OF TWO WAYS.
 *
 *   Backblaze B2 (or any S3-compatible store) - preferred, explicit:
 *     STORAGE_ENDPOINT      https://s3.us-west-004.backblazeb2.com
 *     STORAGE_REGION        us-west-004        (must match the endpoint)
 *     STORAGE_ACCESS_KEY_ID the key's keyID
 *     STORAGE_SECRET_KEY    the applicationKey
 *     STORAGE_BUCKET        kyg-reports
 *
 *   Cloudflare R2 - the original vars, still honoured so nothing breaks:
 *     R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET
 *   The endpoint is derived from the account id and the region is "auto",
 *   which is the only value R2 accepts.
 *
 * USE A BUCKET-SCOPED KEY, NEVER A MASTER KEY. A B2 master application key
 * cannot be restricted: it can delete every bucket on the account and manage
 * billing. This process only ever needs readFiles + writeFiles on one bucket,
 * so that is all its key should carry - then a leak costs you the reports
 * bucket rather than the account.
 *
 * Objects are never public. Downloads always go through a short-lived presigned
 * GET (10 minutes by default), because these are people's genetic reports.
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? '';

/** Explicit S3 settings win; the R2_* vars are the fallback. */
const ACCESS_KEY = process.env.STORAGE_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '';
const SECRET_KEY = process.env.STORAGE_SECRET_KEY || process.env.R2_SECRET_ACCESS_KEY || '';
const BUCKET = process.env.STORAGE_BUCKET || process.env.R2_BUCKET || '';
const ENDPOINT =
  process.env.STORAGE_ENDPOINT ||
  (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');

/**
 * B2 rejects a mismatched region, so it must be stated. R2 accepts only
 * "auto", which is therefore the default when no region is given.
 */
const REGION = process.env.STORAGE_REGION || 'auto';

/**
 * An endpoint is what actually decides whether this is usable - the account id
 * only ever mattered as a way to build R2's. Checking the endpoint means a B2
 * setup with no R2_ACCOUNT_ID reads as configured, which it is.
 */
export const R2_CONFIGURED = Boolean(ENDPOINT && ACCESS_KEY && SECRET_KEY && BUCKET);

/** Alias under a provider-neutral name; R2_CONFIGURED is kept for call sites. */
export const STORAGE_CONFIGURED = R2_CONFIGURED;

/** Which provider the current config points at - for diagnostics only. */
export const STORAGE_PROVIDER = !ENDPOINT
  ? 'none'
  : ENDPOINT.includes('backblazeb2.com')
    ? 'backblaze-b2'
    : ENDPOINT.includes('r2.cloudflarestorage.com')
      ? 'cloudflare-r2'
      : 's3-compatible';

let _client: S3Client | null = null;
function client(): S3Client {
  if (!R2_CONFIGURED) {
    throw new Error(
      'Object storage not configured. Set STORAGE_ENDPOINT, STORAGE_REGION, ' +
        'STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_KEY and STORAGE_BUCKET ' +
        '(or the legacy R2_* equivalents).'
    );
  }
  if (!_client) {
    _client = new S3Client({
      region: REGION,
      endpoint: ENDPOINT,
      credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
    });
  }
  return _client;
}

/** Upload a buffer to R2 with the given key + content type. */
export async function putObject(opts: {
  key: string;
  body: Uint8Array | Buffer;
  contentType: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; etag?: string }> {
  const out = await client().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      ContentDisposition: opts.contentDisposition,
      Metadata: opts.metadata,
    })
  );
  return { key: opts.key, etag: out.ETag };
}

/** Generate a short-lived presigned GET URL. Default 10 minutes. */
export async function presignDownload(key: string, expiresInSeconds = 600): Promise<string> {
  return getSignedUrl(client(), new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: expiresInSeconds });
}

/** Generate a presigned PUT URL (for browser direct-upload flows). */
export async function presignUpload(opts: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  return getSignedUrl(
    client(),
    new PutObjectCommand({ Bucket: BUCKET, Key: opts.key, ContentType: opts.contentType }),
    { expiresIn: opts.expiresInSeconds ?? 300 }
  );
}

export async function deleteObject(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await client().send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Build a deterministic object key for a report. */
export function reportKey(orderNumber: string, reportNumber: string): string {
  return `reports/${orderNumber}/${reportNumber}.pdf`;
}

/**
 * Reads an object into memory.
 *
 * FOR ATTACHING, NOT FOR SERVING. Every download path hands out a presigned URL
 * so the bytes go straight from storage to the reader and never occupy this
 * process. This exists for the one case where we genuinely need the content
 * server-side - putting a report PDF into an email - and it buffers the whole
 * object, so the caller must know the size is sane before calling.
 */
export async function getObjectBytes(key: string): Promise<{ body: Buffer; contentType: string; size: number }> {
  const res = await client().send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  if (!res.Body) throw new Error(`Object has no body: ${key}`);

  const bytes = await res.Body.transformToByteArray();
  return {
    body: Buffer.from(bytes),
    contentType: res.ContentType ?? 'application/octet-stream',
    size: bytes.length,
  };
}

/** Size in bytes without fetching the object. */
export async function objectSize(key: string): Promise<number | null> {
  try {
    const res = await client().send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return res.ContentLength ?? null;
  } catch {
    return null;
  }
}
