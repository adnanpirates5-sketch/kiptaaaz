import React from "react";

const BalanceSummary = ({ income, expenses }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  return (
    <div className="summary-cards">
      <div className="card balance">
        <h3>Balance</h3>
        <p>৳ {balance}</p>
      </div>
      <div className="card income">
        <h3>Income</h3>
        <p>৳ {income}</p>
      </div>
      <div className="card expenses">
        <h3>Expenses</h3>
        <p>৳ {totalExpenses}</p>
      </div>
    </div>
  );
};

export default BalanceSummary;