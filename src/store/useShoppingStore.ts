/**
 * 買い物リストストア（Zustand）
 */
import { create } from 'zustand';
import { ShoppingItem, ShoppingFormData, ShoppingCategory } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface ShoppingStore {
  items: ShoppingItem[];
  addItem: (data: ShoppingFormData) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCompleted: () => void;
  addWeeklyEssentials: () => void;
  addLowStockItems: (stockItems: Array<{ name: string; category?: ShoppingCategory }>) => void;
}

const WEEKLY_ESSENTIALS: Array<{ name: string; quantity: number; category: ShoppingCategory }> = [
  { name: '米', quantity: 1, category: 'staple' },
  { name: '卵', quantity: 10, category: 'protein' },
  { name: '牛乳', quantity: 1, category: 'dairy' },
  { name: 'パン', quantity: 1, category: 'staple' },
  { name: '鶏肉', quantity: 1, category: 'protein' },
  { name: '豚肉', quantity: 1, category: 'protein' },
  { name: '玉ねぎ', quantity: 3, category: 'vegetable' },
  { name: 'にんじん', quantity: 3, category: 'vegetable' },
  { name: 'じゃがいも', quantity: 3, category: 'vegetable' },
  { name: 'トマト', quantity: 3, category: 'vegetable' },
  { name: 'バナナ', quantity: 1, category: 'fruit' },
  { name: 'ヨーグルト', quantity: 1, category: 'dairy' },
  { name: '醤油', quantity: 1, category: 'seasoning' },
  { name: '塩', quantity: 1, category: 'seasoning' },
];

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  items: getFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING, []),

  addItem: (data) =>
    set((state) => {
      // 重複チェック
      const exists = state.items.find((item) => item.name === data.name && !item.checked);
      if (exists) {
        return state;
      }

      const newItem: ShoppingItem = {
        id: generateUUID(),
        ...data,
        checked: false,
        createdAt: new Date().toISOString(),
      };
      const newItems = [...state.items, newItem];
      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),

  toggleItem: (id) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked, updatedAt: new Date().toISOString() }
          : item
      );
      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),

  deleteItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),

  clearCompleted: () =>
    set((state) => {
      const newItems = state.items.filter((item) => !item.checked);
      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),

  addWeeklyEssentials: () =>
    set((state) => {
      const currentItems = state.items;
      const newItems = [...currentItems];

      WEEKLY_ESSENTIALS.forEach((essential) => {
        // 重複チェック
        const exists = currentItems.find(
          (item) => item.name === essential.name && !item.checked
        );
        if (!exists) {
          newItems.push({
            id: generateUUID(),
            name: essential.name,
            quantity: essential.quantity,
            category: essential.category,
            checked: false,
            createdAt: new Date().toISOString(),
          });
        }
      });

      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),

  addLowStockItems: (stockItems) =>
    set((state) => {
      const currentItems = state.items;
      const newItems = [...currentItems];

      stockItems.forEach((stock) => {
        // 重複チェック
        const exists = currentItems.find((item) => item.name === stock.name && !item.checked);
        if (!exists) {
          newItems.push({
            id: generateUUID(),
            name: stock.name,
            quantity: 1,
            category: stock.category,
            checked: false,
            createdAt: new Date().toISOString(),
          });
        }
      });

      saveToStorage(STORAGE_KEYS.SHOPPING, newItems);
      return { items: newItems };
    }),
}));
