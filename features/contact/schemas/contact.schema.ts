import { z } from 'zod';

/**
 * Contact-form payload.
 *
 * Mirrors `model ContactMessage` in prisma/schema.prisma 1:1 (name, email,
 * phone?, topic, message) so the validated object can be handed to Prisma
 * without a second mapping layer.
 *
 * `consent` is validated but NOT persisted: the design requires the box before
 * submit, and the checkbox itself is the record that it was shown. If you ever
 * need to prove consent per message, add a column rather than inferring it.
 */

/** Values for the "What's it about?" select. Kept here so the form options and
 *  the server validation can never drift apart. */
export const CONTACT_TOPICS = [
  'My report',
  'Booking a test',
  'Which test is right for me',
  'Order or delivery',
  'Refund or cancellation',
  'Partnership or press',
  'Something else',
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120, 'That name is too long'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200),
  // Optional, but if given it must look like a phone number. `''` is coerced to
  // undefined first so an untouched field does not trip the format check.
  phone: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional()
    .refine((v) => v === undefined || /^[+\d][\d\s\-()]{6,19}$/.test(v), 'Please enter a valid phone number'),
  topic: z.enum(CONTACT_TOPICS, { message: 'Please choose a topic' }),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters)')
    .max(4000, 'Please keep it under 4000 characters'),
  consent: z.literal(true, { message: 'Please accept the privacy notice to continue' }),
  /**
   * Honeypot. Deliberately permissive: if this rejected a non-empty value here,
   * a bot would get a 422 naming `website` and immediately learn which field to
   * leave alone. Instead it passes validation and the ROUTE quietly discards the
   * submission with a normal-looking 201, so success and rejection are
   * indistinguishable from the outside.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
