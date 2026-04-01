import React, { useState } from "react";
import "./BudgetForm.css";

const BudgetForm = ({ budget, setBudget }) => {
  const [amount, setAmount] = useState(budget || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || num <= 0) return;
    setBudget(num);
  };

  return (
    <form onSubmit={handleSubmit} className="form budget-form">
      <h3>Set Monthly Budget</h3>
      <input
        type="number"
        placeholder="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <button type="submit">Save Budget</button>
    </form>
  );
};

export default BudgetForm;