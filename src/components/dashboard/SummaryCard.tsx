/**
 * サマリーカードコンポーネント
 */
import React, { useMemo } from 'react';
import { useIntakeStore, useExpenseStore } from '../../store';

export const SummaryCard: React.FC = () => {
  const { getTotalCaloriesByDate } = useIntakeStore();
  const { getTotalByMonth } = useExpenseStore();

  // 今日のカロリー
  const todayCalories = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return getTotalCaloriesByDate(today);
  }, [getTotalCaloriesByDate]);

  // 今月の支出
  const monthExpense = useMemo(() => {
    const now = new Date();
    return getTotalByMonth(now.getFullYear(), now.getMonth() + 1);
  }, [getTotalByMonth]);

  return (
    <div className="summary-box">
      <div className="summary-row">
        <span className="summary-label">今日のカロリー</span>
        <span className="summary-value">{todayCalories} kcal</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">今月の支出</span>
        <span className="summary-value positive">¥{monthExpense.toLocaleString()}</span>
      </div>
    </div>
  );
};
