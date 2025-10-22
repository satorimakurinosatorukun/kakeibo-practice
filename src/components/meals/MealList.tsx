/**
 * 食事一覧表示コンポーネント
 */
import React, { useMemo } from 'react';
import { useIntakeStore } from '../../store';
import { MdDelete } from 'react-icons/md';

export const MealList: React.FC = () => {
  const { intakes, deleteIntake, getTotalCaloriesByDate, getTotalPriceByDate } =
    useIntakeStore();

  // 今日の食事記録
  const todayIntakes = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return intakes.filter((intake) => intake.date.startsWith(today));
  }, [intakes]);

  // 今日の集計
  const today = new Date().toISOString().split('T')[0];
  const todayCalories = getTotalCaloriesByDate(today);
  const todayPrice = getTotalPriceByDate(today);

  const handleDelete = (id: string) => {
    if (confirm('この記録を削除しますか？')) {
      deleteIntake(id);
    }
  };

  return (
    <div className="card">
      <h3>今日の記録</h3>
      {todayIntakes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          まだ記録がありません
        </p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {todayIntakes.map((intake) => (
              <li
                key={intake.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>{intake.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {intake.calories} kcal · ¥{intake.price}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(intake.id)}
                  className="delete-btn"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                >
                  <MdDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'var(--card)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              <strong>合計カロリー:</strong> {todayCalories} kcal
            </span>
            <span>
              <strong>合計金額:</strong> ¥{todayPrice}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
