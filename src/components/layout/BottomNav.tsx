/**
 * ボトムナビゲーションコンポーネント
 */
import React from 'react';

export type Screen = 'home' | 'meals' | 'barcode' | 'report' | 'settings' | 'stock' | 'shopping' | 'recipe';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: Array<{ screen: Screen; icon: string; label: string }> = [
    { screen: 'home', icon: '🏠', label: 'ホーム' },
    { screen: 'meals', icon: '🍽️', label: '食事' },
    { screen: 'barcode', icon: '📸', label: 'スキャン' },
    { screen: 'report', icon: '📊', label: 'レポート' },
    { screen: 'settings', icon: '⚙️', label: '設定' },
  ];

  return (
    <nav id="bottomNav">
      {navItems.map((item) => (
        <button
          key={item.screen}
          className={`nav-item ${currentScreen === item.screen ? 'active' : ''}`}
          onClick={() => onNavigate(item.screen)}
        >
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
