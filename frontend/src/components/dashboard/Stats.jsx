import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";
import "./Stats.css";

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color || entry.fill }}>
            {entry.name}: {currency} {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Stats = ({ incomes, expenses }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [merged, setMerged] = useState(false);

  // Prepare data for merged chart
  const allCategories = new Set([...incomes.map(i => i.category), ...expenses.map(e => e.category)]);
  const mergedData = Array.from(allCategories).map(cat => {
    const income = incomes.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);
    const expense = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { category: cat, income, expense, balance: income - expense };
  });

  // Prepare data for bar charts
  const expenseBarData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.category === exp.category);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({ category: exp.category, amount: exp.amount });
    }
    return acc;
  }, []);

  const incomeBarData = incomes.reduce((acc, inc) => {
    const existing = acc.find(item => item.category === inc.category);
    if (existing) {
      existing.amount += inc.amount;
    } else {
      acc.push({ category: inc.category, amount: inc.amount });
    }
    return acc;
  }, []);

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="stats-container-premium animate-fade-in">
      <div className="stats-header-premium">
        <div className="stats-title-group">
          <h2>{t('stats')}</h2>
          <p className="stats-subtitle">Visual overview of your financial performance</p>
        </div>
        <button
          className="premium-btn secondary"
          onClick={() => setMerged(!merged)}
          style={{ padding: '0.625rem 1.25rem' }}
        >
          {merged ? '📊 View Individual' : '📈 View Comparison'}
        </button>
      </div>

      <div className="stats-summary-grid">
        <div className="premium-card stat-metric-card income">
          <span className="metric-label">Total Income</span>
          <span className="metric-value">{currency} {totalIncome.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card expense">
          <span className="metric-label">Total Expenses</span>
          <span className="metric-value">{currency} {totalExpense.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card balance">
          <span className="metric-label">Net Balance</span>
          <span className="metric-value">{currency} {balance.toLocaleString()}</span>
        </div>
      </div>

      {merged ? (
        <div className="charts-main-grid">
          <div className="premium-card chart-card-premium full-width-chart">
            <div className="chart-card-header">
              <h4>Income vs Expenses by Category</h4>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend iconType="circle" />
                  <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="premium-card chart-card-premium full-width-chart">
            <div className="chart-card-header">
              <h4>Balance distribution by Category</h4>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Area type="monotone" dataKey="balance" stroke="var(--primary)" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} name="Net Balance" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="charts-main-grid">
          <div className="premium-card chart-card-premium">
            <div className="chart-card-header">
              <h4>Income Source Breakdown</h4>
            </div>
            <div className="chart-wrapper">
              <IncomeCategorySummary incomes={incomes} />
            </div>
          </div>

          <div className="premium-card chart-card-premium">
            <div className="chart-card-header">
              <h4>Expense Allocation</h4>
            </div>
            <div className="chart-wrapper">
              <CategorySummary expenses={expenses} />
            </div>
          </div>

          <div className="premium-card chart-card-premium">
            <div className="chart-card-header">
              <h4>Income by Category</h4>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Bar dataKey="amount" fill="var(--success)" radius={[4, 4, 0, 0]} name="Income" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="premium-card chart-card-premium">
            <div className="chart-card-header">
              <h4>Expenses by Category</h4>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Bar dataKey="amount" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;