import React, { useState } from 'react'
import { MdSave, MdCancel, MdCategory, MdAttachMoney, MdNotes } from 'react-icons/md'
import { useExpenseStore } from '../../store'
import type { ExpenseCategory } from '../../types/expense'
import { EXPENSE_CATEGORIES } from '../../types/expense'

interface Props {
  onClose?: () => void
}

export const ExpenseForm: React.FC<Props> = ({ onClose }) => {
  const { addExpense } = useExpenseStore()
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      alert('金額を入力してください')
      return
    }

    addExpense({
      category,
      amount: Number(amount),
      memo: memo || undefined,
    })

    // リセット
    setAmount('')
    setMemo('')
    setCategory('food')

    // 親コンポーネントに通知
    onClose?.()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MdCategory size={14} />
            カテゴリ
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {(Object.entries(EXPENSE_CATEGORIES) as Array<[ExpenseCategory, { label: string }]>).map(
              ([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MdAttachMoney size={14} />
            金額 (¥)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            step="100"
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MdNotes size={14} />
            メモ（任意）
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例：ランチ、給料 など"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MdSave size={16} />
          支出を追加
        </button>
        {onClose && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <MdCancel size={16} />
            キャンセル
          </button>
        )}
      </form>
    </div>
  )
}
