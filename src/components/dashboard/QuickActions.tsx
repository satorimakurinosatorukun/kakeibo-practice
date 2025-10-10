/**
 * クイックアクションコンポーネント（3x3グリッド）
 */
import React from 'react';
import { Screen } from '../layout/BottomNav';

interface QuickActionsProps {
  onNavigate: (screen: Screen) => void;
}

interface FunctionCard {
  screen?: Screen;
  icon: string;
  label: string;
  color: string;
  onClick?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const functionCards: FunctionCard[] = [
    {
      screen: 'meals',
      icon: '🍽️',
      label: '食事記録',
      color: '#3b82f6',
    },
    {
      screen: 'barcode',
      icon: '📸',
      label: 'スキャン',
      color: '#8b5cf6',
    },
    {
      icon: '💰',
      label: '家計簿',
      color: '#10b981',
      onClick: () => alert('家計簿画面（実装予定）'),
    },
    {
      icon: '📦',
      label: '在庫管理',
      color: '#f59e0b',
      onClick: () => alert('在庫管理画面（実装予定）'),
    },
    {
      icon: '🍳',
      label: 'AIレシピ',
      color: '#ef4444',
      onClick: () => alert('AIレシピ画面（実装予定）'),
    },
    {
      icon: '🛒',
      label: '買い物',
      color: '#06b6d4',
      onClick: () => alert('買い物リスト画面（実装予定）'),
    },
    {
      screen: 'report',
      icon: '📊',
      label: 'レポート',
      color: '#6366f1',
    },
    {
      screen: 'settings',
      icon: '⚙️',
      label: '設定',
      color: '#64748b',
    },
    {
      icon: 'ℹ️',
      label: 'ヘルプ',
      color: '#ec4899',
      onClick: () => window.open('https://github.com/Haradakouta/life-pwa', '_blank'),
    },
  ];

  const handleClick = (card: FunctionCard) => {
    if (card.onClick) {
      card.onClick();
    } else if (card.screen) {
      onNavigate(card.screen);
    }
  };

  return (
    <div className="function-grid">
      {functionCards.map((card, index) => (
        <button
          key={index}
          className="function-card"
          style={{ '--card-color': card.color } as React.CSSProperties}
          onClick={() => handleClick(card)}
        >
          <div className="function-icon">{card.icon}</div>
          <div className="function-label">{card.label}</div>
        </button>
      ))}
    </div>
  );
};
