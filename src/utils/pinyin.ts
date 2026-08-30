import { pinyin, customPinyin } from "pinyin-pro";
import { NEUTRAL_TONE, splitNumericTone } from "../mapping/tone-formats.js";

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

    // istanbul ignore next - defensive check for array bounds
    if (char === undefined || py === undefined) continue;

    // Split off the tone number (e.g., "zhong1" -> tone 1). pinyin-pro marks
    // the neutral tone as "de0", which splitNumericTone normalizes to 5.
    const { base: pinyinWithoutTone, tone: parsedTone } = splitNumericTone(py);
    const tone = parsedTone ?? NEUTRAL_TONE;

    results.push({
      character: char,
      // Re-attach the normalized tone so the neutral tone is always reported
      // as 5 ("de5"), never as pinyin-pro's "de0".
      pinyin: parsedTone === undefined ? py : `${pinyinWithoutTone}${tone}`,
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
