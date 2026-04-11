import React from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";
import "./BudgetSummary.css";

const BudgetSummary = ({ budget, expenses }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalExpenses;

  if (!budget) return null;

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="summary-cards">
      <div className="card balance">
        <h3>{t('monthlyBudget')}</h3>
        <p>{formatValue(budget)}</p>
      </div>
      <div className="card expenses">
        <h3>{t('spent')}</h3>
        <p>{formatValue(totalExpenses)}</p>
      </div>
      <div className="card income">
        <h3>{t('remaining')}</h3>
        <p>{formatValue(remaining >= 0 ? remaining : 0)}</p>
      </div>
    </div>
  );
};

export default BudgetSummary;