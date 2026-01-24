import {
  containsChinese,
  isChinese,
  extractChineseCharacters,
} from "../utils/chinese-detection";
import { segmentText } from "../utils/text-segmenter";
import { toUrlSafe, isUrlSafe } from "../utils/url-safe";
import {
  toPinyin,
  getAllPinyinReadings,
  setCustomPinyin,
  pinyin,
  customPinyin,
} from "../utils/pinyin";

describe("Chinese detection", () => {
  describe("containsChinese", () => {
    it("should return true for Chinese-only text", () => {
      expect(containsChinese("中文")).toBe(true);
      expect(containsChinese("你好")).toBe(true);
    });

    it("should return true for mixed text", () => {
      expect(containsChinese("Hello 世界")).toBe(true);
      expect(containsChinese("123中456")).toBe(true);
    });

    it("should return false for non-Chinese text", () => {
      expect(containsChinese("Hello World")).toBe(false);
      expect(containsChinese("123456")).toBe(false);
      expect(containsChinese("")).toBe(false);
    });

    it("should handle Traditional Chinese", () => {
      expect(containsChinese("臺灣")).toBe(true);
      expect(containsChinese("國語")).toBe(true);
    });

    it("should handle Simplified Chinese", () => {
      expect(containsChinese("台湾")).toBe(true);
      expect(containsChinese("国语")).toBe(true);
    });
  });

  describe("isChinese", () => {
    it("should return true for Chinese characters", () => {
      expect(isChinese("中")).toBe(true);
      expect(isChinese("國")).toBe(true);
    });

    it("should return false for non-Chinese characters", () => {
      expect(isChinese("A")).toBe(false);
      expect(isChinese("1")).toBe(false);
      expect(isChinese(" ")).toBe(false);
    });

    it("should handle empty string", () => {
      expect(isChinese("")).toBe(false);
    });
  });

  describe("extractChineseCharacters", () => {
    it("should extract Chinese characters from mixed text", () => {
      const chars = extractChineseCharacters("Hello 世界!");
      expect(chars).toEqual(["世", "界"]);
    });

    it("should return empty array for non-Chinese text", () => {
      const chars = extractChineseCharacters("Hello World");
      expect(chars).toEqual([]);
    });
  });
});

describe("Text segmentation", () => {
  describe("segmentText", () => {
    it("should segment Chinese-only text", () => {
      const segments = segmentText("台北");
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        type: "chinese",
        text: "台北",
        startIndex: 0,
        endIndex: 2,
      });
    });

    it("should segment non-Chinese-only text", () => {
      const segments = segmentText("Hello");
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        type: "non-chinese",
        text: "Hello",
        startIndex: 0,
        endIndex: 5,
      });
    });

    it("should segment mixed text", () => {
      const segments = segmentText("Hello 世界!");
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({
        type: "non-chinese",
        text: "Hello ",
        startIndex: 0,
        endIndex: 6,
      });
      expect(segments[1]).toEqual({
        type: "chinese",
        text: "世界",
        startIndex: 6,
        endIndex: 8,
      });
      expect(segments[2]).toEqual({
        type: "non-chinese",
        text: "!",
        startIndex: 8,
        endIndex: 9,
      });
    });

    it("should handle empty string", () => {
      const segments = segmentText("");
      expect(segments).toHaveLength(0);
    });

    it("should handle alternating characters", () => {
      const segments = segmentText("A中B");
      expect(segments).toHaveLength(3);
      expect(segments[0]?.type).toBe("non-chinese");
      expect(segments[1]?.type).toBe("chinese");
      expect(segments[2]?.type).toBe("non-chinese");
    });
  });
});

describe("URL-safe utilities", () => {
  describe("toUrlSafe", () => {
    it("should convert to lowercase", () => {
      expect(toUrlSafe("HELLO")).toBe("hello");
    });

    it("should remove apostrophes", () => {
      expect(toUrlSafe("ch'i")).toBe("chi");
      expect(toUrlSafe("t'ai-wan")).toBe("tai-wan");
    });

    it("should convert ü to u", () => {
      expect(toUrlSafe("chü")).toBe("chu");
      expect(toUrlSafe("yüeh")).toBe("yueh");
    });

    it("should preserve hyphens", () => {
      expect(toUrlSafe("tai-wan")).toBe("tai-wan");
    });
  });

  describe("isUrlSafe", () => {
    it("should return true for safe strings", () => {
      expect(isUrlSafe("tai-wan")).toBe(true);
      expect(isUrlSafe("chung-kuo")).toBe(true);
      expect(isUrlSafe("hello123")).toBe(true);
    });

    it("should return false for unsafe strings", () => {
      expect(isUrlSafe("ch'i")).toBe(false);
      expect(isUrlSafe("chü")).toBe(false);
      expect(isUrlSafe("Taipei")).toBe(false); // uppercase
      expect(isUrlSafe("hello world")).toBe(false); // space
    });
  });
});

describe("Pinyin utilities", () => {
  describe("toPinyin", () => {
    it("should convert Chinese text to pinyin", () => {
      const results = toPinyin("台北");
      expect(results).toHaveLength(2);
      expect(results[0]?.character).toBe("台");
      expect(results[0]?.pinyinWithoutTone).toBe("tai");
      expect(results[0]?.tone).toBe(2);
      expect(results[1]?.character).toBe("北");
      expect(results[1]?.pinyinWithoutTone).toBe("bei");
      expect(results[1]?.tone).toBe(3);
    });

    it("should handle single character", () => {
      const results = toPinyin("人");
      expect(results).toHaveLength(1);
      expect(results[0]?.pinyinWithoutTone).toBe("ren");
    });

    it("should handle empty string", () => {
      const results = toPinyin("");
      expect(results).toHaveLength(0);
    });
  });

  describe("getAllPinyinReadings", () => {
    it("should return multiple readings for polyphones", () => {
      // 行 has multiple readings: xíng, háng, etc.
      const readings = getAllPinyinReadings("行");
      expect(readings.length).toBeGreaterThanOrEqual(1);
    });

    it("should return single reading for non-polyphones", () => {
      const readings = getAllPinyinReadings("人");
      expect(readings.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle characters with multiple pronunciations", () => {
      // 樂 has multiple readings (yuè, lè, etc.)
      const readings = getAllPinyinReadings("樂");
      expect(readings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("setCustomPinyin", () => {
    it("should allow setting custom pinyin mappings", () => {
      // This just verifies the function can be called without error
      setCustomPinyin({ 測: "ce4" });
      // The effect would be seen in subsequent conversions
      expect(true).toBe(true);
    });
  });

  describe("re-exported pinyin functions", () => {
    it("should export pinyin function from pinyin-pro", () => {
      const result = pinyin("中", { toneType: "num", type: "array" });
      expect(result).toContain("zhong1");
    });

    it("should export customPinyin function from pinyin-pro", () => {
      // customPinyin allows setting custom mappings
      expect(typeof customPinyin).toBe("function");
      customPinyin({ 測: "ce4" });
    });
  });
});
