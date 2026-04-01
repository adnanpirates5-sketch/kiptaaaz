import React from "react";
import { useCurrency } from "../theme/useCurrency";
import "./BudgetSummary.css";

const BudgetSummary = ({ budget, expenses }) => {
  const { currency } = useCurrency();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalExpenses;

  if (!budget) return null;

  return (
    <div className="summary-cards">
      <div className="card balance">
        <h3>Monthly Budget</h3>
        <p>{currency} {budget}</p>
      </div>
      <div className="card expenses">
        <h3>Spent</h3>
        <p>{currency} {totalExpenses}</p>
      </div>
      <div className="card income">
        <h3>Remaining</h3>
        <p>{currency} {remaining >= 0 ? remaining : 0}</p>
      </div>
    </div>
  );
};

export default BudgetSummary;