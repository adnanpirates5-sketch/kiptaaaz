import React, { useState } from "react";
import { useTranslation } from '../theme/TranslationContext';
import { useCurrency } from "../theme/useCurrency";
import "./DebtForm.css";

const DebtForm = ({ onAddDebt }) => {
  const { t } = useTranslation();
  const { currency, convertToBase } = useCurrency();
  const [type, setType] = useState("debt");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !amount || num <= 0) return;
    onAddDebt({ 
      type, 
      name: name.trim(), 
      amount: convertToBase(num), 
      dueDate: dueDate || undefined,
      status: "pending" 
    });
    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('addDebtLending')}</h3>
      
      <div className="form-group">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="premium-input"
        >
          <option value="debt">{t('debtYouOwe')}</option>
          <option value="lending">{t('lendingYouLent')}</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder={t('personSource')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="premium-input"
          required
        />
      </div>

      <div className="form-group">
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currency}</span>
          <input
            type="number"
            className="premium-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={t('amount')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
          {t('dueDateOptional')}
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="premium-input"
        />
      </div>

      <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
        {t('addEntry')}
      </button>
    </form>
  );
};

export default DebtForm;