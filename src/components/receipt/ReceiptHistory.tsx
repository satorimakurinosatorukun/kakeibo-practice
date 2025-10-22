/**
 * Receipt History Component
 * Shows all scanned receipts
 */

import React, { useState } from 'react';
import { MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useReceiptStore } from '../../store';

const ReceiptHistory: React.FC = () => {
  const { receipts, deleteReceipt } = useReceiptStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedReceipts = [...receipts].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm('この取引を削除しますか?')) {
      deleteReceipt(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (receipts.length === 0) {
    return (
      <div className="receipt-history">
        <div className="empty-state">
          <p>📋 スキャンされたレシートがありません</p>
          <p>レシートをスキャンして記録を始めましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-history">
      <div className="history-summary">
        <p>
          合計取引数: <strong>{receipts.length}</strong>件
        </p>
        <p>
          合計金額: <strong>¥{receipts.reduce((sum: number, r: any) => sum + r.totalPrice, 0).toLocaleString()}</strong>
        </p>
      </div>

      <div className="history-list">
        {sortedReceipts.map((receipt: any) => (
          <div key={receipt.id} className="receipt-item">
            <div
              className="receipt-header-row"
              onClick={() =>
                setExpandedId(expandedId === receipt.id ? null : receipt.id)
              }
            >
              <div className="receipt-info">
                <div className="receipt-store">{receipt.store || '店舗名不明'}</div>
                <div className="receipt-date">{formatDate(receipt.date)}</div>
              </div>
              <div className="receipt-total">¥{receipt.totalPrice.toLocaleString()}</div>
              <button className="expand-btn">
                {expandedId === receipt.id ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            </div>

            {expandedId === receipt.id && (
              <div className="receipt-details">
                <div className="items-detail">
                  {receipt.items.map((item: any, index: number) => (
                    <div key={index} className="item-detail-row">
                      <span className="item-detail-name">{item.name}</span>
                      <span className="item-detail-price">
                        ¥{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="confidence-badge">
                  認識精度: {(receipt.confidence * 100).toFixed(0)}%
                </div>

                <button
                  className="delete-receipt-btn"
                  onClick={() => handleDelete(receipt.id)}
                >
                  <MdDelete /> 削除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptHistory;
