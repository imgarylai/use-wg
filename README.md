# use-wg

將中文字轉換為威妥瑪拼音的 TypeScript 函式庫。

[![CI](https://github.com/imgarylai/use-wg/actions/workflows/test.yml/badge.svg)](https://github.com/imgarylai/use-wg/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.en.md)

## 功能特色

- 中文字（繁體及簡體）→ 威妥瑪拼音轉換
- 可設定聲調格式（上標、數字、無）
- 處理中英文混合文字
- URL 安全輸出模式
- 上下文感知的多音字處理
- 完整的 TypeScript 型別定義

## 安裝

```bash
npm install use-wg
```

## 使用方式

### 基本轉換

```typescript
import { toWadeGiles } from "use-wg";

// 基本轉換
toWadeGiles("台灣").text; // "t'ai²-wan¹"
toWadeGiles("台北").text; // "t'ai²-pei³"
toWadeGiles("高雄").text; // "kao¹-hsiung²"
```

### 聲調格式

```typescript
// 上標聲調（預設）
toWadeGiles("高雄", { toneFormat: "superscript" }).text; // "kao¹-hsiung²"

// 數字聲調
toWadeGiles("高雄", { toneFormat: "number" }).text; // "kao1-hsiung2"

// 無聲調
toWadeGiles("高雄", { toneFormat: "none" }).text; // "kao-hsiung"
```

### URL 安全模式

產生僅包含 ASCII 字元的輸出，適用於網址、檔案名稱和識別碼：

```typescript
toWadeGiles("台灣", { urlSafe: true }).text; // "tai-wan"
toWadeGiles("氣功", { urlSafe: true }).text; // "chi-kung"
```

URL 安全模式會自動：

- 移除聲調標記
- 將 `ü` 轉換為 `u`
- 移除撇號（`'`）
- 輸出小寫

### 中英文混合文字

轉換器能智慧處理混合文字：

```typescript
toWadeGiles("Hello 世界!").text; // "Hello shih⁴-chieh⁴!"
toWadeGiles("iPhone 手機 Pro").text; // "iPhone shou³-chi¹ Pro"
toWadeGiles("2024年").text; // "2024nien²"
```

### 選項設定

```typescript
toWadeGiles("台北", {
  toneFormat: "superscript", // 'superscript' | 'number' | 'none'
  separator: "-", // 音節分隔符號
  preserveNonChinese: true, // 保留非中文字元
  capitalize: false, // 首字母大寫
  polyphoneMode: "auto", // 'auto' | 'all'
  urlSafe: false, // 僅 ASCII 輸出
});
```

### 直接拼音轉換

```typescript
import { pinyinToWadeGiles } from "use-wg";

pinyinToWadeGiles("zhong1"); // "chung¹"
pinyinToWadeGiles("guo2"); // "kuo²"
pinyinToWadeGiles("qi4"); // "ch'i⁴"
```

### 工具函式

```typescript
import { containsChinese } from "use-wg";

containsChinese("Hello 世界"); // true
containsChinese("Hello World"); // false
```

### 分段資訊

取得詳細的轉換資訊：

```typescript
const result = toWadeGiles("台北");

console.log(result.text); // "t'ai²-pei³"
console.log(result.segments);
// [
//   { original: "台", pinyin: "tai2", wadeGiles: "t'ai", tone: 2 },
//   { original: "北", pinyin: "bei3", wadeGiles: "pei", tone: 3 }
// ]
```

## 威妥瑪拼音對照表

主要轉換規則：

| 漢語拼音 | 威妥瑪拼音 | 範例           |
| -------- | ---------- | -------------- |
| b → p    | ba → pa    | 八 bā → pa¹    |
| p → p'   | pa → p'a   | 怕 pà → p'a⁴   |
| d → t    | da → ta    | 大 dà → ta⁴    |
| t → t'   | ta → t'a   | 他 tā → t'a¹   |
| g → k    | ga → ka    | 高 gāo → kao¹  |
| k → k'   | ka → k'a   | 看 kàn → k'an⁴ |
| j → ch   | ji → chi   | 雞 jī → chi¹   |
| q → ch'  | qi → ch'i  | 氣 qì → ch'i⁴  |
| x → hs   | xi → hsi   | 西 xī → hsi¹   |
| zh → ch  | zhi → chih | 知 zhī → chih¹ |
| z → ts   | zi → tzu   | 子 zǐ → tzu³   |
| c → ts'  | ci → tz'u  | 次 cì → tz'u⁴  |
| r → j    | ri → jih   | 日 rì → jih⁴   |
| si → ss  | si → ssu   | 四 sì → ssu⁴   |

## API 參考

### `toWadeGiles(text, options?)`

將中文文字轉換為威妥瑪拼音。

**參數：**

- `text` (string) - 要轉換的中文文字
- `options` (WadeGilesOptions) - 選用的設定選項

**回傳值：** `WadeGilesResult`

### `pinyinToWadeGiles(pinyin, options?)`

將拼音音節轉換為威妥瑪拼音。

**參數：**

- `pinyin` (string) - 帶有選用聲調數字的拼音音節
- `options` ({ toneFormat?: ToneFormat }) - 選用的聲調格式

**回傳值：** `string`

### `containsChinese(text)`

檢查字串是否包含中文字元。

**參數：**

- `text` (string) - 要檢查的文字

**回傳值：** `boolean`

## 型別定義

```typescript
type ToneFormat = "superscript" | "number" | "none";

interface WadeGilesOptions {
  toneFormat?: ToneFormat; // 預設: 'superscript'
  separator?: string; // 預設: '-'
  preserveNonChinese?: boolean; // 預設: true
  capitalize?: boolean; // 預設: false
  polyphoneMode?: "auto" | "all"; // 預設: 'auto'
  urlSafe?: boolean; // 預設: false
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

## 系統需求

- Node.js >= 22
- npm >= 10.0.0

## 開發

```bash
# 安裝相依套件
npm install

# 執行測試
npm test

# 建置
npm run build

# 型別檢查
npm run type-check
```

## 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案。

## 作者

Gary Lai - [@imgarylai](https://github.com/imgarylai)
