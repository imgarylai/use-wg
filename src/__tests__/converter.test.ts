import { toWadeGiles, pinyinToWadeGiles } from "../converter";

describe("toWadeGiles", () => {
  describe("basic conversion", () => {
    it("should convert simple Chinese characters", () => {
      const result = toWadeGiles("中");
      expect(result.text).toBe("chung¹");
      expect(result.segments).toHaveLength(1);
      expect(result.segments[0]?.original).toBe("中");
      expect(result.segments[0]?.tone).toBe(1);
    });

    it("should convert multiple characters with separator", () => {
      const result = toWadeGiles("中國");
      expect(result.text).toBe("chung¹-kuo²");
    });

    it("should handle 北京 (Beijing)", () => {
      const result = toWadeGiles("北京");
      expect(result.text).toBe("pei³-ching¹");
    });

    it("should handle 台灣 (Taiwan)", () => {
      const result = toWadeGiles("台灣");
      expect(result.text).toBe("t'ai²-wan¹");
    });
  });

  describe("tone formats", () => {
    it("should use superscript tones by default", () => {
      const result = toWadeGiles("中");
      expect(result.text).toBe("chung¹");
    });

    it("should support number tone format", () => {
      const result = toWadeGiles("中", { toneFormat: "number" });
      expect(result.text).toBe("chung1");
    });

    it("should support no tones", () => {
      const result = toWadeGiles("中", { toneFormat: "none" });
      expect(result.text).toBe("chung");
    });
  });

  describe("urlSafe mode", () => {
    it("should produce lowercase ASCII output", () => {
      const result = toWadeGiles("台灣", { urlSafe: true });
      expect(result.text).toBe("tai-wan");
    });

    it("should remove apostrophes in URL-safe mode", () => {
      const result = toWadeGiles("氣", { urlSafe: true });
      // 氣 = qì = ch'i4 -> chi (no apostrophe, no tone)
      expect(result.text).toBe("chi");
    });

    it("should remove tones in URL-safe mode", () => {
      const result = toWadeGiles("中國", { urlSafe: true });
      expect(result.text).toBe("chung-kuo");
    });
  });

  describe("options", () => {
    it("should capitalize when requested", () => {
      const result = toWadeGiles("中國", { capitalize: true });
      expect(result.text).toBe("Chung¹-kuo²");
    });

    it("should use custom separator", () => {
      const result = toWadeGiles("中國", { separator: " " });
      expect(result.text).toBe("chung¹ kuo²");
    });
  });

  describe("empty and edge cases", () => {
    it("should handle empty string", () => {
      const result = toWadeGiles("");
      expect(result.text).toBe("");
      expect(result.segments).toHaveLength(0);
    });

    it("should handle single character", () => {
      const result = toWadeGiles("人");
      expect(result.text).toBe("jen²");
    });
  });
});

describe("pinyinToWadeGiles", () => {
  it("should convert pinyin with tone number", () => {
    expect(pinyinToWadeGiles("zhong1")).toBe("chung¹");
    expect(pinyinToWadeGiles("guo2")).toBe("kuo²");
    expect(pinyinToWadeGiles("bei3")).toBe("pei³");
    expect(pinyinToWadeGiles("jing1")).toBe("ching¹");
  });

  it("should handle pinyin without tone", () => {
    expect(pinyinToWadeGiles("zhong")).toBe("chung");
  });

  it("should support different tone formats", () => {
    expect(pinyinToWadeGiles("zhong1", { toneFormat: "number" })).toBe(
      "chung1",
    );
    expect(pinyinToWadeGiles("zhong1", { toneFormat: "none" })).toBe("chung");
  });

  it("should handle aspirated initials", () => {
    expect(pinyinToWadeGiles("pa1")).toBe("p'a¹");
    expect(pinyinToWadeGiles("ta1")).toBe("t'a¹");
    expect(pinyinToWadeGiles("ka1")).toBe("k'a¹");
    expect(pinyinToWadeGiles("qi1")).toBe("ch'i¹");
  });

  it("should handle special mappings", () => {
    expect(pinyinToWadeGiles("xi1")).toBe("hsi¹");
    expect(pinyinToWadeGiles("zhi1")).toBe("chih¹");
    expect(pinyinToWadeGiles("zi1")).toBe("tzu¹");
    expect(pinyinToWadeGiles("ci1")).toBe("tz'u¹");
  });
});
