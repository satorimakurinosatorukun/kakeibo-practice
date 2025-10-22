# 健康家計アプリ (React版) 🥗💰

**AIが健康をサポートする、シームレスな生活管理アプリ**

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://haradakouta.github.io/life-pwa-react/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🌟 特徴

### 🔗 シームレスな機能連携
- **バーコードスキャン → 在庫管理** - スキャンしたら自動で在庫画面へ
- **買い物リスト → 在庫管理** - チェックした商品を一括で在庫に追加
- **在庫管理 → 買い物リスト** - 各アイテムからワンタップで買い物リストへ
- **期限切れ間近 → 買い物リスト** - 期限切れ間近の商品を一括追加

### 🤖 AI健康アドバイザー
- **自動健康チェック** - 不健康な商品を12カテゴリ・80以上のキーワードで検出
- **代替案の提案** - より健康的な選択肢を3〜4個提案
- **Gemini API統合** - 詳細なパーソナライズ分析（オプション）
- **押し付けない設計** - ユーザーが自分で選択できる

### 📱 モダンなUI/UX
- **React Icons** - 統一されたアイコンシステム
- **カードシャドウ** - 奥行きのあるデザイン
- **ホバーエフェクト** - スムーズなアニメーション
- **ダークモード** - 目に優しい夜間モード
- **レスポンシブ** - スマホ・タブレット対応

### 🔧 全9画面の完全機能
1. **ダッシュボード** - 今日のサマリー表示
2. **食事記録** - カロリー・支出管理
3. **在庫管理** - 賞味期限アラート
4. **買い物リスト** - チェック機能付き
5. **AIレシピ** - Gemini APIでレシピ生成
6. **バーコードスキャン** - ZXingで商品情報取得
7. **レポート** - グラフで可視化
8. **設定** - トグルスイッチUI
9. **PWA対応** - オフライン動作

---

## 🚀 デモ

**GitHub Pages:** https://haradakouta.github.io/life-pwa-react/

---

## 📸 スクリーンショット

### シームレスな機能連携
- バーコードスキャン後に自動で在庫画面へ遷移
- 買い物リストから在庫への一括追加（グラデーションカードで強調）
- 在庫アイテムから買い物リストへワンタップ追加

### AI健康アドバイザー
- 「ポテトチップス」→「素焼きアーモンド、焼き野菜チップス」を提案
- 「コーラ」→「炭酸水、無糖の紅茶」を提案
- カテゴリ別の健康懸念と代替案を表示

---

## 🛠️ 技術スタック

### フロントエンド
- **React 19** - 最新のReact
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Zustand** - 軽量な状態管理
- **Recharts** - データ可視化
- **React Icons** - アイコンライブラリ

### 外部API
- **Google Gemini API** (Gemini 2.0 Flash) - AIレシピ生成・健康分析
- **楽天市場商品検索API** - バーコードスキャン
- **楽天商品検索API** - バーコードスキャン
- **JAN Code Lookup API** - バーコードスキャン
- **Open Food Facts API** - バーコードスキャン

### PWA
- **Service Worker** - オフライン動作
- **Web App Manifest** - ホーム画面追加

### その他
- **@zxing/library** - バーコードスキャン
- **localStorage** - データ永続化

---

## 📦 セットアップ

### 1. クローン

```bash
git clone https://github.com/Haradakouta/life-pwa-react.git
cd life-pwa-react
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

`.env`を編集：

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
VITE_RAKUTEN_APP_ID=YOUR_RAKUTEN_APP_ID_HERE
VITE_JANCODE_APP_ID=YOUR_JANCODE_APP_ID_HERE
```

### 4. 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:5173

---

## 🏗️ ビルド

### プロダクションビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

→ http://localhost:4173

### GitHub Pages デプロイ

```bash
npm run deploy
```

---

## 📂 プロジェクト構成

```
life-pwa-react/
├── public/
│   ├── icon-192.png           # PWAアイコン
│   ├── icon-512.png
│   ├── manifest.webmanifest   # PWAマニフェスト
│   └── sw.js                  # Service Worker
│
├── src/
│   ├── api/
│   │   ├── gemini.ts          # Gemini API
│   │   └── rakuten.ts         # 商品検索API
│   │
│   ├── components/
│   │   ├── layout/            # レイアウト
│   │   ├── dashboard/         # ダッシュボード
│   │   ├── meals/             # 食事記録
│   │   ├── settings/          # 設定
│   │   ├── stock/             # 在庫管理
│   │   ├── shopping/          # 買い物リスト
│   │   ├── recipe/            # AIレシピ
│   │   ├── barcode/           # バーコードスキャン
│   │   └── report/            # レポート
│   │
│   ├── store/
│   │   ├── useIntakeStore.ts  # 食事記録ストア
│   │   ├── useStockStore.ts   # 在庫ストア
│   │   ├── useShoppingStore.ts # 買い物リストストア
│   │   ├── useRecipeStore.ts  # レシピストア
│   │   └── useSettingsStore.ts # 設定ストア
│   │
│   ├── types/                 # TypeScript型定義
│   ├── utils/
│   │   └── healthAdvisor.ts   # AI健康アドバイザー
│   │
│   ├── styles/
│   │   └── global.css         # グローバルスタイル
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── vite.config.ts
├── package.json
├── CLAUDE.md                  # 開発メモ
└── README.md                  # このファイル
```

---

## 🎨 主要機能

### 1. シームレスな機能連携

#### バーコードスキャン → 在庫管理
```tsx
// バーコードスキャン後、自動で在庫画面に遷移
<BarcodeScreen onNavigateToStock={() => setCurrentScreen('stock')} />
```

#### 買い物リスト → 在庫管理（目玉機能）
- グラデーションカードで強調表示
- 「買い物完了後はこちら！」のキャッチコピー
- チェック済みアイテム数をリアルタイム表示
- 成功メッセージをスライドイン（3秒後に消える）

#### 在庫管理 → 買い物リスト
- 各アイテムに🛒ボタンを表示
- ワンタップで買い物リストに追加

### 2. AI健康アドバイザー

#### ハイブリッドアプローチ
- **クライアント側チェック** - 即座に警告（APIコスト0）
- **Gemini API分析** - 詳細なパーソナライズ提案（オプション）

#### 検出カテゴリ（12種類）
1. スナック菓子（ポテトチップス等）
2. 清涼飲料水（コーラ、サイダー等）
3. インスタント食品（カップラーメン等）
4. チョコレート菓子
5. 揚げ物（唐揚げ、フライドチキン等）
6. ファストフード
7. アイスクリーム
8. 洋菓子
9. 加工肉（ベーコン、ソーセージ等）
10. エナジードリンク
11. 缶詰（シロップ漬け）
12. 高脂質調味料

#### 使用例
```tsx
// 買い物リストに「ポテトチップス」を追加しようとすると...
→ 健康アドバイスモーダルが表示
→ 代替案: 素焼きアーモンド、無塩ミックスナッツ、焼き野菜チップス
→ ユーザーが選択: 代替案 or このまま追加
```

---

## 🔧 開発ガイド

### コーディング規約

#### CSS変数を使用
```tsx
// ❌ ダメな例
style={{ background: 'white', color: '#333' }}

// ✅ 良い例
style={{ background: 'var(--card)', color: 'var(--text)' }}
```

#### Optional Chainingを使用
```tsx
// ❌ ダメな例
recipe.ingredients.slice(0, 3)

// ✅ 良い例
recipe.ingredients && recipe.ingredients.slice(0, 3)
```

### デバッグ

#### Service Workerのクリア
```javascript
// DevTools Console
await caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))));
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
location.reload();
```

#### localStorageのクリア
```javascript
localStorage.clear();
location.reload();
```

---

## 📝 ライセンス

このプロジェクトは個人学習用です。

---

## 🤝 コントリビューション

このプロジェクトは[Claude Code](https://claude.com/claude-code)で開発されています。

詳細な開発履歴は[CLAUDE.md](./CLAUDE.md)を参照してください。

---

## 📚 参考資料

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Recharts Documentation](https://recharts.org/)
- [Google Gemini API](https://ai.google.dev/)

---

## 🎯 今後の予定

- [ ] パフォーマンス最適化（バンドルサイズ削減）
- [ ] ページ遷移アニメーション
- [ ] E2Eテスト追加
- [ ] アクセシビリティ向上
- [ ] PWA通知機能

---

**Happy Coding! 🚀**

Made with ❤️ by Claude Code
