import React, { useState, useMemo } from 'react';
import { useTranslation } from '../theme/TranslationContext';
import { useCurrency } from '../theme/useCurrency';
import './Calendar.css';

const Calendar = ({ incomes = [], expenses = [] }) => {
  const { t } = useTranslation();
  const { currency, convert } = useCurrency();
  
  // Static for April 2026 as per requirement
  const YEAR = 2026;
  const MONTH = 3; // April (0-indexed)
  const daysInMonth = 30;
  const firstDayOfMonth = 3; // April 1, 2026 is Wednesday (0: Sun, 1: Mon, 2: Tue, 3: Wed)

  const [selectedDate, setSelectedDate] = useState(1);

  const days = useMemo(() => {
    const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
    const calendarDays = [];

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        calendarDays.push(dayNumber);
      } else {
        calendarDays.push(null);
      }
    }
    return calendarDays;
  }, [daysInMonth, firstDayOfMonth]);

  const dailyTransactions = useMemo(() => {
    const filteredIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d.getFullYear() === YEAR && d.getMonth() === MONTH && d.getDate() === selectedDate;
    });

    const filteredExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getFullYear() === YEAR && d.getMonth() === MONTH && d.getDate() === selectedDate;
    });

    const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      incomes: filteredIncomes,
      expenses: filteredExpenses,
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense
    };
  }, [incomes, expenses, selectedDate]);

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency}${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getCategoryTranslation = (catName) => {
    const allCategories = [
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
    const cat = allCategories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  const getDaySummary = (day) => {
    if (!day) return null;
    const dayIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d.getFullYear() === YEAR && d.getMonth() === MONTH && d.getDate() === day;
    });
    const dayExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getFullYear() === YEAR && d.getMonth() === MONTH && d.getDate() === day;
    });

    const totalIn = dayIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalOut = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (totalIn === 0 && totalOut === 0) return null;

    return { totalIn, totalOut };
  };

  return (
    <div className="calendar-container animate-fade-in">
      <div className="section-header">
        <h2 className="premium-title">{t('calendar')} - {t('april2026')}</h2>
      </div>

      <div className="calendar-layout-grid">
        {/* Calendar Grid Card */}
        <div className="section-card premium-card calendar-grid-card">
          <div className="calendar-header-days">
            <span>{t('sun')}</span>
            <span>{t('mon')}</span>
            <span>{t('tue')}</span>
            <span>{t('wed')}</span>
            <span>{t('thu')}</span>
            <span>{t('fri')}</span>
            <span>{t('sat')}</span>
          </div>
          <div className="calendar-days-grid">
            {days.map((day, index) => {
              const summary = getDaySummary(day);
              const isSelected = selectedDate === day;
              const isToday = day === new Date().getDate() && 
                              new Date().getMonth() === MONTH && 
                              new Date().getFullYear() === YEAR;

              return (
                <div 
                  key={index} 
                  className={`calendar-day ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {summary && (
                        <div className="day-indicators">
                          {summary.totalIn > 0 && <span className="indicator income"></span>}
                          {summary.totalOut > 0 && <span className="indicator expense"></span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Card */}
        <div className="section-card premium-card calendar-details-card">
          <div className="details-header">
            <h3>{t('april2026')} {selectedDate}</h3>
          </div>

          <div className="daily-summary-stats">
            <div className="summary-item">
              <span>{t('income')}</span>
              <span className="amount income">+{formatValue(dailyTransactions.totalIncome)}</span>
            </div>
            <div className="summary-item">
              <span>{t('expenses')}</span>
              <span className="amount expense">-{formatValue(dailyTransactions.totalExpense)}</span>
            </div>
            <div className="summary-item total">
              <span>{t('total')}</span>
              <span className={`amount ${dailyTransactions.net >= 0 ? 'income' : 'expense'}`}>
                {dailyTransactions.net >= 0 ? '+' : ''}{formatValue(dailyTransactions.net)}
              </span>
            </div>
          </div>

          <div className="daily-transactions-list">
            {dailyTransactions.incomes.length === 0 && dailyTransactions.expenses.length === 0 ? (
              <p className="no-transactions">{t('noTransactionsDay')}</p>
            ) : (
              <>
                {dailyTransactions.incomes.map(inc => (
                  <div key={inc._id || inc.id} className="mini-transaction-item">
                    <span className="cat">{getCategoryTranslation(inc.category)}</span>
                    <span className="amt income">+{formatValue(inc.amount)}</span>
                  </div>
                ))}
                {dailyTransactions.expenses.map(exp => (
                  <div key={exp._id || exp.id} className="mini-transaction-item">
                    <span className="cat">{getCategoryTranslation(exp.category)}</span>
                    <span className="amt expense">-{formatValue(exp.amount)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
