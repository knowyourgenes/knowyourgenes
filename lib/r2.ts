/**
 * Cloudflare R2 client. R2 is S3-compatible, so we use @aws-sdk/client-s3
 * pointed at R2's endpoint. Reports and other private documents go here.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID         - Cloudflare account id
 *   R2_ACCESS_KEY_ID      - R2 API token access key
 *   R2_SECRET_ACCESS_KEY  - R2 API token secret
 *   R2_BUCKET             - bucket name (e.g. "kyg-reports")
 *
 * Notes:
 *   - We never expose objects publicly; downloads are always via short-lived
 *     presigned GETs (default 10 minutes).
 *   - Region must be "auto" for R2.
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? '';
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID ?? '';
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY ?? '';
const BUCKET = process.env.R2_BUCKET ?? '';
const ENDPOINT = ACCOUNT_ID ? `https://${ACCOUNT_ID}.r2.cloudflarestorage.com` : '';

export const R2_CONFIGURED = Boolean(ACCOUNT_ID && ACCESS_KEY && SECRET_KEY && BUCKET);

let _client: S3Client | null = null;
function client(): S3Client {
  if (!R2_CONFIGURED) {
    throw new Error('R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.');
  }
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
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
