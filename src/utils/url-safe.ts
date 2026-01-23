/**
 * Convert Wade-Giles text to URL-safe format.
 *
 * URL-safe transformations:
 * - Replace ü → u
 * - Remove apostrophes (')
 * - Convert to lowercase
 *
 * @param text - Wade-Giles text to convert
 * @returns URL-safe ASCII string
 *
 * @example
 * ```typescript
 * toUrlSafe("Ch'ü"); // "chu"
 * toUrlSafe("T'ai-wan"); // "tai-wan"
 * ```
 */
export function toUrlSafe(text: string): string {
  return text.toLowerCase().replace(/ü/g, "u").replace(/'/g, "");
}

/**
 * Check if a string is URL-safe (ASCII only, no special characters except hyphen).
 *
 * @param text - Text to check
 * @returns true if the text is URL-safe
 */
export function isUrlSafe(text: string): boolean {
  return /^[a-z0-9-]*$/.test(text);
}
