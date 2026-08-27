import { z } from 'zod';

import { fail, handle, ok } from '@/server/api';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { completePasswordSetup, requestPasswordSetup } from '@/features/auth/server/password-reset';

/**
 * Password setup and reset.
 *
 *   POST { email }                    -> emails a one-time link
 *   POST { email, token, password }   -> sets the password
 *
 * One route, two shapes, because they are two halves of one act and splitting
 * them buys nothing but a second file to keep in step.
 *
 * THE RESPONSE TO A REQUEST IS ALWAYS THE SAME, registered address or not. A
 * different answer for "no such account" would make this an account-existence
 * oracle, which is the thing /api/checkout is careful not to be. Both halves are
 * rate limited: the first because it sends mail on demand, the second because a
 * token is a secret worth guessing at.
 */

const requestSchema = z.object({
  email: z.string().email(),
});

const completeSchema = z.object({
  email: z.string().email(),
  token: z.string().min(16),
  password: z.string().min(8, 'Use at least 8 characters'),
});

const SAME_ANSWER =
  'If that address has an account, we have sent it a link to set a password. Check your inbox, and your spam folder.';

export async function POST(req: Request) {
  return handle(async () => {
    const ip = clientIp(req);
    const body = (await req.json()) as unknown;

    // The completion shape carries a token; the request shape does not.
    const isCompletion = typeof (body as { token?: unknown })?.token === 'string';

    if (isCompletion) {
      if (rateLimited('pwset-complete', ip, { windowMs: 15 * 60_000, max: 10 })) {
        return fail('Too many attempts. Please try again in a few minutes.', 429);
      }

      const input = completeSchema.parse(body);
      const result = await completePasswordSetup(input.email, input.token, input.password);

      if (!result.ok) {
        return fail(
          result.reason === 'expired'
            ? 'That link has expired. Request a new one and it will be sent straight away.'
            : 'That link is not valid. It may already have been used - request a new one.',
          400
        );
      }

      return ok({ done: true });
    }

    if (rateLimited('pwset-request', ip, { windowMs: 15 * 60_000, max: 5 })) {
      // Deliberately the same wording as success. A 429 that reads differently
      // still leaks which addresses are worth retrying.
      return fail(SAME_ANSWER, 429);
    }

    const input = requestSchema.parse(body);
    await requestPasswordSetup(input.email);
    return ok({ message: SAME_ANSWER });
  });
}
