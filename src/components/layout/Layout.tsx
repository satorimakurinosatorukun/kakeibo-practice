/**
 * レイアウトコンポーネント
 */
import React, { useState } from 'react';
import { Header } from './Header';
import { BottomNav, Screen } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
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

  return (
    <>
      <Header title={getScreenTitle(currentScreen)} />
      <main>{children}</main>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </>
  );
};
