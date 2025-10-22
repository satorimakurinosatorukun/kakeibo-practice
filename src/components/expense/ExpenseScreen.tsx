/**
 * 家計簿画面コンポーネント
 */
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import { MdAttachMoney, MdCalendarToday, MdAdd, MdAnalytics } from 'react-icons/md';
import { useSettingsStore } from '../../store';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { ExpenseChart } from './ExpenseChart';
import { CategoryAnalysis } from './CategoryAnalysis';
import { BudgetTracker } from './BudgetTracker';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ja', ja);

export const ExpenseScreen: React.FC = () => {
  const { settings } = useSettingsStore();
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [showForm, setShowForm] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  useEffect(() => {
    setMonthlyBudget(settings.monthlyBudget);
  }, [settings.monthlyBudget]);

  const handleBudgetChange = (newBudget: number) => {
    setMonthlyBudget(newBudget);
  };

  const handleToday = () => {
    setSelectedDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  };

  return (
    <div>
      {/* カレンダーから日付選択 */}
      <div className="card" style={{ marginBottom: '8px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdCalendarToday size={16} />
            期間選択
          </label>
        </div>

        {/* カレンダーピッカー */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date || new Date())}
            dateFormat="yyyy年 M月"
            showMonthYearPicker
            locale="ja"
            inline
            calendarClassName="calendar-picker"
          />
        </div>

        {/* 現在の選択日付表示 */}
        <div
          style={{
            textAlign: 'center',
            padding: '12px',
            background: 'var(--background)',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          {year}年 {String(month).padStart(2, '0')}月
        </div>

        <button
          onClick={handleToday}
          className="btn-secondary"
          style={{ width: '100%', margin: 0, padding: '10px', fontSize: '12px' }}
        >
          今月に戻す
        </button>
      </div>

      {/* 支出入力ボタン */}
      <div style={{ marginBottom: '8px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: 0,
          }}
        >
          <MdAdd size={20} />
          支出を追加
        </button>
      </div>

      {/* 支出入力フォーム */}
      {showForm && (
        <div className="card" style={{ marginBottom: '8px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdAttachMoney size={18} />
            <h3 style={{ margin: 0 }}>支出を追加</h3>
          </div>
          <ExpenseForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* 予算トラッキング */}
      <BudgetTracker
        year={year}
        month={month}
        monthlyBudget={monthlyBudget}
        onBudgetChange={handleBudgetChange}
      />

      {/* グラフ */}
      <ExpenseChart />

      {/* カテゴリ別分析 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginTop: '16px', marginBottom: '8px' }}>
        <MdAnalytics size={20} style={{ color: 'var(--primary)' }} />
        <h2 style={{ margin: 0, padding: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
          分析
        </h2>
      </div>
      <CategoryAnalysis year={year} month={month} />

      {/* 支出一覧 */}
      <ExpenseList year={year} month={month} />

      {/* スペーサー */}
      <div style={{ height: '20px' }} />

      <style>{`
        .calendar-picker {
          width: 100%;
          font-family: inherit;
        }

        .react-datepicker {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 12px;
          font-size: 13px;
        }

        .react-datepicker__month-container {
          float: none;
        }

        .react-datepicker__header {
          background: var(--primary);
          border-radius: 6px;
          border: none;
          padding: 12px;
          margin-bottom: 12px;
        }

        .react-datepicker__current-month,
        .react-datepicker__month-year {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .react-datepicker__day-name {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 12px;
          width: 32px;
          height: 32px;
          line-height: 32px;
        }

        .react-datepicker__day {
          width: 32px;
          height: 32px;
          line-height: 32px;
          color: var(--text);
          border-radius: 4px;
          margin: 2px;
        }

        .react-datepicker__day:hover {
          background: var(--primary);
          color: white;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: var(--primary);
          color: white;
          border-radius: 4px;
        }

        .react-datepicker__day--today {
          font-weight: 600;
          border: 2px solid var(--primary);
        }

        .react-datepicker__day--outside-month {
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .react-datepicker__navigation {
          top: 16px;
          line-height: 16px;
          border: none;
          color: white;
        }

        .react-datepicker__navigation--previous {
          left: 16px;
        }

        .react-datepicker__navigation--next {
          right: 16px;
        }

        body.dark-mode .react-datepicker {
          background: var(--card);
          border-color: var(--border);
        }

        body.dark-mode .react-datepicker__header {
          background: var(--primary);
        }

        body.dark-mode .react-datepicker__day {
          color: var(--text);
        }

        body.dark-mode .react-datepicker__day-name {
          color: var(--text-secondary);
        }

        body.dark-mode .react-datepicker__day--outside-month {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
