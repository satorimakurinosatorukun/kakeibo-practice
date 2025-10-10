/**
 * 買い物リスト表示コンポーネント
 */
import React from 'react';
import { useShoppingStore } from '../../store';

export const ShoppingList: React.FC = () => {
  const { items, toggleItem, deleteItem, clearCompleted } = useShoppingStore();

  const handleClear = () => {
    if (confirm('チェック済みのアイテムをすべて削除しますか？')) {
      clearCompleted();
    }
  };

  return (
    <div className="card">
      <h3>買い物リスト</h3>
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          リストが空です
        </p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        textDecoration: item.checked ? 'line-through' : 'none',
                        color: item.checked ? '#999' : 'inherit',
                      }}
                    >
                      {item.name}
                      {item.quantity > 1 && (
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            marginLeft: '8px',
                          }}
                        >
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
                <button
                  onClick={() => deleteItem(item.id)}
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
          {items.some((item) => item.checked) && (
            <button
              className="submit"
              onClick={handleClear}
              style={{ background: '#ef4444', marginTop: '12px' }}
            >
              チェック済みをクリア
            </button>
          )}
        </>
      )}
    </div>
  );
};
