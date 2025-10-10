/**
 * Dashboard画面コンポーネント
 */
import React from 'react';
import { SummaryCard } from './SummaryCard';
import { QuickActions } from './QuickActions';
import { Screen } from '../layout/BottomNav';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <section className="screen active">
      <h2>ホーム</h2>
      <SummaryCard />
      <QuickActions onNavigate={onNavigate} />
    </section>
  );
};
