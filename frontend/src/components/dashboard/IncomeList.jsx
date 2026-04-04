import React from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";

const categories = [
  { name: "Salary", key: "salary" },
  { name: "Freelance", key: "freelance" },
  { name: "Investment", key: "investment" },
  { name: "Gift", key: "gift" },
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

const IncomeList = ({ incomes = [], onDeleteIncome }) => {
  const { currency } = useCurrency();
  const { t } = useTranslation();

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  if (incomes.length === 0) {
    return (
      <div className="income-list">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('income')}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('noIncomes')}</p>
      </div>
    );
  }

  return (
    <div className="income-list">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('income')}</h3>
      <div className="transaction-list">
        {incomes.map((inc) => (
          <div key={inc._id || inc.id} className="transaction-item">
            <div className="transaction-info">
              <span className="transaction-category">{getCategoryTranslation(inc.category)}</span>
              <span className="transaction-desc">{t('income')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="transaction-amount income">+{currency}{inc.amount}</span>
              {onDeleteIncome && (
                <button className="delete-btn" onClick={() => onDeleteIncome(inc._id || inc.id)}>
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