import React from 'react';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';
import './Dashboard.css';

const BalanceSummary = ({ totalIncome = 0, expenses = [] }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatAmount = (amount) => {
    const convertedValue = convert(amount);
    return `${currency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="summary-grid">
      <div className="summary-card premium-card balance">
        <h3>{t('totalBalance')}</h3>
        <p className="amount">{formatAmount(balance)}</p>
      </div>
      <div className="summary-card premium-card income">
        <h3>{t('totalIncome')}</h3>
        <p className="amount">{formatAmount(totalIncome)}</p>
      </div>
      <div className="summary-card premium-card expenses">
        <h3>{t('totalExpenses')}</h3>
        <p className="amount">{formatAmount(totalExpenses)}</p>
      </div>
    </div>
  );
};

export default BalanceSummary;