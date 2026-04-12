import React, { useState } from "react";
import { useTranslation } from '../theme/TranslationContext';
import { useCurrency } from "../theme/useCurrency";
import "./DebtForm.css";
import Calculator from "./Calculator";

const DebtForm = ({ onAddDebt }) => {
  const { t } = useTranslation();
  const { currency: globalCurrency, toBase } = useCurrency();
  const [type, setType] = useState("debt");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(globalCurrency);
  const [dueDate, setDueDate] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !amount || num <= 0) return;

    // Limit maximum amount to 1 billion
    if (num > 1000000000) {
      alert(t('amountTooLarge') || 'Amount is too large. Maximum allowed is 1,000,000,000.');
      return;
    }

    onAddDebt({ 
      type, 
      name: name.trim(), 
      amount: toBase(num, selectedCurrency), 
      dueDate: dueDate || undefined,
      status: "pending" 
    });
    setName("");
    setAmount("");
    setDueDate("");
  };

  const handleUseCalculatorResult = (result) => {
    setAmount(result);
    setShowCalculator(false);
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
        <div className="currency-input-group" style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="currency-selector" style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <button 
              type="button"
              onClick={() => setSelectedCurrency('৳')}
              style={{ 
                border: 'none', 
                background: selectedCurrency === '৳' ? 'var(--primary)' : 'transparent',
                color: selectedCurrency === '৳' ? '#fff' : 'var(--text-secondary)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >৳</button>
            <button 
              type="button"
              onClick={() => setSelectedCurrency('$')}
              style={{ 
                border: 'none', 
                background: selectedCurrency === '$' ? 'var(--primary)' : 'transparent',
                color: selectedCurrency === '$' ? '#fff' : 'var(--text-secondary)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >$</button>
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{selectedCurrency}</span>
            <input
              type="number"
              className="premium-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              placeholder={t('amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max="1000000000"
              step="0.01"
              required
            />
            <button 
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              style={{ 
                position: 'absolute', 
                right: '0.5rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: showCalculator ? 'var(--primary)' : 'var(--text-muted)'
              }}
              title="Calculator"
            >
              🔢
            </button>
          </div>
        </div>
      </div>

      {showCalculator && (
        <div className="calculator-wrapper animate-fade-in" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <Calculator 
            onUseResult={handleUseCalculatorResult} 
            onClose={() => setShowCalculator(false)} 
          />
        </div>
      )}

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