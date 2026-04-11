import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../theme/useCurrency';
import './FinancialHealth.css';

const FinancialHealth = ({ incomes, expenses, budgets, debts }) => {
  const { currency } = useCurrency();

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDebt = debts.filter(d => d.type === 'debt').reduce((sum, d) => sum + d.amount, 0);

  // 1. Savings Rate Score (Max 40)
  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;
  const savingsScore = Math.max(0, Math.min(40, savingsRate * 100));

  // 2. Debt Ratio Score (Max 30) - Lower is better
  const debtToIncome = totalIncome > 0 ? totalDebt / (totalIncome * 12) : (totalDebt > 0 ? 1 : 0);
  const debtScore = Math.max(0, Math.min(30, 30 - (debtToIncome * 100)));

  // 3. Budget Adherence Score (Max 30)
  const budgetScore = budgets.length > 0 ? budgets.reduce((acc, b) => {
    const spent = expenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
    return acc + (spent <= b.amount ? (30 / budgets.length) : 0);
  }, 0) : 15; // Default middle if no budgets set

  const totalScore = Math.round(savingsScore + debtScore + budgetScore);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'var(--success)', icon: '🚀', tip: 'You\'re a financial rockstar! Consider investing your surplus.' };
    if (score >= 60) return { label: 'Good', color: 'var(--primary)', icon: '📈', tip: 'You\'re on the right track. Try reducing small daily expenses.' };
    if (score >= 40) return { label: 'Fair', color: 'var(--warning)', icon: '⚖️', tip: 'Balance is key. Watch out for those subscription leaks.' };
    return { label: 'Needs Attention', color: 'var(--danger)', icon: '⚠️', tip: 'Let\'s tighten the belt. Focus on high-interest debt first.' };
  };

  const status = getHealthStatus(totalScore);

  const data = [
    { name: 'Score', value: totalScore },
    { name: 'Remaining', value: 100 - totalScore },
  ];

  return (
    <div className="section-card premium-card financial-health-card">
      <div className="section-header">
        <h3>Interactive Financial Health</h3>
        <span className="health-badge" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="health-content-grid">
        <div className="gauge-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill={status.color} stroke="none" />
                <Cell fill="var(--border-color)" opacity={0.2} stroke="none" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="score-display">
            <span className="score-number" style={{ color: status.color }}>{totalScore}</span>
            <span className="score-label">/ 100</span>
          </div>
        </div>

        <div className="health-insights">
          <div className="insight-item">
            <div className="insight-header">
              <span>Savings Rate</span>
              <span className="insight-value">{Math.round(savingsRate * 100)}%</span>
            </div>
            <div className="insight-bar-bg">
              <div className="insight-bar-fill" style={{ width: `${Math.min(100, savingsRate * 100)}%`, backgroundColor: 'var(--success)' }}></div>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-header">
              <span>Budget Discipline</span>
              <span className="insight-value">{Math.round((budgetScore / 30) * 100)}%</span>
            </div>
            <div className="insight-bar-bg">
              <div className="insight-bar-fill" style={{ width: `${(budgetScore / 30) * 100}%`, backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>

          <div className="health-tip-box">
            <p><strong>Next Step:</strong> {status.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
