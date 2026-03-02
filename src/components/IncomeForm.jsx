import React, { useState } from "react";

const IncomeForm = ({ onAddIncome }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || num <= 0) return;
    onAddIncome(num);
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form income-form">
      <h3>Add Income</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <button type="submit">Add Income</button>
    </form>
  );
};

export default IncomeForm;