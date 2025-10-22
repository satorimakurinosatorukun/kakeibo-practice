/**
 * カロリー推移グラフコンポーネント
 */
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useIntakeStore } from '../../store';

export const CalorieChart: React.FC = () => {
  const { intakes } = useIntakeStore();

  const chartData = useMemo(() => {
    // 過去7日分のデータを作成
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayIntakes = intakes.filter((intake) =>
        intake.date.startsWith(dateStr)
      );

      const totalCalories = dayIntakes.reduce(
        (sum, intake) => sum + intake.calories,
        0
      );

      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        calories: totalCalories,
      });
    }

    return data;
  }, [intakes]);

  const hasData = chartData.some((d) => d.calories > 0);

  return (
    <div className="card">
      <h3>📈 週間カロリー推移</h3>

      {!hasData ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999',
          }}
        >
          <p>データがありません</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            食事記録を追加すると、カロリーの推移が表示されます
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="カロリー (kcal)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
