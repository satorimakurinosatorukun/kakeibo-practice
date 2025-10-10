/**
 * 在庫ストア（Zustand）
 */
import { create } from 'zustand';
import { Stock, StockFormData } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface StockStore {
  stocks: Stock[];
  addStock: (data: StockFormData) => void;
  updateStock: (id: string, data: Partial<StockFormData>) => void;
  deleteStock: (id: string) => void;
  getExpiringStocks: (daysThreshold: number) => Stock[];
  getStockIngredients: () => string[];
}

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: getFromStorage<Stock[]>(STORAGE_KEYS.STOCKS, []),

  addStock: (data) =>
    set((state) => {
      const newStock: Stock = {
        id: generateUUID(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      const newStocks = [...state.stocks, newStock];
      saveToStorage(STORAGE_KEYS.STOCKS, newStocks);
      return { stocks: newStocks };
    }),

  updateStock: (id, data) =>
    set((state) => {
      const newStocks = state.stocks.map((stock) =>
        stock.id === id ? { ...stock, ...data, updatedAt: new Date().toISOString() } : stock
      );
      saveToStorage(STORAGE_KEYS.STOCKS, newStocks);
      return { stocks: newStocks };
    }),

  deleteStock: (id) =>
    set((state) => {
      const newStocks = state.stocks.filter((stock) => stock.id !== id);
      saveToStorage(STORAGE_KEYS.STOCKS, newStocks);
      return { stocks: newStocks };
    }),

  getExpiringStocks: (daysThreshold) => {
    const stocks = get().stocks;
    return stocks.filter((stock) => stock.daysRemaining <= daysThreshold);
  },

  getStockIngredients: () => {
    const stocks = get().stocks;
    return stocks.map((stock) => stock.name);
  },
}));
