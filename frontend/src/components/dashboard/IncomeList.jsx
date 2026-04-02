import React from "react";
import { useCurrency } from "../theme/useCurrency";

const IncomeList = ({ incomes = [], onDeleteIncome }) => {
  const { currency } = useCurrency();

  if (incomes.length === 0) {
    return (
      <div className="income-list">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Income</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No income added yet.</p>
      </div>
    );
  }

  return (
    <div className="income-list">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Income</h3>
      <div className="transaction-list">
        {incomes.map((inc) => (
          <div key={inc.id} className="transaction-item">
            <div className="transaction-info">
              <span className="transaction-category">{inc.category}</span>
              <span className="transaction-desc">Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="transaction-amount income">+{currency}{inc.amount}</span>
              {onDeleteIncome && (
                <button className="delete-btn" onClick={() => onDeleteIncome(inc.id)}>
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeList;