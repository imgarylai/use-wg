import type { ToneFormat } from "../types.js";

/**
 * Unicode superscript numbers for tone markers.
 */
const SUPERSCRIPT_NUMBERS: Record<number, string> = {
  1: "\u00B9", // ¹
  2: "\u00B2", // ²
  3: "\u00B3", // ³
  4: "\u2074", // ⁴
  5: "\u2075", // ⁵ (neutral tone)
};

/**
 * Format a tone number according to the specified format.
 *
 * @param tone - The tone number (1-5)
 * @param format - The output format
 * @returns The formatted tone string, or empty string if format is 'none'
 */
export function formatTone(
  tone: number | undefined,
  format: ToneFormat,
): string {
  if (tone === undefined || format === "none") {
    return "";
  }

  if (format === "superscript") {
    return SUPERSCRIPT_NUMBERS[tone] ?? "";
  }

  if (format === "number") {
    return String(tone);
  }

  return "";
}

/**
 * Extract tone number from a pinyin syllable with tone marks.
 * Handles both numeric tones (e.g., "zhong1") and diacritic tones (e.g., "zhōng").
 *
 * @param pinyin - Pinyin syllable with tone
 * @returns Object containing base pinyin (without tone) and tone number
 */
export function extractTone(pinyin: string): {
  base: string;
  tone: number | undefined;
} {
  // Check for numeric tone at the end
  const numericMatch = pinyin.match(/^(.+?)([1-5])$/);
  if (numericMatch) {
    return {
      base: numericMatch[1] ?? pinyin,
      tone: parseInt(numericMatch[2] ?? "0", 10),
    };
  }

  // Tone diacritics mapping
  const toneMarks: Record<string, { base: string; tone: number }> = {
    // First tone (macron)
    ā: { base: "a", tone: 1 },
    ē: { base: "e", tone: 1 },
    ī: { base: "i", tone: 1 },
    ō: { base: "o", tone: 1 },
    ū: { base: "u", tone: 1 },
    ǖ: { base: "v", tone: 1 },

    // Second tone (acute)
    á: { base: "a", tone: 2 },
    é: { base: "e", tone: 2 },
    í: { base: "i", tone: 2 },
    ó: { base: "o", tone: 2 },
    ú: { base: "u", tone: 2 },
    ǘ: { base: "v", tone: 2 },

    // Third tone (caron)
    ǎ: { base: "a", tone: 3 },
    ě: { base: "e", tone: 3 },
    ǐ: { base: "i", tone: 3 },
    ǒ: { base: "o", tone: 3 },
    ǔ: { base: "u", tone: 3 },
    ǚ: { base: "v", tone: 3 },

    // Fourth tone (grave)
    à: { base: "a", tone: 4 },
    è: { base: "e", tone: 4 },
    ì: { base: "i", tone: 4 },
    ò: { base: "o", tone: 4 },
    ù: { base: "u", tone: 4 },
    ǜ: { base: "v", tone: 4 },
  };

  let basePinyin = pinyin;
  let detectedTone: number | undefined;

  for (const [mark, info] of Object.entries(toneMarks)) {
    if (pinyin.includes(mark)) {
      basePinyin = pinyin.replace(mark, info.base);
      detectedTone = info.tone;
      break;
    }
  }

  // Handle ü without tone mark
  basePinyin = basePinyin.replace(/ü/g, "v");

  // Normalize v back to ü for Wade-Giles (which uses ü)
  // But first check if we should use 'v' for lookup
  basePinyin = basePinyin.replace(/v/g, "v");

  return { base: basePinyin, tone: detectedTone };
}
