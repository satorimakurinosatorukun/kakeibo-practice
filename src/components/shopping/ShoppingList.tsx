/**
 * 買い物リスト表示コンポーネント
 */
import React from 'react';
import { useShoppingStore, useStockStore } from '../../store';
import { MdDelete, MdInventory } from 'react-icons/md';

export const ShoppingList: React.FC = () => {
  const { items, toggleItem, deleteItem, clearCompleted } = useShoppingStore();
  const { addStock } = useStockStore();

  const handleClear = () => {
    if (confirm('チェック済みのアイテムをすべて削除しますか？')) {
      clearCompleted();
    }
  };

  const handleMoveToStock = () => {
    const checkedItems = items.filter((item) => item.checked);
    if (checkedItems.length === 0) {
      alert('チェック済みのアイテムがありません');
      return;
    }

    if (
      !confirm(
        `チェック済みのアイテム ${checkedItems.length}個を在庫に追加しますか？\n（賞味期限は7日後に設定されます）`
      )
    ) {
      return;
    }

    checkedItems.forEach((item) => {
      addStock({
        name: item.name,
        quantity: item.quantity,
        daysRemaining: 7,
      });
    });

    clearCompleted();
    alert(`${checkedItems.length}個のアイテムを在庫に追加しました！`);
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
                  <MdDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
          {items.some((item) => item.checked) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <button
                className="submit"
                onClick={handleMoveToStock}
                style={{
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <MdInventory size={18} />
                在庫に追加
              </button>
              <button
                className="submit"
                onClick={handleClear}
                style={{ background: '#ef4444' }}
              >
                クリア
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
