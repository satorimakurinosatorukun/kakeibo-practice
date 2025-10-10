/**
 * 在庫入力フォームコンポーネント
 */
import React, { useState } from 'react';
import { useStockStore } from '../../store';

export const StockForm: React.FC = () => {
  const { addStock } = useStockStore();
  const [name, setName] = useState('');
  const [daysRemaining, setDaysRemaining] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = () => {
    if (!name || !daysRemaining) {
      alert('品目名と残り日数を入力してください');
      return;
    }

    addStock({
      name,
      daysRemaining: Number(daysRemaining),
      quantity: Number(quantity),
    });

    // フォームをリセット
    setName('');
    setDaysRemaining('');
    setQuantity('1');

    alert('在庫を追加しました！');
  };

  return (
    <div className="card">
      <h3>手動で追加</h3>
      <label>品目</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 牛乳"
      />
      <label>残り日数</label>
      <input
        type="number"
        value={daysRemaining}
        onChange={(e) => setDaysRemaining(e.target.value)}
        placeholder="例: 3"
      />
      <label>数量</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="1"
      />
      <button className="submit" onClick={handleSubmit}>
        在庫に登録
      </button>
    </div>
  );
};
