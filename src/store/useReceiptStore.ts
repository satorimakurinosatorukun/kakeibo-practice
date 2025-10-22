/**
 * Receipt Store
 * Manages receipt scanning history and data
 */

import { create } from 'zustand';
import type { Receipt, ReceiptItem } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface ReceiptStore {
  // State
  receipts: Receipt[];

  // Actions
  addReceipt: (items: ReceiptItem[], totalPrice: number, store?: string) => void;
  deleteReceipt: (id: string) => void;
  getReceiptsByDateRange: (startDate: string, endDate: string) => Receipt[];
  getReceiptsByMonth: (yearMonth: string) => Receipt[];
  getTotalByMonth: (yearMonth: string) => number;
  getReceiptById: (id: string) => Receipt | undefined;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: getFromStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []),

  addReceipt: (items, totalPrice, store) => {
    set((state) => {
      const newReceipt: Receipt = {
        id: generateUUID(),
        items,
        totalPrice,
        store,
        date: new Date().toISOString(),
        confidence: 0.85,
        createdAt: new Date().toISOString(),
      };

      const newReceipts = [...state.receipts, newReceipt];
      saveToStorage(STORAGE_KEYS.RECEIPTS, newReceipts);
      return { receipts: newReceipts };
    });
  },

  deleteReceipt: (id) => {
    set((state) => {
      const newReceipts = state.receipts.filter((r) => r.id !== id);
      saveToStorage(STORAGE_KEYS.RECEIPTS, newReceipts);
      return { receipts: newReceipts };
    });
  },

  getReceiptsByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return get().receipts.filter((receipt) => {
      const receiptTime = new Date(receipt.date).getTime();
      return receiptTime >= start && receiptTime <= end;
    });
  },

  getReceiptsByMonth: (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    return get().receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.date);
      return (
        receiptDate.getFullYear() === parseInt(year, 10) &&
        receiptDate.getMonth() + 1 === parseInt(month, 10)
      );
    });
  },

  getTotalByMonth: (yearMonth) => {
    const receipts = get().getReceiptsByMonth(yearMonth);
    return receipts.reduce((sum, receipt) => sum + receipt.totalPrice, 0);
  },

  getReceiptById: (id) => {
    return get().receipts.find((r) => r.id === id);
  },
}));
