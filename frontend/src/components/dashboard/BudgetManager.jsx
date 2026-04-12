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

    // Limit maximum amount to 1 billion
    if (num > 1000000000) {
      alert(t('amountTooLarge') || 'Amount is too large. Maximum allowed is 1,000,000,000.');
      return;
    }

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

  const exportToCSV = () => {
    if (budgets.length === 0) {
      alert(t('noBudgets'));
      return;
    }

    const csvData = budgets.map(budget => {
      const spent = getSpentForCategory(budget.category);
      const percentage = Math.min((spent / budget.amount) * 100, 100);
      const remaining = budget.amount - spent;
      return {
        'Category': getCategoryTranslation(budget.category),
        'Budget Amount': convert(budget.amount).toFixed(2),
        'Spent': convert(spent).toFixed(2),
        'Remaining': convert(remaining).toFixed(2),
        'Usage %': percentage.toFixed(2),
        'Currency': globalCurrency
      };
    });

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `budgets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  max="1000000000"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="budget-count-badge">{budgets.length}</span>
              {budgets.length > 0 && (
                <button 
                  onClick={exportToCSV}
                  title="Export to CSV"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
                  }}
                >
                  📥 Export CSV
                </button>
              )}
            </div>
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