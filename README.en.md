# use-wg

A TypeScript library for converting Chinese characters to Wade-Giles romanization.

[![CI](https://github.com/imgarylai/use-wg/actions/workflows/test.yml/badge.svg)](https://github.com/imgarylai/use-wg/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[繁體中文](README.md)

## Features

- Chinese characters (Traditional & Simplified) → Wade-Giles romanization
- Configurable tone format (superscript, number, none)
- Mixed Chinese/English text handling
- URL-safe output mode
- Context-aware polyphone handling
- TypeScript support with full type definitions

## Installation

```bash
npm install use-wg
```

## Usage

### Basic Conversion

```typescript
import { toWadeGiles } from "use-wg";

// Basic conversion
toWadeGiles("台灣").text; // "t'ai²-wan¹"
toWadeGiles("台北").text; // "t'ai²-pei³"
toWadeGiles("高雄").text; // "kao¹-hsiung²"
```

### Tone Formats

```typescript
// Superscript tones (default)
toWadeGiles("高雄", { toneFormat: "superscript" }).text; // "kao¹-hsiung²"

// Number tones
toWadeGiles("高雄", { toneFormat: "number" }).text; // "kao1-hsiung2"

// No tones
toWadeGiles("高雄", { toneFormat: "none" }).text; // "kao-hsiung"
```

### URL-Safe Mode

Produces ASCII-only output suitable for URLs, filenames, and identifiers:

```typescript
toWadeGiles("台灣", { urlSafe: true }).text; // "tai-wan"
toWadeGiles("氣功", { urlSafe: true }).text; // "chi-kung"
```

URL-safe mode automatically:

- Removes tone markers
- Converts `ü` → `u`
- Removes apostrophes (`'`)
- Outputs lowercase
- Converts spaces to hyphens (`-`)

### Mixed Chinese/English Text

The converter intelligently handles mixed text:

```typescript
toWadeGiles("Hello 世界!").text; // "Hello shih⁴-chieh⁴!"
toWadeGiles("iPhone 手機 Pro").text; // "iPhone shou³-chi¹ Pro"
toWadeGiles("2024年").text; // "2024nien²"
```

### Options

```typescript
toWadeGiles("台北", {
  toneFormat: "superscript", // 'superscript' | 'number' | 'none'
  separator: "-", // Separator between syllables
  preserveNonChinese: true, // Keep non-Chinese characters
  capitalize: false, // Capitalize first letter
  polyphoneMode: "auto", // 'auto' | 'all'
  urlSafe: false, // ASCII-only output
});
```

### Direct Pinyin Conversion

```typescript
import { pinyinToWadeGiles } from "use-wg";

pinyinToWadeGiles("zhong1"); // "chung¹"
pinyinToWadeGiles("guo2"); // "kuo²"
pinyinToWadeGiles("qi4"); // "ch'i⁴"
```

### Utility Functions

```typescript
import { containsChinese } from "use-wg";

containsChinese("Hello 世界"); // true
containsChinese("Hello World"); // false
```

### Segments Information

Access detailed conversion information:

```typescript
const result = toWadeGiles("台北");

console.log(result.text); // "t'ai²-pei³"
console.log(result.segments);
// [
//   { original: "台", pinyin: "tai2", wadeGiles: "t'ai", tone: 2 },
//   { original: "北", pinyin: "bei3", wadeGiles: "pei", tone: 3 }
// ]
```

## Wade-Giles Mapping

Key conversion patterns:

| Pinyin  | Wade-Giles | Example        |
| ------- | ---------- | -------------- |
| b → p   | ba → pa    | 八 bā → pa¹    |
| p → p'  | pa → p'a   | 怕 pà → p'a⁴   |
| d → t   | da → ta    | 大 dà → ta⁴    |
| t → t'  | ta → t'a   | 他 tā → t'a¹   |
| g → k   | ga → ka    | 高 gāo → kao¹  |
| k → k'  | ka → k'a   | 看 kàn → k'an⁴ |
| j → ch  | ji → chi   | 雞 jī → chi¹   |
| q → ch' | qi → ch'i  | 氣 qì → ch'i⁴  |
| x → hs  | xi → hsi   | 西 xī → hsi¹   |
| zh → ch | zhi → chih | 知 zhī → chih¹ |
| z → ts  | zi → tzu   | 子 zǐ → tzu³   |
| c → ts' | ci → tz'u  | 次 cì → tz'u⁴  |
| r → j   | ri → jih   | 日 rì → jih⁴   |
| si → ss | si → ssu   | 四 sì → ssu⁴   |

## API Reference

### `toWadeGiles(text, options?)`

Convert Chinese text to Wade-Giles romanization.

**Parameters:**

- `text` (string) - Chinese text to convert
- `options` (WadeGilesOptions) - Optional configuration

**Returns:** `WadeGilesResult`

### `pinyinToWadeGiles(pinyin, options?)`

Convert a pinyin syllable to Wade-Giles.

**Parameters:**

- `pinyin` (string) - Pinyin syllable with optional tone number
- `options` ({ toneFormat?: ToneFormat }) - Optional tone format

**Returns:** `string`

### `containsChinese(text)`

Check if a string contains Chinese characters.

**Parameters:**

- `text` (string) - Text to check

**Returns:** `boolean`

## Types

```typescript
type ToneFormat = "superscript" | "number" | "none";

interface WadeGilesOptions {
  toneFormat?: ToneFormat; // Default: 'superscript'
  separator?: string; // Default: '-'
  preserveNonChinese?: boolean; // Default: true
  capitalize?: boolean; // Default: false
  polyphoneMode?: "auto" | "all"; // Default: 'auto'
  urlSafe?: boolean; // Default: false
}

interface WadeGilesResult {
  text: string;
  segments: WadeGilesSegment[];
}

interface WadeGilesSegment {
  original: string;
  pinyin: string;
  wadeGiles: string;
  tone?: number;
  alternatives?: string[];
}
```

## Performance

Run benchmark: `npm run benchmark`

| Test             | Input                             | Avg (ms) | Ops/sec |
| ---------------- | --------------------------------- | -------- | ------- |
| Short (2 chars)  | `台灣`                            | 0.0037   | 273,321 |
| Medium (8 chars) | `這是一個測試句子`                | 0.0108   | 92,664  |
| Long (11 chars)  | `台北市信義區忠孝東路四段`        | 0.0150   | 66,465  |
| Mixed text       | `Hello 世界! This is a test 測試` | 0.0063   | 159,867 |
| With numbers     | `2024年台灣之旅`                  | 0.0064   | 157,288 |
| URL-safe short   | `台灣`                            | 0.0031   | 318,489 |
| URL-safe mixed   | `My 台灣 Trip 2024年`             | 0.0057   | 176,106 |

**Average: ~180,000 ops/sec**

## Requirements

- Node.js >= 22
- npm >= 10.0.0

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Type check
npm run type-check
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Gary Lai - [@imgarylai](https://github.com/imgarylai)
