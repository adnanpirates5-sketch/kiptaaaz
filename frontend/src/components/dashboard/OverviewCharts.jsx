import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';

const OverviewCharts = ({ expenses = [], incomes = [] }) => {
  const { currency } = useCurrency();
  const { t } = useTranslation();

  // Last 7 days spending data
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      
      const dayExpenses = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === date.toDateString();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      const dayIncomes = incomes
        .filter(inc => {
          const incDate = new Date(inc.date);
          return incDate.toDateString() === date.toDateString();
        })
        .reduce((sum, inc) => sum + inc.amount, 0);

      data.push({
        date: dateStr,
        expense: dayExpenses,
        income: dayIncomes,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  return (
    <div className="section-card premium-card overview-charts" style={{ gridColumn: 'span 2' }}>
      <div className="section-header">
        <h3>{t('last7Days')}</h3>
      </div>
      <div className="chart-wrapper" style={{ height: '250px', padding: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              formatter={(value) => `${currency} ${value.toLocaleString()}`}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="var(--success)" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              strokeWidth={2}
              name="Income"
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="var(--danger)" 
              fillOpacity={1} 
              fill="url(#colorExpense)" 
              strokeWidth={2}
              name="Expense"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewCharts;
