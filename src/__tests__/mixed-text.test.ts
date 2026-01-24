import { toWadeGiles } from "../converter";

describe("Mixed Chinese and non-Chinese text", () => {
  it("should handle text starting with English", () => {
    const result = toWadeGiles("Hello 世界");
    expect(result.text).toBe("Hello shih⁴-chieh⁴");
  });

  it("should handle text ending with English", () => {
    const result = toWadeGiles("台北 is great");
    expect(result.text).toBe("t'ai²-pei³ is great");
  });

  it("should handle mixed text with punctuation", () => {
    const result = toWadeGiles("Hello 世界!");
    expect(result.text).toBe("Hello shih⁴-chieh⁴!");
  });

  it("should handle product names with Chinese", () => {
    const result = toWadeGiles("iPhone 手機 Pro");
    expect(result.text).toBe("iPhone shou³-chi¹ Pro");
  });

  it("should preserve numbers", () => {
    const result = toWadeGiles("2024年");
    expect(result.text).toBe("2024nien²");
  });

  it("should handle only non-Chinese text", () => {
    const result = toWadeGiles("Hello World");
    expect(result.text).toBe("Hello World");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]?.original).toBe("Hello World");
  });

  it("should handle alternating Chinese and English", () => {
    const result = toWadeGiles("A中B國C");
    expect(result.text).toBe("Achung¹Bkuo²C");
  });

  it("should handle preserveNonChinese option", () => {
    const result = toWadeGiles("Hello 世界", { preserveNonChinese: false });
    // When preserveNonChinese is false, non-Chinese is not included
    expect(result.text).toBe("shih⁴-chieh⁴");
  });

  it("should track segments correctly for mixed text", () => {
    const result = toWadeGiles("A中B");
    expect(result.segments).toHaveLength(3);
    expect(result.segments[0]?.original).toBe("A");
    expect(result.segments[1]?.original).toBe("中");
    expect(result.segments[2]?.original).toBe("B");
  });

  describe("URL-safe with mixed text", () => {
    it("should handle mixed text in URL-safe mode", () => {
      const result = toWadeGiles("My 台灣 Trip", { urlSafe: true });
      expect(result.text).toBe("my-tai-wan-trip");
    });

    it("should add separator between numbers and Chinese in URL-safe mode", () => {
      const result = toWadeGiles("2024年", { urlSafe: true });
      expect(result.text).toBe("2024-nien");
    });

    it("should add separator between letters and Chinese in URL-safe mode", () => {
      const result = toWadeGiles("A中B", { urlSafe: true });
      expect(result.text).toBe("a-chung-b");
    });
  });

  describe("capitalization with mixed text", () => {
    it("should capitalize only Chinese portion", () => {
      const result = toWadeGiles("Visit 高雄 today", { capitalize: true });
      expect(result.text).toBe("Visit Kao¹-hsiung² today");
    });
  });
});
