import React, { useState } from "react";

const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚗" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "💡" },
  { name: "Health", icon: "💊" },
  { name: "Education", icon: "📚" },
  { name: "Travel", icon: "✈️" },
  { name: "Subscriptions", icon: "📺" },
  { name: "Gifts", icon: "🎁" },
  { name: "Charity", icon: "🙏" },
  { name: "Pet", icon: "🐶" },
  { name: "Maintenance", icon: "🛠️" },
  { name: "Fuel", icon: "⛽" },
  { name: "Other", icon: "✨" },
];

const ExpenseForm = ({ onAddExpense }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    onAddExpense({ category, amount: num });
    setCategory("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form expense-form">
      <h3>Add Expense</h3>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`category-item ${category === cat.name ? "selected" : ""}`}
            onClick={() => setCategory(cat.name)}
          >
            <span className="icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

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