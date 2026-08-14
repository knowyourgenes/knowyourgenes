// Public API for the contact feature.
//
// SERVER + schema only. Per this repo's convention (CLAUDE.md §10), UI is
// imported by sub-path - `@/features/contact/components/ContactPage` - so that
// nothing on the client can transitively pull in `contact.service.ts`, which is
// marked `server-only` and would fail the build if it were ever bundled.
export { contactSchema, CONTACT_TOPICS } from './schemas/contact.schema';
export type { ContactInput, ContactTopic } from './schemas/contact.schema';
export { submitContactMessage } from './server/contact.service';
export type { ContactResult } from './server/contact.service';
