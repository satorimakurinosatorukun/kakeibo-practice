import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Expense, ExpenseCategory, ExpenseFormData } from '../types'
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage'

interface ExpenseStore {
  expenses: Expense[]
  addExpense: (data: ExpenseFormData) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, data: Partial<ExpenseFormData>) => void
  getExpensesByMonth: (year: number, month: number) => Expense[]
  getTotalByMonth: (year: number, month: number) => number
  getTotalByCategory: (category: ExpenseCategory, year: number, month: number) => number
  getAllExpensesByCategory: (year: number, month: number) => Record<ExpenseCategory, number>
  getExpensesByCategory: (category: ExpenseCategory) => Expense[]
  clearExpenses: () => void
}

const defaultExpenses: Expense[] = []

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: getFromStorage(STORAGE_KEYS.EXPENSES, defaultExpenses),

  addExpense: (data) => {
    const now = new Date().toISOString()
    const newExpense: Expense = {
      id: uuidv4(),
      category: data.category,
      amount: data.amount,
      date: new Date().toISOString().split('T')[0],
      memo: data.memo,
      createdAt: now,
    }
    set((state) => {
      const updated = [...state.expenses, newExpense]
      saveToStorage(STORAGE_KEYS.EXPENSES, updated)
      return { expenses: updated }
    })
  },

  deleteExpense: (id) => {
    set((state) => {
      const updated = state.expenses.filter((e) => e.id !== id)
      saveToStorage(STORAGE_KEYS.EXPENSES, updated)
      return { expenses: updated }
    })
  },

  updateExpense: (id, data) => {
    set((state) => {
      const updated = state.expenses.map((e) =>
        e.id === id
          ? {
              ...e,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : e
      )
      saveToStorage(STORAGE_KEYS.EXPENSES, updated)
      return { expenses: updated }
    })
  },

  getExpensesByMonth: (year, month) => {
    return get().expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getFullYear() === year && date.getMonth() + 1 === month
    })
  },

  getTotalByMonth: (year, month) => {
    return get()
      .getExpensesByMonth(year, month)
      .reduce((sum, expense) => sum + expense.amount, 0)
  },

  getTotalByCategory: (category, year, month) => {
    return get()
      .getExpensesByMonth(year, month)
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
  },

  getAllExpensesByCategory: (year, month) => {
    const expenses = get().getExpensesByMonth(year, month)
    const result: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      health: 0,
      other: 0,
    }
    expenses.forEach((e) => {
      result[e.category] += e.amount
    })
    return result
  },

  getExpensesByCategory: (category) => {
    return get().expenses.filter((e) => e.category === category)
  },

  clearExpenses: () => {
    set(() => {
      saveToStorage(STORAGE_KEYS.EXPENSES, [])
      return { expenses: [] }
    })
  },
}))
