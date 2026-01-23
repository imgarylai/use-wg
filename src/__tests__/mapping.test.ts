import { lookupWadeGiles } from "../mapping/pinyin-to-wade-giles";
import { formatTone, extractTone } from "../mapping/tone-formats";

describe("PINYIN_TO_WADE_GILES mapping", () => {
  describe("initial consonant transformations", () => {
    it("should map b → p", () => {
      expect(lookupWadeGiles("ba")).toBe("pa");
      expect(lookupWadeGiles("bei")).toBe("pei");
      expect(lookupWadeGiles("bu")).toBe("pu");
    });

    it("should map p → p'", () => {
      expect(lookupWadeGiles("pa")).toBe("p'a");
      expect(lookupWadeGiles("pei")).toBe("p'ei");
      expect(lookupWadeGiles("pu")).toBe("p'u");
    });

    it("should map d → t", () => {
      expect(lookupWadeGiles("da")).toBe("ta");
      expect(lookupWadeGiles("de")).toBe("te");
      expect(lookupWadeGiles("du")).toBe("tu");
    });

    it("should map t → t'", () => {
      expect(lookupWadeGiles("ta")).toBe("t'a");
      expect(lookupWadeGiles("te")).toBe("t'e");
      expect(lookupWadeGiles("tu")).toBe("t'u");
    });

    it("should map g → k", () => {
      expect(lookupWadeGiles("ga")).toBe("ka");
      expect(lookupWadeGiles("ge")).toBe("ko");
      expect(lookupWadeGiles("gu")).toBe("ku");
    });

    it("should map k → k'", () => {
      expect(lookupWadeGiles("ka")).toBe("k'a");
      expect(lookupWadeGiles("ke")).toBe("k'o");
      expect(lookupWadeGiles("ku")).toBe("k'u");
    });

    it("should map j → ch", () => {
      expect(lookupWadeGiles("ji")).toBe("chi");
      expect(lookupWadeGiles("jia")).toBe("chia");
      expect(lookupWadeGiles("jing")).toBe("ching");
    });

    it("should map q → ch'", () => {
      expect(lookupWadeGiles("qi")).toBe("ch'i");
      expect(lookupWadeGiles("qia")).toBe("ch'ia");
      expect(lookupWadeGiles("qing")).toBe("ch'ing");
    });

    it("should map x → hs", () => {
      expect(lookupWadeGiles("xi")).toBe("hsi");
      expect(lookupWadeGiles("xia")).toBe("hsia");
      expect(lookupWadeGiles("xing")).toBe("hsing");
    });

    it("should map zh → ch", () => {
      expect(lookupWadeGiles("zha")).toBe("cha");
      expect(lookupWadeGiles("zhi")).toBe("chih");
      expect(lookupWadeGiles("zhong")).toBe("chung");
    });

    it("should map z → ts/tz", () => {
      expect(lookupWadeGiles("za")).toBe("tsa");
      expect(lookupWadeGiles("zi")).toBe("tzu");
      expect(lookupWadeGiles("zong")).toBe("tsung");
    });

    it("should map c → ts'/tz'", () => {
      expect(lookupWadeGiles("ca")).toBe("ts'a");
      expect(lookupWadeGiles("ci")).toBe("tz'u");
      expect(lookupWadeGiles("cong")).toBe("ts'ung");
    });

    it("should map r → j", () => {
      expect(lookupWadeGiles("ran")).toBe("jan");
      expect(lookupWadeGiles("ri")).toBe("jih");
      expect(lookupWadeGiles("ren")).toBe("jen");
    });

    it("should map s → s (with special -i)", () => {
      expect(lookupWadeGiles("sa")).toBe("sa");
      expect(lookupWadeGiles("si")).toBe("ssu");
      expect(lookupWadeGiles("su")).toBe("su");
    });

    it("should map sh → sh", () => {
      expect(lookupWadeGiles("sha")).toBe("sha");
      expect(lookupWadeGiles("shi")).toBe("shih");
      expect(lookupWadeGiles("shu")).toBe("shu");
    });
  });

  describe("final vowel transformations", () => {
    it("should handle -ie → -ieh", () => {
      expect(lookupWadeGiles("bie")).toBe("pieh");
      expect(lookupWadeGiles("die")).toBe("tieh");
      expect(lookupWadeGiles("jie")).toBe("chieh");
    });

    it("should handle -ong → -ung", () => {
      expect(lookupWadeGiles("dong")).toBe("tung");
      expect(lookupWadeGiles("gong")).toBe("kung");
      expect(lookupWadeGiles("zhong")).toBe("chung");
    });

    it("should handle -uo → -o (in some cases)", () => {
      expect(lookupWadeGiles("duo")).toBe("to");
      expect(lookupWadeGiles("guo")).toBe("kuo");
    });

    it("should handle -e → -o (in some cases)", () => {
      expect(lookupWadeGiles("ge")).toBe("ko");
      expect(lookupWadeGiles("he")).toBe("ho");
    });
  });

  describe("coverage", () => {
    it("should have all common syllables", () => {
      // Common high-frequency syllables
      const commonSyllables = [
        "shi",
        "de",
        "yi",
        "bu",
        "le",
        "zai",
        "you",
        "wo",
        "ta",
        "zhe",
        "men",
        "wei",
        "da",
        "ren",
        "ge",
        "zhong",
        "shi",
        "guo",
        "neng",
      ];

      for (const syllable of commonSyllables) {
        expect(lookupWadeGiles(syllable)).toBeDefined();
      }
    });

    it("should return undefined for invalid pinyin", () => {
      expect(lookupWadeGiles("xyz")).toBeUndefined();
      expect(lookupWadeGiles("abc")).toBeUndefined();
    });

    it("should be case insensitive", () => {
      expect(lookupWadeGiles("ZHONG")).toBe("chung");
      expect(lookupWadeGiles("Zhong")).toBe("chung");
    });
  });
});

describe("formatTone", () => {
  it("should format superscript tones", () => {
    expect(formatTone(1, "superscript")).toBe("¹");
    expect(formatTone(2, "superscript")).toBe("²");
    expect(formatTone(3, "superscript")).toBe("³");
    expect(formatTone(4, "superscript")).toBe("⁴");
    expect(formatTone(5, "superscript")).toBe("⁵");
  });

  it("should format number tones", () => {
    expect(formatTone(1, "number")).toBe("1");
    expect(formatTone(2, "number")).toBe("2");
    expect(formatTone(3, "number")).toBe("3");
    expect(formatTone(4, "number")).toBe("4");
  });

  it("should return empty string for none format", () => {
    expect(formatTone(1, "none")).toBe("");
    expect(formatTone(4, "none")).toBe("");
  });

  it("should handle undefined tone", () => {
    expect(formatTone(undefined, "superscript")).toBe("");
    expect(formatTone(undefined, "number")).toBe("");
  });
});

describe("extractTone", () => {
  it("should extract numeric tones", () => {
    expect(extractTone("zhong1")).toEqual({ base: "zhong", tone: 1 });
    expect(extractTone("guo2")).toEqual({ base: "guo", tone: 2 });
    expect(extractTone("bei3")).toEqual({ base: "bei", tone: 3 });
    expect(extractTone("shi4")).toEqual({ base: "shi", tone: 4 });
  });

  it("should handle pinyin without tone", () => {
    expect(extractTone("zhong")).toEqual({ base: "zhong", tone: undefined });
  });

  it("should extract diacritic tones", () => {
    expect(extractTone("zhōng").tone).toBe(1);
    expect(extractTone("guó").tone).toBe(2);
    expect(extractTone("běi").tone).toBe(3);
    expect(extractTone("shì").tone).toBe(4);
  });
});
