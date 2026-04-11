import React from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";

const categories = [
  { name: "Salary", key: "salary" },
  { name: "Freelance", key: "freelance" },
  { name: "Investment", key: "investment" },
  { name: "Gift", key: "gift" },
  { name: "Bonus", key: "bonus" },
  { name: "Interest", key: "interest" },
  { name: "Rental", key: "rental" },
  { name: "Dividend", key: "dividend" },
  { name: "Side Hustle", key: "sideHustle" },
  { name: "Refund", key: "refund" },
  { name: "Cashback", key: "cashback" },
  { name: "Commission", key: "commission" },
  { name: "Allowance", key: "allowance" },
  { name: "Lottery", key: "lottery" },
  { name: "Other", key: "other" },
];

const IncomeList = ({ incomes = [], onDeleteIncome }) => {
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

  if (incomes.length === 0) {
    return (
      <div className="income-list">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('income')}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('noIncomes')}</p>
      </div>
    );
  }

  return (
    <div className="income-list">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('income')}</h3>
      <div className="transaction-list">
        {incomes.map((inc) => {
          const id = inc._id || inc.id;
          const isBookmarked = bookmarks.some(b => b.id === id);
          return (
            <div key={id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-category">{getCategoryTranslation(inc.category)}</span>
                <span className="transaction-desc">{t('income')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="transaction-amount income">+{formatValue(inc.amount)}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="action-btn" 
                    onClick={() => toggleBookmark(id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}
                  >
                    {isBookmarked ? '⭐' : '☆'}
                  </button>
                  {onDeleteIncome && (
                    <button className="delete-btn" onClick={() => onDeleteIncome(id)}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeList;