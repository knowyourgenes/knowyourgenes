import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Indian mobile numbers arrive as "+91 98765 43210", "098765-43210", etc.
 * Store the bare 10 digits so the courier API and WhatsApp both get what they
 * expect, and so two spellings of one number do not look like two people.
 *
 * Shared rather than copied because it is now needed by all three write sites -
 * and the one that had its own idea (guest checkout, which stored the raw
 * string) froze unnormalised numbers onto Shipment.dropPhone, where nothing
 * downstream could correct them.
 */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}
