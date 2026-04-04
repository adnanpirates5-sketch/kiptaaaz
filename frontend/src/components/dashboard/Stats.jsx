import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";
import "./Stats.css";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#f97316", // Orange
];

const categories = [
  { name: "Food", key: "food" },
  { name: "Transport", key: "transport" },
  { name: "Entertainment", key: "entertainment" },
  { name: "Shopping", key: "shopping" },
  { name: "Bills", key: "bills" },
  { name: "Health", key: "health" },
  { name: "Education", key: "education" },
  { name: "Travel", key: "travel" },
  { name: "Subscriptions", key: "subscriptions" },
  { name: "Gifts", key: "gifts" },
  { name: "Charity", key: "charity" },
  { name: "Pet", key: "pet" },
  { name: "Maintenance", key: "maintenance" },
  { name: "Fuel", key: "fuel" },
  { name: "Salary", key: "salary" },
  { name: "Freelance", key: "freelance" },
  { name: "Investment", key: "investment" },
  { name: "Bonus", key: "bonus" },
  { name: "Interest", key: "interest" },
  { name: "Rental", key: "rental" },
  { name: "Dividend", key: "dividend" },
  { name: "Side Hustle", key: "sideHustle" },
  { name: "Refund", key: "refund" },
  { name: "Cashback", key: "cashback" },
  { name: "Commission", key: "commission" },
  { name: "Allowance", key: "allowance" },
  { name: "Lottery", key: "lottery" },
  { name: "Other", key: "other" },
];

const CustomTooltip = ({ active, payload, label, currency, t }) => {
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

const Stats = ({ incomes, expenses, budgets = [], debts = [] }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [viewType, setViewType] = useState('overview'); // 'overview', 'trends', 'budget', 'debt'

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  // 1. Prepare data for merged category chart
  const allCategories = new Set([...incomes.map(i => i.category), ...expenses.map(e => e.category)]);
  const mergedData = Array.from(allCategories).map(cat => {
    const income = incomes.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);
    const expense = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { category: getCategoryTranslation(cat), income, expense, balance: income - expense };
  });

  // 2. Prepare data for bar charts
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

  // 3. Prepare data for Monthly Trend
  const monthlyData = {};
  [...incomes.map(i => ({...i, type: 'income'})), ...expenses.map(e => ({...e, type: 'expense'}))].forEach(item => {
    const date = new Date(item.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { month: monthYear, income: 0, expense: 0, savings: 0 };
    }
    if (item.type === 'income') monthlyData[monthYear].income += item.amount;
    else monthlyData[monthYear].expense += item.amount;
    monthlyData[monthYear].savings = monthlyData[monthYear].income - monthlyData[monthYear].expense;
  });
  
  const trendData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB;
  });

  // 4. Prepare data for Budget vs Actual
  const budgetVsActualData = budgets.map(budget => {
    const actual = expenses
      .filter(exp => exp.category === budget.category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return {
      category: getCategoryTranslation(budget.category),
      budget: budget.amount,
      actual: actual,
      remaining: Math.max(0, budget.amount - actual),
      over: Math.max(0, actual - budget.amount)
    };
  });

  // 5. Prepare Debt Data
  const debtPieData = debts.map(debt => ({
    name: debt.name,
    value: debt.amount,
    status: debt.status
  }));

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;

  const renderActiveView = () => {
    switch(viewType) {
      case 'trends':
        return (
          <div className="charts-main-grid">
            <div className="premium-card chart-card-premium full-width-chart">
              <div className="chart-card-header">
                <h4>{t('monthlyTrends')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Legend verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="income" stroke="var(--success)" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} name={t('totalIncome')} />
                    <Area type="monotone" dataKey="expense" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} name={t('totalExpenses')} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="premium-card chart-card-premium full-width-chart">
              <div className="chart-card-header">
                <h4>{t('savingsGrowth')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Line type="monotone" dataKey="savings" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} name={t('monthlySavings')} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="charts-main-grid">
            <div className="premium-card chart-card-premium full-width-chart">
              <div className="chart-card-header">
                <h4>{t('budgetVsActual')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={budgetVsActualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Legend />
                    <Bar dataKey="budget" fill="var(--text-muted)" opacity={0.3} radius={[4, 4, 0, 0]} name={t('plannedBudget')} />
                    <Bar dataKey="actual" fill="var(--primary)" radius={[4, 4, 0, 0]} name={t('actualSpent')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {budgetVsActualData.length === 0 && (
              <div className="full-width-chart" style={{textAlign: 'center', padding: '2rem'}}>
                <p>{t('noBudgetData')}</p>
              </div>
            )}
          </div>
        );
      case 'debt':
        return (
          <div className="charts-main-grid">
            <div className="premium-card chart-card-premium">
              <div className="chart-card-header">
                <h4>{t('debtDistribution')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={debtPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {debtPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="premium-card chart-card-premium">
              <div className="chart-card-header">
                <h4>{t('debtByEntity')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={debtPieData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Bar dataKey="value" fill="var(--danger)" radius={[4, 4, 0, 0]} name={t('amount')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      default: // overview
        return (
          <div className="charts-main-grid">
            <div className="premium-card chart-card-premium full-width-chart">
              <div className="chart-card-header">
                <h4>{t('incomeVsExpenses')}</h4>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
                    <Legend iconType="circle" />
                    <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} name={t('income')} />
                    <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} name={t('expenses')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="premium-card chart-card-premium">
              <div className="chart-card-header">
                <h4>{t('incomeSource')}</h4>
              </div>
              <div className="chart-wrapper">
                <IncomeCategorySummary incomes={incomes} />
              </div>
            </div>

            <div className="premium-card chart-card-premium">
              <div className="chart-card-header">
                <h4>{t('expenseAllocation')}</h4>
              </div>
              <div className="chart-wrapper">
                <CategorySummary expenses={expenses} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="stats-container-premium animate-fade-in">
      <div className="stats-header-premium">
        <div className="stats-title-group">
          <h2>{t('stats')}</h2>
          <p className="stats-subtitle">{t('statsSubtitle')}</p>
        </div>
        <div className="stats-view-controls">
          <button
            className={`premium-btn ${viewType === 'overview' ? 'primary' : 'secondary'}`}
            onClick={() => setViewType('overview')}
            style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }}
          >
            📊 {t('overview')}
          </button>
          <button
            className={`premium-btn ${viewType === 'trends' ? 'primary' : 'secondary'}`}
            onClick={() => setViewType('trends')}
            style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}
          >
            📈 {t('trends')}
          </button>
          <button
            className={`premium-btn ${viewType === 'budget' ? 'primary' : 'secondary'}`}
            onClick={() => setViewType('budget')}
            style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}
          >
            🎯 {t('budget')}
          </button>
          <button
            className={`premium-btn ${viewType === 'debt' ? 'primary' : 'secondary'}`}
            onClick={() => setViewType('debt')}
            style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}
          >
            💸 {t('debt')}
          </button>
        </div>
      </div>

      <div className="stats-summary-grid">
        <div className="premium-card stat-metric-card income">
          <span className="metric-label">{t('totalIncome')}</span>
          <span className="metric-value">{currency} {totalIncome.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card expense">
          <span className="metric-label">{t('totalExpenses')}</span>
          <span className="metric-value">{currency} {totalExpense.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card balance">
          <span className="metric-label">{t('netBalance')}</span>
          <span className="metric-value">{currency} {balance.toLocaleString()}</span>
        </div>
      </div>

      {renderActiveView()}
    </div>
  );
};

export default Stats;