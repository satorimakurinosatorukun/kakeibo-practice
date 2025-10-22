/**
 * Receipt Scanner Component
 * Handles image upload and OCR processing
 */

import React, { useRef, useState } from 'react';
import { MdCameraAlt, MdUploadFile, MdAutoAwesome } from 'react-icons/md';
import { scanReceipt } from '../../api/googleVision';
import type { ReceiptItem } from '../../types';

interface ReceiptScannerProps {
  onReceiptScanned: (items: ReceiptItem[], total: number, store?: string) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptScanned }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Scan receipt
      const result = await scanReceipt(file);
      console.log('[ReceiptScanner] Scan result:', result);

      if (result.items.length === 0) {
        setError(
          'レシート内容の読み取りに失敗しました。別の画像を試してください。'
        );
        setLoading(false);
        return;
      }

      onReceiptScanned(result.items, result.totalPrice, result.store);
    } catch (err) {
      console.error('[ReceiptScanner] Error:', err);
      setError('処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="receipt-scanner">
      <div className="scanner-card">
        <div className="scanner-icon">
          <MdCameraAlt />
        </div>
        <h3>レシートをスキャン</h3>
        <p>Google Cloud Vision APIを使用してレシート内容を自動読み取り</p>

        <div className="scanner-buttons">
          <button
            className="scanner-btn camera-btn"
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading}
          >
            <MdCameraAlt />
            カメラで撮影
          </button>

          <button
            className="scanner-btn file-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <MdUploadFile />
            ファイルを選択
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {loading && (
          <div className="scanner-loading">
            <div className="spinner"></div>
            <p>
              <MdAutoAwesome /> レシートを読み取り中...
            </p>
          </div>
        )}

        {error && <div className="scanner-error">{error}</div>}

        {preview && !loading && (
          <div className="scanner-preview">
            <h4>スキャン画像</h4>
            <img src={preview} alt="Receipt preview" />
          </div>
        )}

        <div className="scanner-tips">
          <h4>スキャンのコツ</h4>
          <ul>
            <li>レシート全体が画面に収まるようにしてください</li>
            <li>照明が十分にあることを確認してください</li>
            <li>レシートがクリアに見えるようにしてください</li>
            <li>手ぶれしないようにスキャンしてください</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
