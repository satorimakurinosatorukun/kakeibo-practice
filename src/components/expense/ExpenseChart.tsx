import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useExpenseStore } from '../../store'

export const ExpenseChart: React.FC = () => {
  const { expenses } = useExpenseStore()

  const chartData = useMemo(() => {
    // 過去6ヶ月分のデータを作成
    const today = new Date()
    const data = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() + 1 === month
        )
      })

      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      data.push({
        month: `${month}月`,
        amount: total,
      })
    }

    return data
  }, [expenses])

  const hasData = chartData.some((d) => d.amount > 0)

  return (
    <div className="card">
      <h3>💰 月間支出推移</h3>

      {!hasData ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)',
          }}
        >
          <p>データがありません</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            支出を追加すると、推移グラフが表示されます
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="var(--text-secondary)"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: `1px solid var(--border)`,
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              formatter={(value: number) => `¥${value.toLocaleString()}`}
            />
            <Bar
              dataKey="amount"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              name="支出額"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
