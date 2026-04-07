import type { AustralianState } from "@/types/questionnaire";

const VALID_STATES: ReadonlySet<AustralianState> = new Set([
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
]);

const MAX_STRING_LENGTH = 500;

/**
 * Strip HTML tags, trim whitespace, and limit length.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&[#\w]+;/g, "")
    .trim()
    .slice(0, MAX_STRING_LENGTH);
}

/**
 * Parse and clamp a numeric value. Returns null if invalid.
 */
export function sanitizeNumber(
  input: unknown,
  min?: number,
  max?: number
): number | null {
  const num = typeof input === "number" ? input : Number(input);

  if (!Number.isFinite(num)) return null;

  let clamped = num;
  if (min !== undefined && clamped < min) clamped = min;
  if (max !== undefined && clamped > max) clamped = max;

  return clamped;
}

/**
 * Check whether a string is a valid Australian state or territory code.
 */
export function isValidState(state: string): state is AustralianState {
  return VALID_STATES.has(state as AustralianState);
}
