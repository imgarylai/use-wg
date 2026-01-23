/**
 * Tone format options for Wade-Giles output.
 * - 'superscript': Uses Unicode superscript numbers (e.g., "Chung¹")
 * - 'number': Uses regular numbers (e.g., "Chung1")
 * - 'none': No tone markers
 */
export type ToneFormat = "superscript" | "number" | "none";

/**
 * Options for configuring Wade-Giles conversion.
 */
export interface WadeGilesOptions {
  /**
   * Format for tone markers.
   * @default 'superscript'
   */
  toneFormat?: ToneFormat;

  /**
   * Separator between syllables.
   * @default '-'
   */
  separator?: string;

  /**
   * Whether to preserve non-Chinese characters in the output.
   * @default true
   */
  preserveNonChinese?: boolean;

  /**
   * Whether to capitalize the first letter of each word.
   * @default false
   */
  capitalize?: boolean;

  /**
   * Mode for handling polyphones (characters with multiple pronunciations).
   * - 'auto': Context-aware selection (default)
   * - 'all': Returns all possible readings in alternatives
   * @default 'auto'
   */
  polyphoneMode?: "auto" | "all";

  /**
   * Whether to produce URL-safe output (ASCII only, no tones, no special chars).
   * When true, forces toneFormat to 'none', removes apostrophes, and converts ü to u.
   * @default false
   */
  urlSafe?: boolean;
}

/**
 * Represents a single segment of the conversion result.
 */
export interface WadeGilesSegment {
  /**
   * The original Chinese character(s).
   */
  original: string;

  /**
   * The pinyin representation.
   */
  pinyin: string;

  /**
   * The Wade-Giles romanization.
   */
  wadeGiles: string;

  /**
   * The tone number (1-5), if applicable.
   */
  tone?: number;

  /**
   * Alternative Wade-Giles readings for polyphones (when polyphoneMode is 'all').
   */
  alternatives?: string[];
}

/**
 * Result of Wade-Giles conversion.
 */
export interface WadeGilesResult {
  /**
   * The complete converted text.
   */
  text: string;

  /**
   * Individual segments of the conversion.
   */
  segments: WadeGilesSegment[];
}
