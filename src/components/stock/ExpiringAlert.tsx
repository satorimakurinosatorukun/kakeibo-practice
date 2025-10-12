/**
 * 期限切れアラートコンポーネント
 */
import React, { useMemo } from 'react';
import { useStockStore, useShoppingStore } from '../../store';
import { MdShoppingCart } from 'react-icons/md';

export const ExpiringAlert: React.FC = () => {
  const { getExpiringStocks } = useStockStore();
  const { addItem } = useShoppingStore();

  // 今日期限切れ（残り0日）
  const expiredToday = useMemo(() => getExpiringStocks(0), [getExpiringStocks]);

  // 明日期限切れ（残り1日）
  const expireTomorrow = useMemo(() => getExpiringStocks(1), [getExpiringStocks]);

  const handleAddExpiringToShopping = () => {
    const expiringItems = [...expiredToday, ...expireTomorrow];
    if (expiringItems.length === 0) {
      return;
    }

    if (
      !confirm(
        `期限切れ間近の商品 ${expiringItems.length}個を買い物リストに追加しますか？`
      )
    ) {
      return;
    }

    expiringItems.forEach((stock) => {
      addItem({
        name: stock.name,
        quantity: stock.quantity,
      });
    });

    alert(`${expiringItems.length}個の商品を買い物リストに追加しました！`);
  };

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

      {/* 買い物リストに追加ボタン */}
      <div className="card" style={{ padding: '12px' }}>
        <button
          onClick={handleAddExpiringToShopping}
          className="submit"
          style={{
            background: '#3b82f6',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
          }}
        >
          <MdShoppingCart size={20} />
          期限切れ間近の商品を買い物リストに追加
        </button>
      </div>
    </>
  );
};
