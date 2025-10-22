# GitHub Pages セットアップガイド

kakeibo-practice リポジトリで GitHub Pages を有効にするための手順です。

## 方法1: GitHub UI で設定（推奨）

### ステップ1: GitHub リポジトリにアクセス

https://github.com/satorimakurinosatorukun/kakeibo-practice

### ステップ2: Settings を開く

1. リポジトリのページで **Settings** タブをクリック
2. 左側メニューから **Pages** を選択

### ステップ3: Source を設定

1. **Source** セクションを探す
2. **Build and deployment** で以下を設定：
   - **Branch**: `main` を選択
   - **Folder**: `/ (root)` を選択

### ステップ4: Save

設定を保存します。数分後、GitHub Pages が有効化されます。

## URL

GitHub Pages の URL は以下のようになります：

```
https://satorimakurinosatorukun.github.io/kakeibo-practice/
```

## 確認方法

1. ブラウザで上記 URL にアクセス
2. アプリが表示されるか確認
3. **F12** キーでコンソールを開き、エラーがないか確認

## トラブルシューティング

### 404 エラーが出る

**原因**: GitHub Pages がまだ有効化されていない

**対処**:
- Settings → Pages で Source が `main` に設定されているか確認
- 「Your site is live at」というメッセージが表示されているか確認

### アセットが 404

**原因**: パスが正しくない

**対処**:
- ブラウザのコンソールで以下を実行：
  ```javascript
  console.log('Base URL:', import.meta.env.BASE_URL);
  ```
- `/kakeibo-practice/` が表示されているか確認

### キャッシュが古い

**対処**:
1. `Ctrl+Shift+Delete` でキャッシュをクリア
2. `Ctrl+Shift+R` で強制リロード

## 詳細情報

- [GitHub Pages 公式ドキュメント](https://docs.github.com/en/pages)
- [React + Vite での GitHub Pages デプロイ](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

**設定が完了したら、コンソールで以下を実行して確認してください：**

```javascript
// Base URL の確認
console.log('✅ Base URL:', import.meta.env.BASE_URL);

// マニフェストの確認
fetch(import.meta.env.BASE_URL + 'manifest.webmanifest')
  .then(res => console.log('✅ Manifest:', res.status === 200 ? 'OK' : 'NOT FOUND'))
  .catch(err => console.error('❌ Manifest:', err));

// アイコンの確認
fetch(import.meta.env.BASE_URL + 'icon-192.png')
  .then(res => console.log('✅ Icon:', res.status === 200 ? 'OK' : 'NOT FOUND'))
  .catch(err => console.error('❌ Icon:', err));
```
