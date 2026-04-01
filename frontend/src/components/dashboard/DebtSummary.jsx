import React from "react";
import { useCurrency } from "../theme/useCurrency";
import "./DebtSummary.css";

const DebtSummary = ({ debts }) => {
  const { currency } = useCurrency();
  const totalDebt = debts
    .filter((d) => d.type === "debt")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalLending = debts
    .filter((d) => d.type === "lending")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="summary-cards">
      <div className="card expenses">
        <h3>Total Debt</h3>
        <p>{currency} {totalDebt}</p>
      </div>
      <div className="card income">
        <h3>Total Lending</h3>
        <p>{currency} {totalLending}</p>
      </div>
    </div>
  );
};

export default DebtSummary;