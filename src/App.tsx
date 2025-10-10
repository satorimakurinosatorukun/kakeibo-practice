/**
 * メインアプリコンポーネント
 */
import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useSettingsStore } from './store';

function App() {
  const { settings } = useSettingsStore();

  // ダークモードの初期化
  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  return (
    <Layout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>健康家計アプリ（React + TypeScript版）</h1>
        <p>移行作業中...</p>
      </div>
    </Layout>
  );
}

export default App;
