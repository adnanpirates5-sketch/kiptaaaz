import React, { useState } from "react";
import { useCurrency } from "../theme/useCurrency";
import CategoryModal from "./CategoryModal";
import "./BudgetManager.css";

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

const BudgetManager = ({ budgets, onAddBudget, onDeleteBudget, expenses }) => {
  const { currency } = useCurrency();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    onAddBudget({ category, amount: num });
    setCategory("");
    setAmount("");
  };

  const getSpentForCategory = (cat) => {
    return expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="budget-manager">
      <form onSubmit={handleSubmit} className="form budget-form">
        <h3>Set Budget for Category</h3>

        <button type="button" className="select-category-btn" onClick={() => setIsModalOpen(true)}>
          {category || "Select Category"}
        </button>

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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSelectCategory={(cat) => setCategory(cat)}
      />

      <div className="budget-progress">
        <h3>Budget Progress</h3>
        {budgets.map((budget) => {
          const spent = getSpentForCategory(budget.category);
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const isOver = spent > budget.amount;

          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-header">
                <span>{budget.category}</span>
                <span>{currency} {spent} / {currency} {budget.amount}</span>
                <button onClick={() => onDeleteBudget(budget.category)}>Delete</button>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${isOver ? 'over' : ''}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className={isOver ? 'over-budget' : ''}>
                {isOver ? `Over budget by ${currency} ${spent - budget.amount}` : `${percentage.toFixed(1)}% used`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;