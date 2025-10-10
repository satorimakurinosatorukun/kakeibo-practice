/**
 * 買い物リスト入力フォームコンポーネント
 */
import React, { useState } from 'react';
import { useShoppingStore } from '../../store';

export const ShoppingForm: React.FC = () => {
  const { addItem } = useShoppingStore();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = () => {
    if (!name) {
      alert('商品名を入力してください');
      return;
    }

    addItem({
      name,
      quantity: Number(quantity),
    });

    // フォームをリセット
    setName('');
    setQuantity('1');
  };

  return (
    <div className="card">
      <h3>手動で追加</h3>
      <label>商品名</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 牛乳"
      />
      <label>数量</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="1"
      />
      <button className="submit" onClick={handleSubmit}>
        リストに追加
      </button>
    </div>
  );
};
