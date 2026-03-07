import React, { useState } from "react";

const categories = [
  { name: "Salary", icon: "💰" },
  { name: "Freelance", icon: "🖋️" },
  { name: "Investment", icon: "📈" },
  { name: "Gift", icon: "🎁" },
  { name: "Bonus", icon: "🏆" },
  { name: "Interest", icon: "🏦" },
  { name: "Rental", icon: "🏠" },
  { name: "Dividend", icon: "💵" },
  { name: "Side Hustle", icon: "🛠️" },
  { name: "Refund", icon: "🔄" },
  { name: "Cashback", icon: "💳" },
  { name: "Commission", icon: "📬" },
  { name: "Allowance", icon: "🧾" },
  { name: "Lottery", icon: "🎰" },
  { name: "Other", icon: "✨" },
];

const IncomeForm = ({ onAddIncome }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    onAddIncome({ category, amount: num });
    setCategory("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form income-form">
      <h3>Add Income</h3>

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
      <button type="submit">Add Income</button>
    </form>
  );
};

export default IncomeForm;