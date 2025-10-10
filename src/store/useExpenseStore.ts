/**
 * 支出ストア（Zustand）
 */
import { create } from 'zustand';
import type { Expense, ExpenseFormData, ExpenseCategory } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  getExpensesByMonth: (year: number, month: number) => Expense[];
  getTotalByMonth: (year: number, month: number) => number;
  getTotalByCategory: (category: ExpenseCategory, year: number, month: number) => number;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []),

  addExpense: (data) =>
    set((state) => {
      const newExpense: Expense = {
        id: generateUUID(),
        ...data,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const newExpenses = [...state.expenses, newExpense];
      saveToStorage(STORAGE_KEYS.EXPENSES, newExpenses);
      return { expenses: newExpenses };
    }),

  deleteExpense: (id) =>
    set((state) => {
      const newExpenses = state.expenses.filter((expense) => expense.id !== id);
      saveToStorage(STORAGE_KEYS.EXPENSES, newExpenses);
      return { expenses: newExpenses };
    }),

  getExpensesByMonth: (year, month) => {
    const expenses = get().expenses;
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  },

  getTotalByMonth: (year, month) => {
    const expenses = get().getExpensesByMonth(year, month);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  },

  getTotalByCategory: (category, year, month) => {
    const expenses = get().getExpensesByMonth(year, month);
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  },
}));
