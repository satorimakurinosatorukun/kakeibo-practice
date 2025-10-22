/**
 * Receipt Scanning Screen
 * Main component for receipt OCR functionality
 */

import React, { useState } from 'react';
import { MdAttachMoney, MdReceipt } from 'react-icons/md';
import type { ReceiptItem } from '../../types';
import ReceiptScanner from './ReceiptScanner';
import ReceiptPreview from './ReceiptPreview';
import ReceiptHistory from './ReceiptHistory';
import './receipt.css';

type TabType = 'scan' | 'preview' | 'history';

interface ReceiptScreenProps {
  onNavigate?: (screen: string) => void;
}

const ReceiptScreen: React.FC<ReceiptScreenProps> = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('scan');
  const [scannedItems, setScannedItems] = useState<ReceiptItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [store, setStore] = useState<string>('');

  const handleReceiptScanned = (items: ReceiptItem[], total: number, storeName?: string) => {
    setScannedItems(items);
    setTotalPrice(total);
    setStore(storeName || '');
    setCurrentTab('preview');
  };

  const handleConfirmReceipt = () => {
    // Reset for next scan
    setScannedItems([]);
    setTotalPrice(0);
    setStore('');
    setCurrentTab('history');
  };

  return (
    <div className="receipt-screen">
      <div className="receipt-header">
        <h2>
          <MdReceipt className="icon" />
          レシート読み取り
        </h2>
      </div>

      <div className="receipt-tabs">
        <button
          className={`tab-btn ${currentTab === 'scan' ? 'active' : ''}`}
          onClick={() => setCurrentTab('scan')}
        >
          <MdReceipt /> スキャン
        </button>
        {scannedItems.length > 0 && (
          <button
            className={`tab-btn ${currentTab === 'preview' ? 'active' : ''}`}
            onClick={() => setCurrentTab('preview')}
          >
            <MdAttachMoney /> 確認
          </button>
        )}
        <button
          className={`tab-btn ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentTab('history')}
        >
          📋 履歴
        </button>
      </div>

      <div className="receipt-content">
        {currentTab === 'scan' && (
          <ReceiptScanner onReceiptScanned={handleReceiptScanned} />
        )}
        {currentTab === 'preview' && scannedItems.length > 0 && (
          <ReceiptPreview
            items={scannedItems}
            totalPrice={totalPrice}
            store={store}
            onConfirm={handleConfirmReceipt}
            onCancel={() => setCurrentTab('scan')}
          />
        )}
        {currentTab === 'history' && <ReceiptHistory />}
      </div>
    </div>
  );
};

export default ReceiptScreen;
