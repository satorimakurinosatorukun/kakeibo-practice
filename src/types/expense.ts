// Common types for kakeibo-practice

export type ExpenseCategory = 'food' | 'transport' | 'utilities' | 'entertainment' | 'health' | 'other'

export interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  date: string
  memo?: string
  createdAt: string
  updatedAt?: string
}

export interface ExpenseFormData {
  category: ExpenseCategory
  amount: number
  memo?: string
}

export interface ExpenseSummary {
  totalByMonth: number
  totalByCategory: Record<ExpenseCategory, number>
  lastUpdated: string
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; description: string }> = {
  food: { label: '食費', description: '食事・食材' },
  transport: { label: '交通費', description: '電車・バス・ガソリン' },
  utilities: { label: '光熱費', description: '電気・ガス・水道' },
  entertainment: { label: '娯楽', description: 'エンタメ・趣味' },
  health: { label: '医療', description: '病院・薬' },
  other: { label: 'その他', description: 'その他の支出' },
}
