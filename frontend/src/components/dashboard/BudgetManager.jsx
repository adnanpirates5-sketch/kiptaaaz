import React, { useState } from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";
import CategoryModal from "./CategoryModal";
import "./BudgetManager.css";

const categories = [
  { name: "Food", icon: "🍔", key: "food" },
  { name: "Transport", icon: "🚗", key: "transport" },
  { name: "Entertainment", icon: "🎬", key: "entertainment" },
  { name: "Shopping", icon: "🛍️", key: "shopping" },
  { name: "Bills", icon: "💡", key: "bills" },
  { name: "Health", icon: "💊", key: "health" },
  { name: "Education", icon: "📚", key: "education" },
  { name: "Travel", icon: "✈️", key: "travel" },
  { name: "Subscriptions", icon: "📺", key: "subscriptions" },
  { name: "Gifts", icon: "🎁", key: "gifts" },
  { name: "Charity", icon: "🙏", key: "charity" },
  { name: "Pet", icon: "🐶", key: "pet" },
  { name: "Maintenance", icon: "🛠️", key: "maintenance" },
  { name: "Fuel", icon: "⛽", key: "fuel" },
  { name: "Other", icon: "✨", key: "other" },
];

const BudgetManager = ({ budgets, onAddBudget, onDeleteBudget, expenses }) => {
  const { currency: globalCurrency, convert, toBase } = useCurrency();
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(globalCurrency);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    onAddBudget({ 
      category, 
      amount: toBase(num, selectedCurrency) 
    });
    setCategory("");
    setAmount("");
  };

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${globalCurrency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getSpentForCategory = (catName) => {
    return expenses.filter(e => e.category === catName).reduce((sum, e) => sum + e.amount, 0);
  };

  const getCategoryIcon = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.icon : "✨";
  };

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  return (
    <div className="budget-manager-premium animate-fade-in">
      {/* Header Section */}
      <div className="budget-header-section">
        <div className="header-content">
          <h2 className="budget-main-title">💰 {t('setBudget')}</h2>
          <p className="budget-subtitle">{t('manageYourSpending')}</p>
        </div>
      </div>

      {/* Main Budget Grid */}
      <div className="budget-grid-premium">
        {/* Add Budget Form */}
        <div className="budget-form-card">
          <h3 className="budget-form-title">📊 {t('createBudget')}</h3>
          <form onSubmit={handleSubmit} className="budget-form-premium">
            <div className="form-group-premium">
              <label className="form-label-premium">{t('category')}</label>
              <button 
                type="button" 
                className="category-select-premium" 
                onClick={() => setIsModalOpen(true)}
              >
                <span className="category-display">
                  {category ? `${getCategoryIcon(category)} ${getCategoryTranslation(category)}` : t('selectCategory')}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>

            <div className="form-group-premium">
              <label className="form-label-premium">{t('budgetAmount')}</label>
              <div className="amount-input-group">
                <div className="currency-buttons-premium">
                  <button 
                    type="button"
                    className={`curr-btn ${selectedCurrency === '৳' ? 'active' : ''}`}
                    onClick={() => setSelectedCurrency('৳')}
                  >৳</button>
                  <button 
                    type="button"
                    className={`curr-btn ${selectedCurrency === '$' ? 'active' : ''}`}
                    onClick={() => setSelectedCurrency('$')}
                  >$</button>
                </div>
                <input
                  type="number"
                  className="amount-input-premium"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button type="submit" className="budget-submit-btn">
              ✨ {t('saveBudget')}
            </button>
          </form>
        </div>

        {/* Budget List Section */}
        <div className="budget-list-card">
          <div className="budget-list-header">
            <h3 className="budget-list-title">📈 {t('budgetProgress')}</h3>
            <span className="budget-count-badge">{budgets.length}</span>
          </div>
          <div className="budget-list-premium">
            {budgets.length === 0 ? (
              <div className="budget-empty-state">
                <div className="empty-icon">📋</div>
                <p className="empty-text">{t('noBudgets')}</p>
                <p className="empty-subtext">{t('startByCreatingBudget')}</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const spent = getSpentForCategory(budget.category);
                const percentage = Math.min((spent / budget.amount) * 100, 100);
                const isOver = spent > budget.amount;
                const remaining = budget.amount - spent;
                const icon = getCategoryIcon(budget.category);

                return (
                  <div key={budget.id || budget.category} className="budget-card-premium">
                    <div className="budget-card-header-premium">
                      <div className="category-info-premium">
                        <div className="category-icon-badge">{icon}</div>
                        <div className="category-text">
                          <h4 className="category-name-premium">{getCategoryTranslation(budget.category)}</h4>
                          <p className="spending-info">
                            <span className="spent-amount">{formatValue(spent)}</span>
                            <span className="divider"> / </span>
                            <span className="total-amount">{formatValue(budget.amount)}</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        className="budget-delete-btn-premium" 
                        onClick={() => onDeleteBudget(budget.category)}
                        title={t('delete')}
                      >
                        ×
                      </button>
                    </div>

                    <div className="budget-stats-row">
                      <div className="stat-item">
                        <span className="stat-label">{t('spent')}</span>
                        <span className="stat-value spent">{formatValue(spent)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">{t('remaining')}</span>
                        <span className={`stat-value ${isOver ? 'over' : 'available'}`}>
                          {isOver ? '-' + formatValue(Math.abs(remaining)) : formatValue(remaining)}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">{t('usage')}</span>
                        <span className="stat-value percentage">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div className="progress-section-premium">
                      <div className="progress-bar-container-premium">
                        <div
                          className={`progress-bar-premium ${isOver ? 'over-budget' : ''}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="progress-status-premium">
                        {isOver ? (
                          <span className="status-warning">⚠️ {t('overBy')} {formatValue(spent - budget.amount)}</span>
                        ) : (
                          <span className="status-good">✓ {percentage === 100 ? t('budgetFull') : t('onTrack')}</span>
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