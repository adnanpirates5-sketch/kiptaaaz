import React from "react";
import { useCurrency } from "../theme/useCurrency";

const ExpenseList = ({ expenses = [], onDeleteExpense }) => {
  const { currency } = useCurrency();
  
  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Expenses</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No expenses added yet.</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Expenses</h3>
      <div className="transaction-list">
        {expenses.map((exp) => (
          <div key={exp.id} className="transaction-item">
            <div className="transaction-info">
              <span className="transaction-category">{exp.category}</span>
              <span className="transaction-desc">Expense</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="transaction-amount expense">-{currency}{exp.amount}</span>
              <button className="delete-btn" onClick={() => onDeleteExpense && onDeleteExpense(exp.id)}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;