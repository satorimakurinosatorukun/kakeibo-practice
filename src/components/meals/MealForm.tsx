/**
 * 食事入力フォームコンポーネント
 */
import React, { useState } from 'react';
import { useIntakeStore } from '../../store';

export const MealForm: React.FC = () => {
  const { addIntake } = useIntakeStore();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (!name || !calories || !price) {
      alert('すべての項目を入力してください');
      return;
    }

    addIntake({
      name,
      calories: Number(calories),
      price: Number(price),
    });

    // フォームをリセット
    setName('');
    setCalories('');
    setPrice('');

    alert('食事を記録しました！');
  };

  return (
    <div className="card">
      <label>食品名</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 牛乳"
      />
      <label>カロリー(kcal)</label>
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="200"
      />
      <label>金額(円)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="150"
      />
      <button className="submit" onClick={handleSubmit}>
        記録する
      </button>
    </div>
  );
};
