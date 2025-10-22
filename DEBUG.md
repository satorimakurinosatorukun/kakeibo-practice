# GitHub Pages 白画面デバッグガイド

GitHub Pages で白画面が表示される場合の診断方法です。

## 1. ブラウザコンソールを開く

1. **Windows/Linux**: `F12` キーを押す
2. **Mac**: `Cmd + Option + I` を押す
3. **Console** タブを選択

## 2. ページを再度読み込む

`Ctrl + Shift + R` (Windows/Linux) または `Cmd + Shift + R` (Mac) で強制リロード

## 3. コンソールのエラーメッセージをチェック

以下のようなエラーが出ていないか確認してください：

### よくあるエラーと対処方法

#### ❌ 404 エラー（アセットが見つからない）
```
Failed to load resource: the server responded with a status of 404
icon-192.png:1
manifest.webmanifest:1
```

**原因**: パス設定の問題
**対処**: `/life-pwa-react/` パスが正しく設定されているか確認

#### ❌ Manifest フェッチエラー
```
Manifest fetch from https://... failed, code 404
```

**原因**: manifest.webmanifest が見つからない
**対処**: `public/manifest.webmanifest` が存在するか確認

#### ❌ Service Worker エラー
```
[SW] Registration failed: TypeError: Failed to fetch
```

**原因**: Service Worker ファイルが見つからない
**対処**: `public/sw.js` が存在するか確認

#### ❌ React エラー
```
TypeError: Cannot read property 'xxx' of undefined
ReferenceError: xxx is not defined
```

**原因**: コンポーネント内部のエラー
**対処**: [デバッグコマンド](#デバッグコマンド) を実行

## 4. デバッグコマンド

ブラウザコンソールで以下のコマンドを実行してデバッグします：

### キャッシュとService Workerをクリア
```javascript
// Step 1: Service Worker をアンレジスタ
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    reg.unregister();
    console.log('[DEBUG] Service Worker unregistered:', reg.scope);
  });
});

// Step 2: すべてのキャッシュを削除
caches.keys().then(keys => {
  Promise.all(keys.map(key => {
    console.log('[DEBUG] Deleting cache:', key);
    return caches.delete(key);
  })).then(() => {
    console.log('[DEBUG] All caches cleared');
  });
});

// Step 3: ページをリロード
setTimeout(() => {
  location.reload();
}, 1000);
```

### アセット確認
```javascript
// Base URL の確認
console.log('[DEBUG] Base URL:', import.meta.env.BASE_URL);

// アセットパスの確認
fetch('/life-pwa-react/manifest.webmanifest')
  .then(res => {
    console.log('[DEBUG] Manifest status:', res.status);
    return res.json();
  })
  .then(data => console.log('[DEBUG] Manifest:', data))
  .catch(err => console.error('[DEBUG] Manifest error:', err));

// アイコン確認
fetch('/life-pwa-react/icon-192.png')
  .then(res => console.log('[DEBUG] Icon status:', res.status))
  .catch(err => console.error('[DEBUG] Icon error:', err));
```

### localStorage 確認
```javascript
// すべてのローカルストレージデータを表示
console.log('[DEBUG] LocalStorage:', localStorage);

// 特定のキーを確認
console.log('[DEBUG] Receipts:', localStorage.getItem('receipts'));
console.log('[DEBUG] Settings:', localStorage.getItem('settings'));

// ローカルストレージをクリア（注意：データが失われます）
localStorage.clear();
console.log('[DEBUG] LocalStorage cleared');
location.reload();
```

### React DevTools 確認
1. [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) 拡張をインストール
2. DevTools で「Components」タブを開く
3. コンポーネント構造とpropsを確認

## 5. ネットワークタブ確認

1. DevTools で「Network」タブを開く
2. ページをリロード
3. 赤いエラーがないか確認：
   - `index.html` - ステータス 200
   - `index-*.js` - ステータス 200
   - `index-*.css` - ステータス 200
   - `manifest.webmanifest` - ステータス 200
   - `icon-192.png` - ステータス 200

## 6. 実際のエラーログを報告

以下の情報とともにエラーを報告してください：

```javascript
// コンソールで実行して結果をコピー
console.log({
  url: window.location.href,
  baseUrl: import.meta.env.BASE_URL,
  userAgent: navigator.userAgent,
  localStorage: JSON.stringify(localStorage),
  timestamp: new Date().toISOString()
});
```

## 7. よくある原因と解決方法

### 画面が真っ白（JavaScriptエラー）
- コンソールでエラーメッセージを確認
- Service Worker のキャッシュをクリア
- ブラウザのローカルストレージをクリア

### アイコンが表示されない
- manifest.webmanifest のパスが正しいか確認
- アイコンファイルが `public/` に存在するか確認

### 機能が動作しない
- 環境変数 (.env) が正しく設定されているか確認
- API キーが有効か確認
- Service Worker のキャッシュをクリア

## 8. 開発環境でのテスト

```bash
# ローカル開発サーバー
npm run dev
# → http://localhost:5173 でテスト

# プロダクション環境をシミュレート
npm run build
npm run preview
# → http://localhost:4173 でテスト
```

## 📞 サポート

上記のデバッグ手順後、以下の情報を報告してください：

1. ブラウザコンソールのエラーメッセージ（完全なスタックトレース）
2. DevTools → Network タブの失敗したリクエスト
3. `import.meta.env.BASE_URL` の値
4. 使用しているブラウザ＆バージョン
5. 使用しているOS

---

**Happy Debugging! 🐛🔧**
