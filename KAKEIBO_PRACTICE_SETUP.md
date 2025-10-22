# kakeibo-practice リポジトリへのセットアップ手順

life-pwa-react を kakeibo-practice リポジトリで動作させるための手順です。

## 現在の状況

✅ ビルド済みのファイル（dist フォルダ）が main ブランチにコミットされています

## 必要な設定

### 1. Vite Base Path を修正（重要！）

kakeibo-practice では、base path を `/kakeibo-practice/` に設定する必要があります。

#### vite.config.ts を修正

`vite.config.ts` の以下の行を修正します：

```typescript
// 変更前（life-pwa-react用）
base: '/life-pwa-react/',

// 変更後（kakeibo-practice用）
base: '/kakeibo-practice/',
```

### 2. index.html のパスを修正

`index.html` の PWA 関連パスを修正します：

```html
<!-- 変更前 -->
<link rel="manifest" href="/life-pwa-react/manifest.webmanifest" />
<link rel="icon" type="image/png" sizes="192x192" href="/life-pwa-react/icon-192.png" />

<!-- 変更後 -->
<link rel="manifest" href="/kakeibo-practice/manifest.webmanifest" />
<link rel="icon" type="image/png" sizes="192x192" href="/kakeibo-practice/icon-192.png" />
```

### 3. Service Worker キャッシュパスを修正

`public/sw.js` の以下の行を修正します：

```javascript
// 変更前
const STATIC_RESOURCES = [
  '/life-pwa-react/',
  '/life-pwa-react/index.html',
  '/life-pwa-react/manifest.webmanifest',
  '/life-pwa-react/icon-192.png',
  '/life-pwa-react/icon-512.png',
];

// 変更後
const STATIC_RESOURCES = [
  '/kakeibo-practice/',
  '/kakeibo-practice/index.html',
  '/kakeibo-practice/manifest.webmanifest',
  '/kakeibo-practice/icon-192.png',
  '/kakeibo-practice/icon-512.png',
];
```

### 4. manifest.webmanifest パスを修正

`public/manifest.webmanifest` の以下の行を修正します：

```json
{
  "start_url": "/kakeibo-practice/",

  "icons": [
    {
      "src": "/kakeibo-practice/icon-192.png",
      ...
    },
    {
      "src": "/kakeibo-practice/icon-512.png",
      ...
    }
  ],

  "shortcuts": [
    {
      "url": "/kakeibo-practice/?screen=meals",
      ...
    },
    ...
  ]
}
```

## デプロイ手順

### ステップ1: 修正を完了

上記のすべての修正を完了します。

### ステップ2: ビルド＆テスト

```bash
# ビルド
npm run build

# プレビュー（ローカルでテスト）
npm run preview
# → http://localhost:4173 でアプリをテスト
```

### ステップ3: コミット＆プッシュ

```bash
# すべての変更をステージング
git add -A

# コミット
git commit -m "Configure for kakeibo-practice repository"

# kakeibo-practiceにプッシュ
git push kakeibo main
```

### ステップ4: GitHub Pages を有効化

1. https://github.com/satorimakurinosatorukun/kakeibo-practice にアクセス
2. **Settings** → **Pages**
3. **Source**: `main` ブランチを選択
4. **Folder**: `/` (root) を選択
5. **Save**

### ステップ5: 確認

数分後、以下の URL でアプリが表示されます：

```
https://satorimakurinosatorukun.github.io/kakeibo-practice/
```

## トラブルシューティング

### 画面が白い

1. ブラウザキャッシュをクリア（`Ctrl+Shift+Delete`）
2. 強制リロード（`Ctrl+Shift+R`）
3. コンソール（F12）でエラーを確認

### 404 エラー

コンソールで以下を実行：

```javascript
console.log(import.meta.env.BASE_URL);
// /kakeibo-practice/ が表示されるか確認
```

### アセットパスエラー

ブラウザコンソールで以下を実行：

```javascript
// マニフェスト確認
fetch('/kakeibo-practice/manifest.webmanifest')
  .then(res => console.log('Manifest:', res.status));

// アイコン確認
fetch('/kakeibo-practice/icon-192.png')
  .then(res => console.log('Icon:', res.status));
```

## 推奨：GitHub Actions で自動デプロイ

将来的には、GitHub Actions で自動ビルド＆デプロイを設定することをお勧めします。

`.github/workflows/deploy.yml` を以下の内容で作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run build

      - name: Commit build
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add dist
          git commit -m "Build for deployment" || true
          git push origin main
```

---

**設定完了後、コンソールで以下を実行して動作確認してください：**

```javascript
console.log('✅ App is running on:', window.location.href);
console.log('✅ Base URL:', import.meta.env.BASE_URL);
```
