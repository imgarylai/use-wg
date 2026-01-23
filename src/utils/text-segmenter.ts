import { isChinese } from "./chinese-detection.js";

export type SegmentType = "chinese" | "non-chinese";

export interface TextSegment {
  type: SegmentType;
  text: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Segment mixed Chinese/non-Chinese text into chunks.
 *
 * This function scans the input character by character and groups
 * consecutive Chinese characters together, while preserving
 * non-Chinese segments (letters, numbers, punctuation, spaces) as-is.
 *
 * @param text - The input text to segment
 * @returns Array of segments with type information
 *
 * @example
 * ```typescript
 * segmentText('Hello 世界!');
 * // [
 * //   { type: 'non-chinese', text: 'Hello ', startIndex: 0, endIndex: 6 },
 * //   { type: 'chinese', text: '世界', startIndex: 6, endIndex: 8 },
 * //   { type: 'non-chinese', text: '!', startIndex: 8, endIndex: 9 }
 * // ]
 * ```
 */
export function segmentText(text: string): TextSegment[] {
  if (text.length === 0) {
    return [];
  }

  const segments: TextSegment[] = [];
  let currentSegment: TextSegment | null = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    const type: SegmentType = isChinese(char) ? "chinese" : "non-chinese";

    if (currentSegment === null) {
      currentSegment = {
        type,
        text: char,
        startIndex: i,
        endIndex: i + 1,
      };
    } else if (currentSegment.type === type) {
      currentSegment.text += char;
      currentSegment.endIndex = i + 1;
    } else {
      segments.push(currentSegment);
      currentSegment = {
        type,
        text: char,
        startIndex: i,
        endIndex: i + 1,
      };
    }
  }

  if (currentSegment !== null) {
    segments.push(currentSegment);
  }

  return segments;
}
