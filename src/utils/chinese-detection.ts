/**
 * Regular expression for matching Chinese characters.
 * Covers CJK Unified Ideographs and common extensions.
 * Uses the `u` flag for proper Unicode support.
 */
const CHINESE_REGEX =
  /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]|[\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2F800}-\u{2FA1F}]/u;

/**
 * Regular expression for matching a string that contains at least one Chinese character.
 */
const CONTAINS_CHINESE_REGEX =
  /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]|[\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2F800}-\u{2FA1F}]/u;

/**
 * Check if a single character is a Chinese character.
 *
 * @param char - A single character to check
 * @returns true if the character is Chinese
 */
export function isChinese(char: string): boolean {
  if (char.length === 0) return false;
  return CHINESE_REGEX.test(char.charAt(0));
}

/**
 * Check if a string contains any Chinese characters.
 *
 * @param text - The text to check
 * @returns true if the text contains at least one Chinese character
 *
 * @example
 * ```typescript
 * containsChinese('Hello 世界'); // true
 * containsChinese('Hello World'); // false
 * containsChinese('中文'); // true
 * ```
 */
export function containsChinese(text: string): boolean {
  return CONTAINS_CHINESE_REGEX.test(text);
}

/**
 * Extract all Chinese characters from a string.
 *
 * @param text - The text to extract from
 * @returns Array of Chinese characters
 */
export function extractChineseCharacters(text: string): string[] {
  const EXTRACT_REGEX =
    /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]|[\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2F800}-\u{2FA1F}]/gu;
  const matches = text.match(EXTRACT_REGEX);
  return matches ?? [];
}
