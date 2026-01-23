// Main conversion functions
export { toWadeGiles, pinyinToWadeGiles } from "./converter.js";

// Types
export type {
  ToneFormat,
  WadeGilesOptions,
  WadeGilesResult,
  WadeGilesSegment,
} from "./types.js";

// Utility functions
export { containsChinese } from "./utils/chinese-detection.js";
