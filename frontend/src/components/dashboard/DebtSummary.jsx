import React from "react";
import { useCurrency } from "../theme/useCurrency";
import "./DebtSummary.css";

const DebtSummary = ({ debts }) => {
  const { currency } = useCurrency();
  
  const pendingDebts = debts.filter(d => d.type === "debt" && d.status !== "paid");
  const pendingLendings = debts.filter(d => d.type === "lending" && d.status !== "paid");

  const totalDebt = pendingDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalLending = pendingLendings.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="debt-summary-container">
      <div className="section-header">
        <h3>Pending Overview</h3>
      </div>
      <div className="summary-cards">
        <div className="summary-card debt">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <span className="label">Total to Pay</span>
            <h2 className="amount">{currency} {totalDebt.toLocaleString()}</h2>
            <span className="count">{pendingDebts.length} active debts</span>
          </div>
        </div>
        
        <div className="summary-card lending">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <span className="label">Total to Receive</span>
            <h2 className="amount">{currency} {totalLending.toLocaleString()}</h2>
            <span className="count">{pendingLendings.length} active lendings</span>
          </div>
        </div>
      </div>
      
      <div className="net-balance">
        <span className="label">Net Debt Position</span>
        <h3 className={`amount ${(totalLending - totalDebt) >= 0 ? 'positive' : 'negative'}`}>
          {currency} {(totalLending - totalDebt).toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default DebtSummary;
