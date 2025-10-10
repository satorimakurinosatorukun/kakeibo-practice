/**
 * レイアウトコンポーネント
 */
import React, { useState } from 'react';
import { Header } from './Header';
import { BottomNav, Screen } from './BottomNav';
import { Dashboard } from '../dashboard/Dashboard';
import { MealsScreen } from '../meals/MealsScreen';

export const Layout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const getScreenTitle = (screen: Screen): string => {
    const titles: Record<Screen, string> = {
      home: '健康家計アプリ',
      meals: '食事記録',
      barcode: 'バーコードスキャン',
      report: 'レポート',
      settings: '設定',
    };
    return titles[screen];
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'meals':
        return <MealsScreen />;
      case 'barcode':
        return (
          <section className="screen active">
            <h2>バーコードスキャン</h2>
            <p style={{ padding: '20px', textAlign: 'center' }}>実装中...</p>
          </section>
        );
      case 'report':
        return (
          <section className="screen active">
            <h2>レポート</h2>
            <p style={{ padding: '20px', textAlign: 'center' }}>実装中...</p>
          </section>
        );
      case 'settings':
        return (
          <section className="screen active">
            <h2>設定</h2>
            <p style={{ padding: '20px', textAlign: 'center' }}>実装中...</p>
          </section>
        );
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <>
      <Header title={getScreenTitle(currentScreen)} />
      <main>{renderScreen()}</main>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </>
  );
};
