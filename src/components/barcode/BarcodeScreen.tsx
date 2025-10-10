/**
 * バーコードスキャン画面コンポーネント
 */
import React, { useState } from 'react';
import { BarcodeScanner } from './BarcodeScanner';
import { ProductDisplay } from './ProductDisplay';
import type { ProductInfo } from '../../types';

export const BarcodeScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setScannedProduct(null);
  };

  const handleProductFound = (product: ProductInfo) => {
    setScannedProduct(product);
    setIsScanning(false);
  };

  const handleCloseScan = () => {
    setIsScanning(false);
  };

  const handleProductAdded = () => {
    setScannedProduct(null);
  };

  return (
    <section className="screen active">
      <h2>バーコードスキャン</h2>

      {!isScanning && !scannedProduct && (
        <div className="card">
          <h3>📱 バーコードをスキャン</h3>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            商品のバーコードをスキャンして、商品情報を自動で取得できます。
            <br />
            食事記録や在庫管理に簡単に追加できます。
          </p>
          <button className="submit" onClick={handleStartScan}>
            📷 スキャン開始
          </button>
        </div>
      )}

      {!isScanning && !scannedProduct && (
        <div className="card">
          <h3>💡 使い方</h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#666',
              lineHeight: '1.8',
            }}
          >
            <li style={{ marginBottom: '12px' }}>
              <strong>1.</strong> 「スキャン開始」ボタンをタップ
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>2.</strong> カメラが起動したら、バーコードを枠内に合わせる
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>3.</strong> 自動で商品情報を取得します
            </li>
            <li>
              <strong>4.</strong> 食事記録または在庫管理に追加
            </li>
          </ul>
        </div>
      )}

      {!isScanning && !scannedProduct && (
        <div className="card">
          <h3>🔍 対応API</h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#666',
              fontSize: '0.9rem',
            }}
          >
            <li style={{ marginBottom: '8px' }}>✅ 楽天市場商品検索API</li>
            <li style={{ marginBottom: '8px' }}>✅ 楽天商品検索API</li>
            <li style={{ marginBottom: '8px' }}>✅ JAN Code Lookup API</li>
            <li>✅ Open Food Facts API</li>
          </ul>
          <p
            style={{
              marginTop: '12px',
              fontSize: '0.85rem',
              color: '#999',
              fontStyle: 'italic',
            }}
          >
            ※ 4つのAPIを順番に試すため、日本の食品・飲料をほぼ完全にカバーしています
          </p>
        </div>
      )}

      {isScanning && (
        <BarcodeScanner
          onProductFound={handleProductFound}
          onClose={handleCloseScan}
        />
      )}

      {scannedProduct && (
        <ProductDisplay product={scannedProduct} onAdded={handleProductAdded} />
      )}
    </section>
  );
};
