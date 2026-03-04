import React, { useState } from "react";

const IncomeForm = ({ onAddIncome }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category.trim() || !amount || num <= 0) return;
    // Pass an object with category and amount
    onAddIncome({ category: category.trim(), amount: num });
    setCategory("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form income-form">
      <h3>Add Income</h3>
      <input
        type="text"
        placeholder="Category (e.g., Salary, Freelance)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
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