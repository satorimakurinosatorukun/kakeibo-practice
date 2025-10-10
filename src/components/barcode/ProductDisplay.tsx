/**
 * スキャンした商品情報表示・追加コンポーネント
 */
import React, { useState } from 'react';
import { useIntakeStore, useStockStore } from '../../store';
import type { ProductInfo } from '../../types';

interface ProductDisplayProps {
  product: ProductInfo;
  onAdded: () => void;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({
  product,
  onAdded,
}) => {
  const { addIntake } = useIntakeStore();
  const { addStock } = useStockStore();

  const [calories, setCalories] = useState('');
  const [price, setPrice] = useState(product.price?.toString() || '');
  const [daysRemaining, setDaysRemaining] = useState('7');

  const handleAddToMeals = () => {
    if (!calories) {
      alert('カロリーを入力してください');
      return;
    }
    if (!price) {
      alert('金額を入力してください');
      return;
    }

    addIntake({
      name: product.name,
      calories: Number(calories),
      price: Number(price),
    });

    alert('食事記録に追加しました！');
    onAdded();
  };

  const handleAddToStock = () => {
    if (!daysRemaining) {
      alert('賞味期限までの日数を入力してください');
      return;
    }

    addStock({
      name: product.name,
      quantity: 1,
      daysRemaining: Number(daysRemaining),
      price: price ? Number(price) : undefined,
    });

    alert('在庫管理に追加しました！');
    onAdded();
  };

  return (
    <div className="card">
      <h3>✅ 商品情報を取得しました</h3>

      {/* 商品情報 */}
      <div
        style={{
          background: 'var(--background)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
            商品名
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
            {product.name}
          </div>
        </div>

        {product.manufacturer && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
              メーカー
            </div>
            <div style={{ fontWeight: 500 }}>{product.manufacturer}</div>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
            バーコード
          </div>
          <div style={{ fontFamily: 'monospace', color: '#666' }}>
            {product.barcode}
          </div>
        </div>

        {product.price && (
          <div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
              価格（参考）
            </div>
            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
              ¥{product.price.toLocaleString()}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: product.source === 'rakuten_ichiba' ? '#bf0000' :
                       product.source === 'rakuten_product' ? '#bf0000' :
                       product.source === 'jancode_lookup' ? '#3b82f6' : '#10b981',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'inline-block',
          }}
        >
          {product.source === 'rakuten_ichiba' && '楽天市場'}
          {product.source === 'rakuten_product' && '楽天商品検索'}
          {product.source === 'jancode_lookup' && 'JAN Code Lookup'}
          {product.source === 'openfoodfacts' && 'Open Food Facts'}
          {product.source === 'mock' && 'モックデータ'}
        </div>
      </div>

      {/* 食事記録に追加 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>
          🍽️ 食事記録に追加
        </h4>
        <label>カロリー (kcal)</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="例: 200"
        />
        <label>金額 (円)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="例: 150"
        />
        <button
          className="submit"
          onClick={handleAddToMeals}
          style={{ background: '#3b82f6' }}
        >
          食事記録に追加
        </button>
      </div>

      {/* 在庫管理に追加 */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>
          📦 在庫管理に追加
        </h4>
        <label>賞味期限までの日数</label>
        <input
          type="number"
          value={daysRemaining}
          onChange={(e) => setDaysRemaining(e.target.value)}
          placeholder="例: 7"
        />
        <button
          className="submit"
          onClick={handleAddToStock}
          style={{ background: '#10b981' }}
        >
          在庫管理に追加
        </button>
      </div>

      <button
        onClick={onAdded}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '12px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#666',
        }}
      >
        キャンセル
      </button>
    </div>
  );
};
