import React from "react";
import { useCurrency } from "../theme/useCurrency";

const BalanceSummary = ({ totalIncome, expenses }) => {
  const { currency } = useCurrency();
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary-cards">
      <div className="card balance">
        <h3>Balance</h3>
        <p>{currency} {balance}</p>
      </div>
      <div className="card income">
        <h3>Income</h3>
        <p>{currency} {totalIncome}</p>
      </div>
      <div className="card expenses">
        <h3>Expenses</h3>
        <p>{currency} {totalExpenses}</p>
      </div>
    </div>
  );
};

export default BalanceSummary;