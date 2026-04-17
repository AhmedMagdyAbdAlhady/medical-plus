/**
 * validators.ts
 * Pure validation helpers — no side-effects, easy to unit-test.
 */

/** Any structurally valid email address (user@domain.tld) */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/**
 * Must be a @gmail.com address.
 * Allows dots, plus signs, and underscores in the local part.
 */
export const isGmailEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());

/**
 * Egyptian mobile number format.
 * Rules:
 *   - Starts with 01 followed by 0, 1, 2, or 5  (Vodafone, Orange, Etisalat, WE)
 *   - Followed by exactly 8 digits
 *   - Total: 11 digits
 *   - Accepts optional +20 country-code prefix or leading spaces/dashes (stripped first)
 *
 * Valid examples:  01012345678  |  01512345678  |  +201012345678
 */
export const isEgyptianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-().+]/g, "");
  // Strip country code if present
  const local = cleaned.startsWith("20") ? cleaned.slice(2) : cleaned;
  return /^01[0125][0-9]{8}$/.test(local);
};

/**
 * Password strength rules:
 *   - At least 8 characters
 *   - At least one letter
 *   - At least one digit
 */
export const isStrongPassword = (password: string): boolean =>
  password.length >= 8 &&
  /[a-zA-Z]/.test(password) &&
  /[0-9]/.test(password);

/** Non-empty after trimming */
export const isRequired = (value: string): boolean => value.trim().length > 0;

/** Minimum character length after trimming */
export const minLength = (value: string, min: number): boolean =>
  value.trim().length >= min;
