/**
 * 期限切れアラートコンポーネント
 */
import React, { useMemo } from 'react';
import { useStockStore } from '../../store';

export const ExpiringAlert: React.FC = () => {
  const { getExpiringStocks } = useStockStore();

  // 今日期限切れ（残り0日）
  const expiredToday = useMemo(() => getExpiringStocks(0), [getExpiringStocks]);

  // 明日期限切れ（残り1日）
  const expireTomorrow = useMemo(() => getExpiringStocks(1), [getExpiringStocks]);

  if (expiredToday.length === 0 && expireTomorrow.length === 0) {
    return null;
  }

  return (
    <>
      {expiredToday.length > 0 && (
        <div
          className="card"
          style={{
            background: '#fee2e2',
            borderLeft: '4px solid #ef4444',
            color: '#991b1b',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>
            🚨 今日使うべき食材
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {expiredToday.map((stock) => (
              <li key={stock.id}>{stock.name}</li>
            ))}
          </ul>
        </div>
      )}

      {expireTomorrow.length > 0 && (
        <div
          className="card"
          style={{
            background: '#fef3c7',
            borderLeft: '4px solid #f59e0b',
            color: '#92400e',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>
            ⏰ 明日期限切れ
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {expireTomorrow.map((stock) => (
              <li key={stock.id}>{stock.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
