# TypeScript 套件開發模板

一個現代化、配置完善的 TypeScript npm 套件開發模板。此模板提供了堅實的基礎，包含最佳實踐和 TypeScript 套件開發所需的必要工具。

[![CI](https://github.com/imgarylai/ts-package-starter/actions/workflows/test.yml/badge.svg)](https://github.com/imgarylai/ts-package-starter/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 功能特色

- 📦 使用 [tsup](https://github.com/egoist/tsup) 的現代化建置設定
- 🔥 支援 ESM 和 CommonJS
- 📘 嚴格模式的 TypeScript
- 🧪 使用 Jest 進行測試
- 📊 程式碼覆蓋率報告
- 📝 使用 TypeDoc 產生 API 文件
- ✨ 使用 Prettier 格式化程式碼
- 🚨 使用 ESLint 進行程式碼檢查
- 🔄 使用 GitHub Actions 進行持續整合
- 📋 使用 commitlint 規範提交訊息
- 🪝 使用 husky 管理 Git hooks
- 🌲 支援 Tree-shaking 的匯出
- 📦 最佳化的 npm 套件匯出
- 🤖 使用 Renovate 自動更新相依套件

## 系統需求

- Node.js >= 22.14.0
- npm >= 10.0.0

## 快速開始

1. 點擊 GitHub 上的「Use this template」按鈕使用此模板，或直接複製：

```bash
git clone https://github.com/imgarylai/ts-package-starter.git my-package
cd my-package
```

2. 更新套件資訊：

   - 修改 `package.json` 中的套件名稱、描述、作者等資訊
   - 更新此 README.md 為您套件的資訊
   - 如有需要，更新 LICENSE 檔案

3. 安裝相依套件：

```bash
npm install
```

4. 開始開發：

```bash
npm run dev
```

## 使用範例

這是您發布套件後的使用範例。請更新此區塊為您自己套件的使用方式：

```typescript
// 這只是一個範例 - 請替換為您自己套件的使用方式
import { YourFunction } from "your-package-name";

// 使用您的套件
const result = YourFunction();
```

## 開發指南

### 設定環境

1. 複製儲存庫：

```bash
git clone https://github.com/imgarylai/ts-package-starter.git
cd ts-package-starter
```

2. 安裝相依套件：

```bash
npm install
```

3. 開始開發：

```bash
npm run dev
```

### 可用的指令

- `npm run build` - 使用 tsup 建置套件
- `npm run dev` - 監聽模式開發
- `npm test` - 執行測試
- `npm run test:coverage` - 執行測試並產生覆蓋率報告
- `npm run lint` - 檢查程式碼
- `npm run type-check` - 檢查型別
- `npm run docs` - 產生文件
- `npm run docs:watch` - 監聽模式產生文件
- `npm run clean` - 清除建置輸出
- `npm run prepare` - 安裝 git hooks

### 專案結構

```
.
├── src/               # 原始碼
│   ├── index.ts      # 主要進入點
│   └── index.test.ts # 測試
├── .github/          # GitHub 配置
├── .husky/           # Git hooks
├── dist/             # 建置檔案（自動產生）
├── docs/             # 產生的文件
├── coverage/         # 測試覆蓋率報告
└── node_modules/     # 相依套件
```

## 開發工作流程

1. 在 `src` 目錄中撰寫程式碼
2. 在 `*.test.ts` 檔案中撰寫測試
3. 使用 `npm test` 執行測試
4. 使用 `npm run build` 建置套件

## 發布

此套件使用 semantic-release 根據約定式提交訊息自動發布。流程完全自動化，將會：

- 根據提交訊息決定下一個版本號
- 產生發布說明
- 更新 CHANGELOG.md
- 建立 GitHub release
- 發布到 npm

### 運作方式

發布流程由推送到 main 分支的提交觸發。版本號的升級由您的提交訊息決定：

- `fix: ...` - 修補版本 (1.0.0 → 1.0.1)
- `feat: ...` - 次要版本 (1.0.0 → 1.1.0)
- `BREAKING CHANGE: ...` 在提交內容中 - 主要版本 (1.0.0 → 2.0.0)
- `feat!: ...` - 包含破壞性變更的主要版本 (1.0.0 → 2.0.0)

範例：

```bash
# 修補版本
git commit -m "fix: 修正網路逾時問題"

# 次要版本
git commit -m "feat: 新增 API 端點"

# 主要版本
git commit -m "feat!: 重新設計公開 API
BREAKING CHANGE: 整個公開 API 已重新設計"
```

### 設定需求

要啟用自動發布，您需要：

1. 如果沒有 npm 帳號，請先建立一個
2. 建立 npm 存取權杖：

   - 前往 npmjs.com 並登入
   - 點擊您的頭像 → 「Access Tokens」
   - 點擊「Generate New Token」（選擇「Automation」類型）
   - 複製權杖

3. 將 npm 權杖加入您的 GitHub 儲存庫：
   - 前往您的 GitHub 儲存庫設定
   - 點擊「Secrets and variables」→「Actions」
   - 點擊「New repository secret」
   - 名稱：`NPM_TOKEN`
   - 值：您的 npm 存取權杖
   - 點擊「Add secret」

### 開發工作流程

1. 撰寫程式碼並使用約定式提交訊息提交
2. 推送到 main 分支
3. semantic-release 將自動：
   - 分析提交訊息
   - 升級版本
   - 產生變更日誌
   - 建立 GitHub release
   - 發布到 npm

> 注意：只有推送到 main 分支的提交才會觸發發布。開發功能時，請使用功能分支和 Pull Request。

## 貢獻指南

1. Fork 此儲存庫
2. 建立您的功能分支（`git checkout -b feature/amazing-feature`）
3. 使用約定式提交訊息提交變更（`git commit -m 'feat: 新增厲害的功能'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 開啟 Pull Request

### 提交訊息規範

此專案使用[約定式提交](https://www.conventionalcommits.org/)。範例：

- `feat: 新增新功能`
- `fix: 修復錯誤`
- `docs: 更新 README`
- `chore: 更新相依套件`

## 建置

此專案使用 tsup 進行建置，提供：

- 多種格式輸出（ESM、CommonJS）
- TypeScript 宣告檔案
- Source maps
- Tree shaking
- 最小化

## 文件

此專案使用 TypeDoc 產生 API 文件。文件會在每次推送到 main 分支時自動建置並部署到 GitHub Pages。

### 本地文件

在本地產生文件：

```bash
# 產生文件
npm run docs

# 監聽模式產生文件
npm run docs:watch
```

文件將產生在 `docs` 目錄。

### 線上文件

文件會自動部署到 GitHub Pages：
[https://imgarylai.github.io/ts-package-starter](https://imgarylai.github.io/ts-package-starter)

文件功能：

- 完整的 API 參考
- 型別資訊
- 搜尋功能
- 版本資訊
- 整合 README
- 範例和使用方式

### GitHub Pages 設定

要為您的文件設定 GitHub Pages：

1. 前往您的 GitHub 儲存庫設定
2. 在「Code and automation」下導航到「Pages」
3. 在「Build and deployment」下：
   - Source：選擇「GitHub Actions」
   - Branch：保持預設（gh-pages 將自動建立）

文件將在以下情況自動建置和部署：

- 您推送到 main 分支
- GitHub Actions 工作流程成功完成

您也可以手動觸發文件建置：

1. 前往儲存庫的「Actions」分頁
2. 選擇「Documentation」工作流程
3. 點擊「Run workflow」

### 文件配置

文件配置在 `typedoc.json` 中。主要功能：

- 排除 private 和 protected 成員
- 包含版本資訊
- 驗證連結和匯出
- 使用預設主題
- 整合 README

## 相依套件管理

此專案使用 [Renovate](https://docs.renovatebot.com/) 自動更新相依套件。配置包括：

- 自動合併次要和修補版本更新
- 每週末更新相依套件
- 自動 rebase 更新
- 非主要相依套件會分組處理
- Node.js 版本更新已停用（手動管理）

Renovate 機器人將根據此排程和配置自動建立相依套件更新的 Pull Request。這有助於保持相依套件更新，同時減少維護負擔。

## 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案。

## 作者

Gary Lai - [@imgarylai](https://github.com/imgarylai)

## 致謝

- [tsup](https://github.com/egoist/tsup) 提供優秀的建置工具
- [TypeScript](https://www.typescriptlang.org/) 提供型別系統
- [Jest](https://jestjs.io/) 提供測試框架
- [ESLint](https://eslint.org/) 提供程式碼檢查
- [Prettier](https://prettier.io/) 提供程式碼格式化
- [Husky](https://typicode.github.io/husky/) 提供 git hooks
