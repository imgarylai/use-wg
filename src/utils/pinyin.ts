import { pinyin, customPinyin } from "pinyin-pro";

export interface PinyinResult {
  character: string;
  pinyin: string;
  tone: number;
  pinyinWithoutTone: string;
}

export interface PinyinOptions {
  multiple?: boolean;
}

/**
 * Convert Chinese text to pinyin with tone information.
 *
 * @param text - Chinese text to convert
 * @param options - Options for conversion
 * @returns Array of pinyin results for each character
 */
export function toPinyin(
  text: string,
  options: PinyinOptions = {},
): PinyinResult[] {
  const { multiple = false } = options;

  // Get pinyin with tones as an array per character
  const pinyinArray = pinyin(text, {
    toneType: "num",
    type: "array",
    multiple,
  });

  // Get original characters
  const characters = [...text];

  const results: PinyinResult[] = [];

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const py = pinyinArray[i];

    if (char === undefined || py === undefined) continue;

    // Extract tone number from pinyin (e.g., "zhong1" -> tone 1)
    const toneMatch = py.match(/([1-5])$/);
    const tone = toneMatch ? parseInt(toneMatch[1] ?? "5", 10) : 5;

    // Remove tone number to get base pinyin
    const pinyinWithoutTone = py.replace(/[1-5]$/, "");

    results.push({
      character: char,
      pinyin: py,
      tone,
      pinyinWithoutTone,
    });
  }

  return results;
}

/**
 * Get all possible pinyin readings for a character (polyphone handling).
 *
 * @param character - A single Chinese character
 * @returns Array of all possible pinyin readings
 */
export function getAllPinyinReadings(character: string): string[] {
  const readings = pinyin(character, {
    toneType: "num",
    type: "array",
    multiple: true,
  });

  // When multiple=true, pinyin-pro may return comma-separated values
  const firstReading = readings[0];
  if (firstReading && firstReading.includes(",")) {
    return firstReading.split(",").map((r) => r.trim());
  }

  return readings;
}

/**
 * Configure custom pinyin mappings.
 * Useful for handling special cases or user preferences.
 *
 * @param mappings - Custom character to pinyin mappings
 */
export function setCustomPinyin(mappings: Record<string, string>): void {
  customPinyin(mappings);
}

export { pinyin, customPinyin };
