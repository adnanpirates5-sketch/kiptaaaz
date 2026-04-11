import React from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from '../theme/TranslationContext';
import "./DebtSummary.css";

const DebtSummary = ({ debts }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  
  const pendingDebts = debts.filter(d => d.type === "debt" && d.status !== "paid");
  const pendingLendings = debts.filter(d => d.type === "lending" && d.status !== "paid");

  const totalDebt = pendingDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalLending = pendingLendings.reduce((sum, d) => sum + d.amount, 0);

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="debt-summary-container">
      <div className="section-header">
        <h3>{t('pendingOverview')}</h3>
      </div>
      <div className="summary-cards">
        <div className="summary-card debt">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <span className="label">{t('totalToPay')}</span>
            <h2 className="amount">{formatValue(totalDebt)}</h2>
            <span className="count">{pendingDebts.length} {t('activeDebts')}</span>
          </div>
        </div>
        
        <div className="summary-card lending">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <span className="label">{t('totalToReceive')}</span>
            <h2 className="amount">{formatValue(totalLending)}</h2>
            <span className="count">{pendingLendings.length} {t('activeLendings')}</span>
          </div>
        </div>
      </div>
      
      <div className="net-balance">
        <span className="label">{t('netDebtPosition')}</span>
        <h3 className={`amount ${(totalLending - totalDebt) >= 0 ? 'positive' : 'negative'}`}>
          {formatValue(totalLending - totalDebt)}
        </h3>
      </div>
    </div>
  );
};

export default DebtSummary;
