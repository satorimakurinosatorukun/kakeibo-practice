import React, { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useExpenseStore } from '../../store'
import { EXPENSE_CATEGORIES } from '../../types/expense'

interface Props {
  year: number
  month: number
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']

export const CategoryAnalysis: React.FC<Props> = ({ year, month }) => {
  const { getAllExpensesByCategory } = useExpenseStore()

  const categoryData = useMemo(() => {
    const totals = getAllExpensesByCategory(year, month)
    return Object.entries(totals)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount], index) => ({
        name: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.label || category,
        value: amount,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [year, month, getAllExpensesByCategory])

  const totalAmount = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0)
  }, [categoryData])

  if (categoryData.length === 0) {
    return (
      <div className="card">
        <h3>📊 カテゴリ別分析</h3>
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)',
          }}
        >
          <p>データがありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>📊 カテゴリ別分析</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.name}: ¥${entry.value.toLocaleString()}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          詳細
        </h4>
        {categoryData.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < categoryData.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: '13px' }}>{item.name}</span>
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>¥{item.value.toLocaleString()}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                ({((item.value / totalAmount) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
