import React from "react";
import "./BudgetSummary.css";

const BudgetSummary = ({ budget, expenses }) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalExpenses;

  if (!budget) return null;

  return (
    <div className="summary-cards">
      <div className="card balance">
        <h3>Monthly Budget</h3>
        <p>৳ {budget}</p>
      </div>
      <div className="card expenses">
        <h3>Spent</h3>
        <p>৳ {totalExpenses}</p>
      </div>
      <div className="card income">
        <h3>Remaining</h3>
        <p>৳ {remaining >= 0 ? remaining : 0}</p>
      </div>
    </div>
  );
};

export default BudgetSummary;