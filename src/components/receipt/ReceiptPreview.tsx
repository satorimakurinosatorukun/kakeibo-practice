/**
 * Receipt Preview Component
 * Shows scanned items and allows editing before saving
 */

import React, { useState } from 'react';
import { MdDelete, MdSave, MdClose, MdAddCircle } from 'react-icons/md';
import { useReceiptStore, useExpenseStore } from '../../store';
import type { ReceiptItem } from '../../types';

interface ReceiptPreviewProps {
  items: ReceiptItem[];
  totalPrice: number;
  store?: string;
  onConfirm: (items: ReceiptItem[], total: number, store?: string) => void;
  onCancel: () => void;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  items: initialItems,
  totalPrice: initialTotal,
  store: initialStore,
  onConfirm,
  onCancel,
}) => {
  const [items, setItems] = useState<ReceiptItem[]>(initialItems);
  const [totalPrice, setTotalPrice] = useState<number>(initialTotal);
  const [store, setStore] = useState<string>(initialStore || '');
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const receiptStore = useReceiptStore();
  const expenseStore = useExpenseStore();

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotal);
  };

  const handleAddItem = () => {
    if (newItemName && newItemPrice) {
      const price = parseInt(newItemPrice, 10);
      if (price > 0) {
        const newItems = [
          ...items,
          {
            name: newItemName,
            price,
            quantity: 1,
            category: '食料品',
          },
        ];
        setItems(newItems);
        setTotalPrice(totalPrice + price);
        setNewItemName('');
        setNewItemPrice('');
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Save to receipt store
      receiptStore.addReceipt(items, totalPrice, store);

      // Also save to expense store
      expenseStore.addExpense({
        amount: totalPrice,
        category: 'food',
        memo: `${store || 'スーパー'}での買い物`,
      });

      // Notify parent
      onConfirm(items, totalPrice, store);
    } catch (error) {
      console.error('[ReceiptPreview] Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="receipt-preview">
      <div className="preview-card">
        <div className="preview-header">
          <h3>レシート内容確認</h3>
          <button className="close-btn" onClick={onCancel}>
            <MdClose />
          </button>
        </div>

        <div className="preview-store">
          <label>店舗名</label>
          <input
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="スーパーマーケット等..."
            className="store-input"
          />
        </div>

        <div className="items-list">
          <h4>商品一覧</h4>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-category">{item.category}</div>
              </div>
              <div className="item-price">
                ¥{item.price.toLocaleString()} × {item.quantity}
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteItem(index)}
                title="削除"
              >
                <MdDelete />
              </button>
            </div>
          ))}

          <div className="add-item-section">
            <div className="add-item-inputs">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="商品名"
                className="add-item-input"
              />
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="価格"
                className="add-item-input price"
              />
              <button
                className="add-item-btn"
                onClick={handleAddItem}
                disabled={!newItemName || !newItemPrice}
              >
                <MdAddCircle /> 追加
              </button>
            </div>
          </div>
        </div>

        <div className="total-section">
          <div className="total-row">
            <span>合計金額</span>
            <span className="total-price">¥{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="preview-actions">
          <button className="btn-cancel" onClick={onCancel}>
            キャンセル
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving || items.length === 0}
          >
            <MdSave /> {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
