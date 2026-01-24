import type {
  WadeGilesOptions,
  WadeGilesResult,
  WadeGilesSegment,
  ToneFormat,
} from "./types.js";
import { lookupWadeGiles, formatTone } from "./mapping/index.js";
import { toPinyin, getAllPinyinReadings } from "./utils/pinyin.js";
import { segmentText } from "./utils/text-segmenter.js";
import { toUrlSafe } from "./utils/url-safe.js";

const DEFAULT_OPTIONS: Required<WadeGilesOptions> = {
  toneFormat: "superscript",
  separator: "-",
  preserveNonChinese: true,
  capitalize: false,
  polyphoneMode: "auto",
  urlSafe: false,
};

/**
 * Convert Chinese text to Wade-Giles romanization.
 *
 * @param text - Chinese text to convert (can include non-Chinese characters)
 * @param options - Conversion options
 * @returns Conversion result with text and segments
 *
 * @example
 * ```typescript
 * // Basic usage
 * toWadeGiles('台北').text; // "t'ai²-pei³"
 *
 * // With options
 * toWadeGiles('高雄', { toneFormat: 'number' }).text; // "kao1-hsiung2"
 *
 * // URL-safe output
 * toWadeGiles('台灣', { urlSafe: true }).text; // "tai-wan"
 *
 * // Mixed text
 * toWadeGiles('Hello 世界!').text; // "Hello shih⁴-chieh⁴!"
 * ```
 */
export function toWadeGiles(
  text: string,
  options: WadeGilesOptions = {},
): WadeGilesResult {
  const opts: Required<WadeGilesOptions> = { ...DEFAULT_OPTIONS, ...options };

  // URL-safe mode overrides certain options
  if (opts.urlSafe) {
    opts.toneFormat = "none";
    opts.capitalize = false;
  }

  const textSegments = segmentText(text);
  const resultSegments: WadeGilesSegment[] = [];
  const outputParts: { text: string; type: "chinese" | "non-chinese" }[] = [];

  for (const segment of textSegments) {
    if (segment.type === "non-chinese") {
      // Preserve non-Chinese text as-is
      if (opts.preserveNonChinese) {
        outputParts.push({ text: segment.text, type: "non-chinese" });
        resultSegments.push({
          original: segment.text,
          pinyin: "",
          wadeGiles: segment.text,
        });
      }
    } else {
      // Convert Chinese characters
      const chineseResult = convertChineseSegment(segment.text, opts);
      outputParts.push({ text: chineseResult.text, type: "chinese" });
      resultSegments.push(...chineseResult.segments);
    }
  }

  // Join parts, adding separator between alphanumeric and Chinese in URL-safe mode
  let finalText = "";
  for (let i = 0; i < outputParts.length; i++) {
    const current = outputParts[i]!;
    const prev = outputParts[i - 1];

    // In URL-safe mode, add separator between alphanumeric non-Chinese and Chinese
    if (
      opts.urlSafe &&
      prev &&
      current.text.length > 0 &&
      prev.text.length > 0
    ) {
      const prevEndsAlnum = /[a-zA-Z0-9]$/.test(prev.text);
      const currStartsAlpha = /^[a-zA-Z]/.test(current.text);
      if (prevEndsAlnum && currStartsAlpha) {
        finalText += opts.separator;
      }
    }

    finalText += current.text;
  }

  // Apply URL-safe transformation to the entire output
  if (opts.urlSafe) {
    finalText = finalText
      .toLowerCase()
      .replace(/\s+/g, opts.separator)
      .replace(/-+/g, "-"); // Collapse multiple hyphens
  }

  return {
    text: finalText,
    segments: resultSegments,
  };
}

/**
 * Convert a segment of Chinese text to Wade-Giles.
 */
function convertChineseSegment(
  text: string,
  opts: Required<WadeGilesOptions>,
): WadeGilesResult {
  const pinyinResults = toPinyin(text);
  const segments: WadeGilesSegment[] = [];
  const wgParts: string[] = [];

  for (const result of pinyinResults) {
    const wadeGilesBase = lookupWadeGiles(result.pinyinWithoutTone);

    if (wadeGilesBase === undefined) {
      // Fallback: use pinyin if no Wade-Giles mapping found
      segments.push({
        original: result.character,
        pinyin: result.pinyin,
        wadeGiles: result.pinyinWithoutTone,
        tone: result.tone,
      });
      wgParts.push(
        formatWadeGilesSyllable(result.pinyinWithoutTone, result.tone, opts),
      );
    } else {
      const segment: WadeGilesSegment = {
        original: result.character,
        pinyin: result.pinyin,
        wadeGiles: wadeGilesBase,
        tone: result.tone,
      };

      // Add alternatives if polyphoneMode is 'all'
      if (opts.polyphoneMode === "all") {
        const allReadings = getAllPinyinReadings(result.character);
        if (allReadings.length > 1) {
          segment.alternatives = allReadings
            .map((reading) => {
              const base = reading.replace(/[1-5]$/, "");
              // istanbul ignore next - fallback for unmapped pinyin
              return lookupWadeGiles(base) ?? base;
            })
            .filter((alt, idx, arr) => arr.indexOf(alt) === idx); // Dedupe
        }
      }

      segments.push(segment);
      wgParts.push(formatWadeGilesSyllable(wadeGilesBase, result.tone, opts));
    }
  }

  let resultText = wgParts.join(opts.separator);

  // Apply URL-safe transformation
  if (opts.urlSafe) {
    resultText = toUrlSafe(resultText);
  }

  // Capitalize first letter if requested
  if (opts.capitalize && resultText.length > 0) {
    resultText = resultText.charAt(0).toUpperCase() + resultText.slice(1);
  }

  return {
    text: resultText,
    segments,
  };
}

/**
 * Format a single Wade-Giles syllable with tone.
 */
function formatWadeGilesSyllable(
  wadeGiles: string,
  tone: number | undefined,
  opts: Required<WadeGilesOptions>,
): string {
  const toneStr = formatTone(tone, opts.toneFormat);

  let result = wadeGiles;

  // Capitalize first letter if requested (but we handle this at segment level)
  // Just add tone
  result = result + toneStr;

  return result;
}

/**
 * Convert a pinyin syllable directly to Wade-Giles romanization.
 *
 * @param pinyin - A pinyin syllable (with or without tone number)
 * @param options - Formatting options
 * @returns Wade-Giles romanization
 *
 * @example
 * ```typescript
 * pinyinToWadeGiles('zhong1'); // "chung¹"
 * pinyinToWadeGiles('guo2', { toneFormat: 'number' }); // "kuo2"
 * pinyinToWadeGiles('bei3', { toneFormat: 'none' }); // "pei"
 * ```
 */
export function pinyinToWadeGiles(
  pinyin: string,
  options: { toneFormat?: ToneFormat } = {},
): string {
  const toneFormat = options.toneFormat ?? "superscript";

  // Extract tone from pinyin
  const toneMatch = pinyin.match(/([1-5])$/);
  // istanbul ignore next - regex group always exists when match succeeds
  const tone = toneMatch ? parseInt(toneMatch[1] ?? "5", 10) : undefined;
  const basePinyin = pinyin.replace(/[1-5]$/, "").toLowerCase();

  const wadeGiles = lookupWadeGiles(basePinyin) ?? basePinyin;
  const toneStr = formatTone(tone, toneFormat);

  return wadeGiles + toneStr;
}
