/**
 * 買い物リストアクションコンポーネント（1週間分生成、低在庫追加）
 */
import React from 'react';
import { useShoppingStore, useStockStore } from '../../store';

export const ShoppingActions: React.FC = () => {
  const { addWeeklyEssentials, addLowStockItems } = useShoppingStore();
  const { getExpiringStocks } = useStockStore();

  const handleWeeklyList = () => {
    addWeeklyEssentials();
    alert('1週間分の買い物リストを追加しました！');
  };

  const handleLowStock = () => {
    const lowStockItems = getExpiringStocks(2); // 残り2日以下
    if (lowStockItems.length === 0) {
      alert('在庫が少ない商品はありません');
      return;
    }

    addLowStockItems(
      lowStockItems.map((item) => ({
        name: item.name,
        category: item.category,
      }))
    );
    alert(`${lowStockItems.length}件の商品を追加しました！`);
  };

  return (
    <div className="card">
      <h3>🔰 初心者向けサポート</h3>
      <button
        className="submit"
        onClick={handleWeeklyList}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          marginBottom: '8px',
        }}
      >
        📅 1週間分の買い物リストを生成
      </button>
      <button
        className="submit"
        onClick={handleLowStock}
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
      >
        ⚠️ 在庫が少ない商品を追加
      </button>
    </div>
  );
};
