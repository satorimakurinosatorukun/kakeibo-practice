/**
 * 在庫一覧表示コンポーネント
 */
import React from 'react';
import { useStockStore } from '../../store';

export const StockList: React.FC = () => {
  const { stocks, deleteStock } = useStockStore();

  const handleDelete = (id: string) => {
    if (confirm('この在庫を削除しますか？')) {
      deleteStock(id);
    }
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return '#ef4444'; // 赤
    if (daysRemaining <= 1) return '#f59e0b'; // オレンジ
    if (daysRemaining <= 3) return '#eab308'; // 黄色
    return '#10b981'; // 緑
  };

  const getStatusLabel = (daysRemaining: number) => {
    if (daysRemaining <= 0) return '期限切れ！';
    if (daysRemaining === 1) return '明日期限';
    return `残り${daysRemaining}日`;
  };

  return (
    <div className="card">
      <h3>在庫一覧</h3>
      {stocks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          在庫がありません
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {stocks.map((stock) => (
            <li
              key={stock.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                  {stock.name}
                  {stock.quantity > 1 && (
                    <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '8px' }}>
                      x{stock.quantity}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: getStatusColor(stock.daysRemaining),
                    fontWeight: 600,
                  }}
                >
                  {getStatusLabel(stock.daysRemaining)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(stock.id)}
                className="delete-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
