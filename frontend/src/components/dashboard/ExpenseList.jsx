import React from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";

const categories = [
  { name: "Food", key: "food" },
  { name: "Transport", key: "transport" },
  { name: "Entertainment", key: "entertainment" },
  { name: "Shopping", key: "shopping" },
  { name: "Bills", key: "bills" },
  { name: "Health", key: "health" },
  { name: "Education", key: "education" },
  { name: "Travel", key: "travel" },
  { name: "Subscriptions", key: "subscriptions" },
  { name: "Gifts", key: "gifts" },
  { name: "Charity", key: "charity" },
  { name: "Pet", key: "pet" },
  { name: "Maintenance", key: "maintenance" },
  { name: "Fuel", key: "fuel" },
  { name: "Other", key: "other" },
];

const ExpenseList = ({ expenses = [], onDeleteExpense }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = React.useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved);

    const handleUpdate = () => {
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
    };
    window.addEventListener('bookmarksUpdate', handleUpdate);
    return () => window.removeEventListener('bookmarksUpdate', handleUpdate);
  }, []);

  const toggleBookmark = (id) => {
    const isBookmarked = bookmarks.some(b => b.id === id);
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b.id !== id);
    } else {
      updated = [...bookmarks, { id, timestamp: new Date().toISOString() }];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarksUpdate'));
  };

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency}${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  
  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('expenses')}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('noExpenses')}</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('expenses')}</h3>
      <div className="transaction-list">
        {expenses.map((exp) => {
          const id = exp._id || exp.id;
          const isBookmarked = bookmarks.some(b => b.id === id);
          return (
            <div key={id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-category">{getCategoryTranslation(exp.category)}</span>
                <span className="transaction-desc">{t('expense')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="transaction-amount expense">-{formatValue(exp.amount)}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="action-btn" 
                    onClick={() => toggleBookmark(id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}
                  >
                    {isBookmarked ? '⭐' : '☆'}
                  </button>
                  <button className="delete-btn" onClick={() => onDeleteExpense && onDeleteExpense(id)}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;