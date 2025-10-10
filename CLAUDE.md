# Claude Code 開発メモ - 健康家計アプリ (React版)

**最終更新: 2025-10-10**

## 📋 プロジェクト概要

Vanilla JSで開発した「健康家計アプリ」をReact + TypeScriptに移行したプロジェクト。
食事記録、カロリー管理、家計簿、在庫管理、AIレシピ生成、バーコードスキャンなどの機能を実装。

**リポジトリ:** https://github.com/Haradakouta/life-pwa-react
**GitHub Pages:** https://haradakouta.github.io/life-pwa-react/
**元プロジェクト:** `/mnt/c/Users/231047/life-pwa`

---

## 🚨 現在の最優先課題

### GitHub Pages デプロイ問題（未解決）

**症状:**
- ✅ ダッシュボード、食事記録、在庫管理などは正常表示
- ❌ **AIレシピ画面**と**設定画面**が真っ白のまま
- GitHub Pages: https://haradakouta.github.io/life-pwa-react/

**原因の仮説:**
1. ~~Service Workerのパス問題~~ ✅ 修正済み (`import.meta.env.BASE_URL`使用)
2. ~~古いキャッシュが残っている~~ ✅ キャッシュバージョンをv2に更新済み
3. ~~インラインスタイルのハードコードされた色~~ ✅ CSS変数に変更済み
4. **⚠️ まだ特定できていない問題がある可能性**

**これまでの修正履歴:**
```bash
# 修正1: vite.config.ts にbase設定追加
base: '/life-pwa-react/'

# 修正2: Service Worker登録パス修正
register(`${import.meta.env.BASE_URL}sw.js`)

# 修正3: manifest.webmanifest、sw.jsのパス修正
全てのパスに /life-pwa-react/ プレフィックスを追加

# 修正4: キャッシュバージョンアップ
CACHE_VERSION = 'v1' → 'v2'

# 修正5: インラインスタイルのCSS変数化（RecipeGenerator, RecipeHistory）
background: 'white' → 'var(--card)'
color: '#333' → 'var(--text)'
border: '#ddd' → 'var(--border)'
```

**次回セッションで確認すべきこと:**

1. **ブラウザのコンソールでエラー確認**
   ```
   F12 → Console タブ
   赤いエラーメッセージをすべて確認
   ```

2. **Network タブで読み込み失敗を確認**
   ```
   F12 → Network タブ
   レシピ/設定画面を開く
   赤くなっているリクエストを確認（404エラーなど）
   ```

3. **CSS変数が正しく定義されているか確認**
   ```
   F12 → Elements タブ → <html> または <body>
   Computed スタイルで --card, --text, --border の値を確認
   ```

4. **RecipeDisplay、FavoriteRecipesのインラインスタイル確認**
   - まだこれらのコンポーネントは修正していない
   - 同様のハードコードされた色がある可能性

5. **JavaScript エラーの可能性**
   - Zustand ストアの初期化エラー
   - useRecipeStore の localStorage 読み込みエラー
   - useSettingsStore の問題

**デバッグ手順:**
```bash
# ローカルで動作確認
npm run dev
# → http://localhost:5173 でレシピ/設定画面が正常に表示されるか

# プロダクションビルドで確認
npm run build
npm run preview
# → http://localhost:4173 で確認（GitHub Pagesと同じビルド成果物）

# GitHub Pagesで確認
# 1. Ctrl+Shift+R で強制リロード
# 2. F12 → Application → Storage → Clear site data
# 3. F12 → Application → Service Workers → Unregister
```

---

## ✅ 完了した実装

### 全9画面 実装完了

1. **Dashboard（ホーム）** - `src/components/dashboard/`
2. **食事記録** - `src/components/meals/`
3. **設定** - `src/components/settings/` ⚠️ GitHub Pagesで白い
4. **在庫管理** - `src/components/stock/`
5. **買い物リスト** - `src/components/shopping/`
6. **AIレシピ** - `src/components/recipe/` ⚠️ GitHub Pagesで白い
7. **バーコードスキャン** - `src/components/barcode/`
8. **レポート** - `src/components/report/`
9. **PWA対応** - Service Worker + Manifest

### 主要機能

- ✅ Zustand による状態管理（localStorage 永続化）
- ✅ TypeScript 型安全性
- ✅ Recharts グラフ可視化
- ✅ Google Gemini API（AIレシピ生成）
- ✅ ZXing バーコードスキャン
- ✅ PWA対応（オフライン動作）
- ✅ ダークモード
- ✅ データエクスポート（CSV/JSON）
- ✅ レスポンシブデザイン

---

## 🏗️ プロジェクト構成

```
life-pwa-react/
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.webmanifest    # PWAマニフェスト
│   └── sw.js                    # Service Worker (v2)
│
├── src/
│   ├── api/
│   │   ├── gemini.ts           # Gemini 2.0 Flash API
│   │   └── rakuten.ts          # 4つの商品検索API
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Layout.tsx      # メインレイアウト・画面遷移
│   │   ├── dashboard/          # ホーム画面
│   │   ├── meals/              # 食事記録
│   │   ├── settings/           # 設定 ⚠️
│   │   ├── stock/              # 在庫管理
│   │   ├── shopping/           # 買い物リスト
│   │   ├── recipe/             # AIレシピ ⚠️
│   │   ├── barcode/            # バーコードスキャン
│   │   └── report/             # レポート
│   │
│   ├── store/
│   │   ├── useIntakeStore.ts   # 食事記録
│   │   ├── useExpenseStore.ts  # 支出
│   │   ├── useStockStore.ts    # 在庫
│   │   ├── useShoppingStore.ts # 買い物リスト
│   │   ├── useRecipeStore.ts   # レシピ履歴・お気に入り
│   │   └── useSettingsStore.ts # 設定・ダークモード
│   │
│   ├── types/                   # TypeScript型定義
│   ├── utils/                   # ユーティリティ関数
│   ├── styles/
│   │   └── global.css          # グローバルCSS（元のstyle.cssコピー）
│   ├── App.tsx                 # ルートコンポーネント
│   └── main.tsx                # エントリーポイント
│
├── vite.config.ts              # Vite設定（base: '/life-pwa-react/'）
├── package.json                # deployスクリプト追加済み
├── .env.example                # 環境変数テンプレート
├── PROGRESS.md                 # 開発進捗（100%完了）
└── CLAUDE.md                   # このファイル
```

---

## 🔧 技術スタック

### フロントエンド
- **React 19** + **TypeScript**
- **Vite** - ビルドツール
- **Zustand** - 状態管理
- **Recharts** - グラフ表示
- **@zxing/library** - バーコードスキャン
- **Material-UI (MUI)** - UIコンポーネント

### 外部API
- **Google Gemini API** (Gemini 2.0 Flash)
- **楽天市場商品検索API**
- **楽天商品検索API**
- **JAN Code Lookup API**
- **Open Food Facts API**

### PWA
- **Service Worker** (Network-first戦略)
- **Web App Manifest**

---

## 🚀 開発コマンド

```bash
# ローカル開発サーバー起動
npm run dev
# → http://localhost:5173

# プロダクションビルド
npm run build

# プロダクションプレビュー
npm run preview
# → http://localhost:4173

# GitHub Pages デプロイ
npm run deploy
# → gh-pages ブランチにビルド成果物をプッシュ
```

---

## 📝 APIキー設定

`.env.example` をコピーして `.env` を作成:

```env
VITE_GEMINI_API_KEY=AIzaSyBSqmtDaNAqF09NTYYKQsTKm-3fLl1LMr0
VITE_RAKUTEN_APP_ID=YOUR_RAKUTEN_APP_ID_HERE
VITE_JANCODE_APP_ID=b72c14dc75bcde18fb7d3628bf7e92b7
```

---

## 🐛 既知の問題

### 1. GitHub Pages で AIレシピ・設定画面が真っ白 ⚠️ **最優先**

**症状:**
- ダッシュボード、食事、在庫などは表示される
- AIレシピと設定だけが白い画面

**これまでの修正:**
- ✅ Service Worker パス修正
- ✅ キャッシュバージョンアップ (v1 → v2)
- ✅ RecipeGenerator、RecipeHistory のインラインスタイル修正

**まだ試していないこと:**
- RecipeDisplay.tsx の修正
- FavoriteRecipes.tsx の修正
- SettingsScreen.tsx の詳細確認
- ブラウザコンソールのエラー確認（ユーザーからのフィードバック待ち）

### 2. Recharts の型エラー

**解決済み**: Pie Chart の label プロパティを `any` 型で回避

### 3. バンドルサイズ警告

**症状:**
```
dist/assets/index-XXX.js   977.78 kB │ gzip: 281.71 kB
(!) Some chunks are larger than 500 kB
```

**今後の改善案:**
- コード分割 (React.lazy, dynamic import)
- ライブラリの軽量化（MUIの代わりにHeadless UIなど）

---

## 🎯 次にやるべきこと

### 優先度: 最高 ⚠️

1. **GitHub Pages 白画面問題の解決**
   - [ ] ブラウザコンソールでエラー確認
   - [ ] Network タブで404エラー確認
   - [ ] RecipeDisplay.tsx のインラインスタイル修正
   - [ ] FavoriteRecipes.tsx のインラインスタイル修正
   - [ ] SettingsScreen.tsx の問題確認
   - [ ] CSS変数が正しく定義されているか確認
   - [ ] Zustand ストアの初期化エラー確認

2. **ローカルとプロダクションの動作確認**
   ```bash
   # ローカル
   npm run dev

   # プロダクションビルド
   npm run build
   npm run preview

   # 両方で問題なければGitHub Pagesの設定が原因
   ```

### 優先度: 高

3. **残りのコンポーネントのインラインスタイル修正**
   - [ ] RecipeDisplay.tsx
   - [ ] FavoriteRecipes.tsx
   - [ ] 全コンポーネントで `background: 'white'` など検索
   - [ ] 全て `var(--card)`, `var(--text)`, `var(--border)` に置換

4. **CSS変数の追加**
   - 現在定義されている変数:
     ```css
     --background
     --text
     --card
     --primary
     --primary-dark
     --border
     ```
   - 追加したい変数:
     ```css
     --text-secondary: #666 (light), #999 (dark)
     ```

### 優先度: 中

5. **パフォーマンス最適化**
   - [ ] コード分割 (React.lazy)
   - [ ] バンドルサイズ削減
   - [ ] 画像最適化

6. **テスト追加**
   - [ ] E2Eテスト (Playwright)
   - [ ] ユニットテスト (Vitest)

7. **アクセシビリティ**
   - [ ] ARIA属性
   - [ ] キーボードナビゲーション

---

## 🔍 デバッグ方法

### Service Worker のクリア

```javascript
// DevTools Console で実行
await caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))));
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
location.reload();
```

### localStorage のクリア

```javascript
localStorage.clear();
location.reload();
```

### ビルド成果物の確認

```bash
# distフォルダの内容確認
ls -la dist/
cat dist/index.html

# gh-pagesブランチの確認
git checkout gh-pages
ls -la
git checkout main
```

---

## 📚 参考資料

### 元プロジェクト
- パス: `/mnt/c/Users/231047/life-pwa`
- CLAUDE.md: 元プロジェクトの詳細な開発履歴あり
- 特にインラインスタイルや色の扱いを参考にする

### Vite設定
- base: GitHub Pages のサブディレクトリ配信用
- https://vitejs.dev/guide/static-deploy.html#github-pages

### GitHub Pages
- Settings → Pages → Source: gh-pages ブランチ
- URL: https://haradakouta.github.io/life-pwa-react/

---

## 💡 開発のヒント

### 新しいコンポーネント作成時の注意

1. **インラインスタイルでCSS変数を使う**
   ```tsx
   // ❌ ダメな例
   style={{ background: 'white', color: '#333' }}

   // ✅ 良い例
   style={{ background: 'var(--card)', color: 'var(--text)' }}
   ```

2. **型定義を確認**
   - `src/types/` を必ず確認
   - `import type { ... }` を使う（verbatimModuleSyntax）

3. **Zustand ストアの使い方**
   ```tsx
   import { useIntakeStore } from '../../store';

   const { intakes, addIntake } = useIntakeStore();
   ```

### GitHub Pages デプロイ後の確認

1. 数分待つ（デプロイに時間がかかる）
2. 強制リロード (`Ctrl+Shift+R`)
3. Service Worker削除
4. キャッシュクリア
5. コンソールでエラー確認

---

## 📅 開発履歴

### 2025-10-10 (今回のセッション)

**GitHub Pages デプロイ問題の調査・修正:**

1. **vite.config.ts 修正**
   - `base: '/life-pwa-react/'` 追加

2. **Service Worker パス修正**
   - `public/sw.js`: STATIC_RESOURCESに `/life-pwa-react/` プレフィックス
   - `src/main.tsx`: `register(\`${import.meta.env.BASE_URL}sw.js\`)`

3. **manifest.webmanifest 修正**
   - start_url, icons, shortcuts を全て `/life-pwa-react/` 対応

4. **gh-pages デプロイ設定**
   - package.json に `deploy` スクリプト追加
   - `gh-pages` パッケージインストール

5. **Service Worker キャッシュバージョンアップ**
   - `CACHE_VERSION = 'v2'` に変更（v1キャッシュを強制削除）

6. **RecipeGenerator, RecipeHistory のインラインスタイル修正**
   - `background: 'white'` → `'var(--card)'`
   - `color: '#333'` → `'var(--text)'`
   - `border: '#ddd'` → `'var(--border)'`

**未解決:**
- AIレシピと設定画面がまだ白い
- 次回、ブラウザコンソールのエラー確認が必要

### 2025-10-10 (以前のセッション)

- React + TypeScript 移行完了
- 全9画面実装完了
- Zustand 状態管理
- Recharts グラフ実装
- ZXing バーコードスキャン実装
- PWA対応（Service Worker + Manifest）

---

## 🤝 コラボレーション

このプロジェクトは Claude Code で開発されています。

**次回セッション開始時の確認事項:**

1. このファイル (CLAUDE.md) を読む
2. 「🚨 現在の最優先課題」セクションを確認
3. ブラウザコンソールのエラーをユーザーに確認してもらう
4. エラー内容に応じて修正方針を決定

**よく使うコマンド:**
```bash
# ローカル開発
npm run dev

# ビルド
npm run build

# GitHub Pagesデプロイ
npm run deploy

# ブランチ切り替え
git checkout gh-pages  # デプロイされたファイル確認
git checkout main      # 開発用
```

---

**Happy Coding! 🚀**

**次回の目標: GitHub Pages の白画面問題を解決する！**
