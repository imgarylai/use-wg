import {
  containsChinese,
  isChinese,
  extractChineseCharacters,
} from "../utils/chinese-detection";
import { segmentText } from "../utils/text-segmenter";
import { toUrlSafe, isUrlSafe } from "../utils/url-safe";

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
      const segments = segmentText("中國");
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        type: "chinese",
        text: "中國",
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
