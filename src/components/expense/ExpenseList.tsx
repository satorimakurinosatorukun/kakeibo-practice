import React, { useMemo } from 'react'
import { useExpenseStore } from '../../store'
import { EXPENSE_CATEGORIES } from '../../types/expense'

interface Props {
  year: number
  month: number
}

export const ExpenseList: React.FC<Props> = ({ year, month }) => {
  const { expenses, deleteExpense, getExpensesByMonth } = useExpenseStore()

  const monthExpenses = useMemo(() => {
    return getExpensesByMonth(year, month).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [expenses, year, month, getExpensesByMonth])

  const totalAmount = useMemo(() => {
    return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [monthExpenses])

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍽️',
      transport: '🚗',
      utilities: '💡',
      entertainment: '🎬',
      health: '🏥',
      other: '📦',
    }
    return emojiMap[category] || '💰'
  }

  const getCategoryLabel = (category: string) => {
    const cat = EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]
    return cat?.label || category
  }

  if (monthExpenses.length === 0) {
    return (
      <div className="list-section">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-text">支出がありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-section">
      <div className="list-header">支出一覧</div>

      {monthExpenses.map((expense) => (
        <div key={expense.id} className="list-item">
          <div className="list-icon">{getCategoryEmoji(expense.category)}</div>
          <div className="list-content">
            <div className="list-title">{getCategoryLabel(expense.category)}</div>
            {expense.memo && <div className="list-subtitle">{expense.memo}</div>}
            <div className="list-subtitle">{expense.date}</div>
          </div>
          <div className="list-value">¥{expense.amount.toLocaleString()}</div>
          <button
            className="delete-btn"
            onClick={() => {
              if (confirm('この支出を削除しますか？')) {
                deleteExpense(expense.id)
              }
            }}
            title="削除"
          >
            ×
          </button>
        </div>
      ))}

      <div style={{ padding: '12px 16px', backgroundColor: 'var(--background)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>
            月計
          </span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary)' }}>
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
