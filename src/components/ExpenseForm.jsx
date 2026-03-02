import React, { useState } from "react";

const ExpenseForm = ({ onAddExpense }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category.trim() || !amount || num <= 0) return;
    onAddExpense({ category: category.trim(), amount: num });
    setCategory("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form expense-form">
      <h3>Add Expense</h3>
      <input
        type="text"
        placeholder="Category"
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
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;