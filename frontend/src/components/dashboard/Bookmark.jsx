import React, { useState, useEffect } from "react";
import "./Bookmark.css";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";

const Bookmark = ({ incomes = [], expenses = [] }) => {
  const { t } = useTranslation();
  const { currency, convert } = useCurrency();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    return () => clearInterval(timer);
  }, []);

  const handleUnbookmark = (id) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('bookmarksUpdate'));
  };

  const bookmarkedIncomes = incomes.filter(inc => bookmarks.some(b => b.id === (inc._id || inc.id)));
  const bookmarkedExpenses = expenses.filter(exp => bookmarks.some(b => b.id === (exp._id || exp.id)));

  const totalIncome = bookmarkedIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = bookmarkedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const formatValue = (value) => {
    const convertedValue = convert(Math.abs(value));
    return `${currency}${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const allBookmarked = [
    ...bookmarkedIncomes.map(inc => ({ ...inc, type: 'income' })),
    ...bookmarkedExpenses.map(exp => ({ ...exp, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bookmark-container animate-fade-in">
      <div className="bookmark-header">
        <h2 className="premium-title" style={{ margin: 0 }}>{t('bookmark')}</h2>
        <div className="bookmark-time">{time}</div>
      </div>

      <div className="bookmark-summary-bar">
        <div className="summary-item">
          <span className="summary-label">{t('income')}</span>
          <span className="summary-value income">+{formatValue(totalIncome)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('expenses')}</span>
          <span className="summary-value expense">-{formatValue(totalExpense)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('total')}</span>
          <span className={`summary-value total ${netTotal >= 0 ? 'income' : 'expense'}`}>
            {netTotal >= 0 ? '+' : '-'}{formatValue(netTotal)}
          </span>
        </div>
      </div>

      <div className="bookmark-list-section">
        {allBookmarked.length === 0 ? (
          <div className="bookmark-empty">
            <span className="empty-icon">🔖</span>
            <p>{t('noBookmarks')}</p>
          </div>
        ) : (
          allBookmarked.map((item) => (
            <div key={item._id || item.id} className="bookmark-item">
              <div className="item-left">
                <span className="item-title">{t(item.category.toLowerCase()) || item.category}</span>
                <span className="item-date">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <div className="item-right">
                <span className={`item-amount ${item.type}`}>
                  {item.type === 'income' ? '+' : '-'}{formatValue(item.amount)}
                </span>
                <div className="item-actions">
                  <button 
                    className="action-btn unbookmark-btn" 
                    onClick={() => handleUnbookmark(item._id || item.id)}
                    title="Remove Bookmark"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmark;
