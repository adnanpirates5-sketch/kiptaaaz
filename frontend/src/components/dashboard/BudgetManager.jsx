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

  const getSpentForCategory = (catName) => {
    return expenses.filter(e => e.category === catName).reduce((sum, e) => sum + e.amount, 0);
  };

  const getCategoryIcon = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.icon : "✨";
  };

  return (
    <div className="budget-manager animate-fade-in">
      <div className="dashboard-main-grid">
        <div className="section-card premium-card">
          <div className="section-header">
            <h3>Set Budget</h3>
          </div>
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label className="input-label">Category</label>
              <button 
                type="button" 
                className="premium-input select-category-btn" 
                onClick={() => setIsModalOpen(true)}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{category ? `${getCategoryIcon(category)} ${category}` : "Select Category"}</span>
                <span>▼</span>
              </button>
            </div>

            <div className="form-group">
              <label className="input-label">Budget Amount ({currency})</label>
              <input
                type="number"
                className="premium-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
              🎯 Save Budget
            </button>
          </form>
        </div>

        <div className="section-card premium-card">
          <div className="section-header">
            <h3>Budget Progress</h3>
          </div>
          <div className="budget-list">
            {budgets.length === 0 ? (
              <div className="empty-state">
                <p>No budgets set yet. Start by adding one!</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const spent = getSpentForCategory(budget.category);
                const percentage = Math.min((spent / budget.amount) * 100, 100);
                const isOver = spent > budget.amount;
                const icon = getCategoryIcon(budget.category);

                return (
                  <div key={budget.id || budget.category} className="budget-item-card">
                    <div className="budget-item-header">
                      <div className="budget-item-info">
                        <span className="budget-icon">{icon}</span>
                        <div className="budget-item-details">
                          <span className="budget-category-name">{budget.category}</span>
                          <span className="budget-usage-text">
                            {currency} {spent.toLocaleString()} of {currency} {budget.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="delete-budget-btn" 
                        onClick={() => onDeleteBudget(budget.category)}
                        title="Delete Budget"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="budget-progress-container">
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${isOver ? 'over' : ''}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="budget-status-footer">
                        <span className={`status-text ${isOver ? 'over' : ''}`}>
                          {isOver 
                            ? `Over by ${currency} ${(spent - budget.amount).toLocaleString()}` 
                            : `${percentage.toFixed(0)}% used`
                          }
                        </span>
                        {!isOver && (
                          <span className="remaining-text">
                            {currency} {(budget.amount - spent).toLocaleString()} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSelectCategory={(cat) => setCategory(cat)}
      />
    </div>
  );
};

export default BudgetManager;