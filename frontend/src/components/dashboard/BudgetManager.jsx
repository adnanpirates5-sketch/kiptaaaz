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
    <div className="budget-manager animate-fade-in">
      <div className="dashboard-main-grid">
        <div className="section-card premium-card">
          <div className="section-header">
            <h3>{t('setBudget')}</h3>
          </div>
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label className="input-label">{t('category')}</label>
              <button 
                type="button" 
                className="premium-input select-category-btn" 
                onClick={() => setIsModalOpen(true)}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{category ? `${getCategoryIcon(category)} ${getCategoryTranslation(category)}` : t('selectCategory')}</span>
                <span>▼</span>
              </button>
            </div>

            <div className="form-group">
              <label className="input-label">{t('amount')}</label>
              <div className="currency-input-group" style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="currency-selector" style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                  <button 
                    type="button"
                    onClick={() => setSelectedCurrency('৳')}
                    style={{ 
                      border: 'none', 
                      background: selectedCurrency === '৳' ? 'var(--primary)' : 'transparent',
                      color: selectedCurrency === '৳' ? '#fff' : 'var(--text-secondary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >৳</button>
                  <button 
                    type="button"
                    onClick={() => setSelectedCurrency('$')}
                    style={{ 
                      border: 'none', 
                      background: selectedCurrency === '$' ? 'var(--primary)' : 'transparent',
                      color: selectedCurrency === '$' ? '#fff' : 'var(--text-secondary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >$</button>
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{selectedCurrency}</span>
                  <input
                    type="number"
                    className="premium-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
              🎯 {t('saveBudget')}
            </button>
          </form>
        </div>

        <div className="section-card premium-card">
          <div className="section-header">
            <h3>{t('budgetProgress')}</h3>
          </div>
          <div className="budget-list">
            {budgets.length === 0 ? (
              <div className="empty-state">
                <p>{t('noBudgets')}</p>
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
                          <span className="budget-category-name">{getCategoryTranslation(budget.category)}</span>
                          <span className="budget-usage-text">
                            {formatValue(spent)} {t('of')} {formatValue(budget.amount)}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="delete-budget-btn" 
                        onClick={() => onDeleteBudget(budget.category)}
                        title={t('delete')}
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
                            ? `${t('overBy')} ${formatValue(spent - budget.amount)}` 
                            : `${percentage.toFixed(0)}% ${t('used')}`
                          }
                        </span>
                        {!isOver && (
                          <span className="remaining-text">
                            {formatValue(budget.amount - spent)} {t('remaining')}
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