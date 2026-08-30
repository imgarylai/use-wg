import * as pinyinPro from "pinyin-pro";
import { getAllPinyinReadings, toPinyin } from "../utils/pinyin";

// Mock pinyin-pro to test edge cases
jest.mock("pinyin-pro", () => ({
  ...jest.requireActual("pinyin-pro"),
  pinyin: jest.fn(),
  customPinyin: jest.fn(),
}));

describe("getAllPinyinReadings edge cases", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle comma-separated readings from pinyin-pro", () => {
    // Mock pinyin to return comma-separated values
    (pinyinPro.pinyin as jest.Mock).mockReturnValue(["xing2, hang2, heng2"]);

    const readings = getAllPinyinReadings("行");

    expect(readings).toEqual(["xing2", "hang2", "heng2"]);
  });

  it("should handle array readings without commas", () => {
    // Mock pinyin to return array without commas
    (pinyinPro.pinyin as jest.Mock).mockReturnValue(["xing2"]);

    const readings = getAllPinyinReadings("行");

    expect(readings).toEqual(["xing2"]);
  });

  it("should handle empty first reading", () => {
    // Mock pinyin to return empty array
    (pinyinPro.pinyin as jest.Mock).mockReturnValue([]);

    const readings = getAllPinyinReadings("行");

    expect(readings).toEqual([]);
  });
});

describe("toPinyin edge cases", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should default to the neutral tone when pinyin-pro omits the number", () => {
    (pinyinPro.pinyin as jest.Mock).mockReturnValue(["de"]);

    const results = toPinyin("的");

    expect(results[0]).toEqual({
      character: "的",
      pinyin: "de",
      tone: 5,
      pinyinWithoutTone: "de",
    });
  });

  it("should normalize pinyin-pro's neutral tone 0 to 5", () => {
    (pinyinPro.pinyin as jest.Mock).mockReturnValue(["de0"]);

    const results = toPinyin("的");

    expect(results[0]).toEqual({
      character: "的",
      pinyin: "de5",
      tone: 5,
      pinyinWithoutTone: "de",
    });
  });
});
