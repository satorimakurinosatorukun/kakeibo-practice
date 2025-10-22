import React, { useMemo, useState } from 'react'
import { MdEditNote, MdTrendingDown } from 'react-icons/md'
import { useExpenseStore } from '../../store'

interface Props {
  year: number
  month: number
  monthlyBudget: number
  onBudgetChange?: (newBudget: number) => void
}

export const BudgetTracker: React.FC<Props> = ({
  year,
  month,
  monthlyBudget,
  onBudgetChange,
}) => {
  const { getTotalByMonth } = useExpenseStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editBudget, setEditBudget] = useState(monthlyBudget.toString())

  const monthTotal = useMemo(() => {
    return getTotalByMonth(year, month)
  }, [year, month, getTotalByMonth])

  const remaining = monthlyBudget - monthTotal
  const percentage = monthlyBudget > 0 ? (monthTotal / monthlyBudget) * 100 : 0

  const getStatusColor = () => {
    if (percentage < 50) return '#10b981' // Green
    if (percentage < 80) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  const handleSaveBudget = () => {
    const newBudget = Number(editBudget)
    if (newBudget > 0) {
      onBudgetChange?.(newBudget)
      setIsEditing(false)
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdTrendingDown size={20} />
          <h3 style={{ margin: 0 }}>予算トラッキング</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MdEditNote size={16} />
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="number"
            value={editBudget}
            onChange={(e) => setEditBudget(e.target.value)}
            min="1"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSaveBudget}
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 16px', margin: 0 }}
          >
            保存
          </button>
          <button
            onClick={() => {
              setEditBudget(monthlyBudget.toString())
              setIsEditing(false)
            }}
            className="btn-secondary"
            style={{ width: 'auto', padding: '12px 16px', margin: 0 }}
          >
            キャンセル
          </button>
        </div>
      ) : null}

      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>予算</span>
          <span style={{ fontWeight: 600 }}>¥{monthlyBudget.toLocaleString()}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>支出</span>
          <span style={{ fontWeight: 600 }}>¥{monthTotal.toLocaleString()}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>残額</span>
          <span
            style={{
              fontWeight: 600,
              color: remaining >= 0 ? '#10b981' : '#ef4444',
            }}
          >
            ¥{remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* プログレスバー */}
      <div
        style={{
          height: '8px',
          background: 'var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            background: getStatusColor(),
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        {percentage.toFixed(1)}% 使用中
        {percentage > 100 && (
          <span style={{ color: '#ef4444', marginLeft: '4px' }}>
            (¥{Math.abs(remaining).toLocaleString()} 超過)
          </span>
        )}
      </div>
    </div>
  )
}
