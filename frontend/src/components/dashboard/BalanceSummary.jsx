import React from 'react';
import './Dashboard.css';

const BalanceSummary = ({ totalIncome = 0, expenses = [] }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary-grid">
      <div className="summary-card premium-card balance">
        <h3>Total Balance</h3>
        <p className="amount">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="summary-card premium-card income">
        <h3>Total Income</h3>
        <p className="amount">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="summary-card premium-card expenses">
        <h3>Total Expenses</h3>
        <p className="amount">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
};

export default BalanceSummary;