/**
 * メインアプリコンポーネント
 */
import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useSettingsStore } from './store';

function App() {
  const { settings } = useSettingsStore();

  // ダークモードの初期化
  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  return <Layout />;
}

export default App;
