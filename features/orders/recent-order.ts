/**
 * The receipt cookie: which order THIS browser just paid for.
 *
 * A guest buys without an account, so when they land on the confirmation page
 * there is no session to prove the order is theirs - and `?order=` alone cannot
 * be trusted, because order numbers are sequential (KYG-2026-000412) and that
 * page prints a name, a full postal address and the exact genetic tests bought.
 * Enumerating it would be trivial.
 *
 * So /api/checkout/verify sets this cookie, httpOnly, at the moment a payment
 * is confirmed, and the success page will only render an order whose number
 * matches it. Short-lived on purpose: it is a receipt stub for one page view,
 * not a credential, and it grants nothing beyond that single confirmation.
 *
 * Deliberately NOT in a `server/` file: both a route handler and a server
 * component import it, and it holds no secrets - only two constants that must
 * not drift apart.
 */
export const RECENT_ORDER_COOKIE = 'kyg_recent_order';

/** Two hours - long enough to refresh or come back from an email, no longer. */
export const RECENT_ORDER_MAX_AGE = 60 * 60 * 2;
