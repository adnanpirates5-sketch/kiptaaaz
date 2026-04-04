import React, { useState } from "react";
import { useTranslation } from '../theme/TranslationContext';
import "./BudgetForm.css";

const BudgetForm = ({ budget, setBudget }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(budget || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || num <= 0) return;
    setBudget(num);
  };

  return (
    <form onSubmit={handleSubmit} className="form budget-form">
      <h3>{t('setBudgetTitle')}</h3>
      <input
        type="number"
        placeholder={t('amount')}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <button type="submit">{t('saveBudget')}</button>
    </form>
  );
};

export default BudgetForm;