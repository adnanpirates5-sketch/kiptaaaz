import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../theme/TranslationContext';
import { useCurrency } from '../theme/useCurrency';
import './Calendar.css';

const Calendar = ({ incomes = [], expenses = [] }) => {
  const { t, language } = useTranslation();
  const { currency, convert } = useCurrency();
  
  // Dynamic Month and Year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(1);
  };

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
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === selectedDate;
    });

    const filteredExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === selectedDate;
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
  }, [incomes, expenses, currentYear, currentMonth, selectedDate]);

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
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
    const dayExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });

    const totalIn = dayIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalOut = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (totalIn === 0 && totalOut === 0) return null;

    return { totalIn, totalOut };
  };

  const formatYear = (year) => {
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return year.toString().split('').map(d => bnDigits[parseInt(d)]).join('');
    }
    return year;
  };

  const formatDay = (day) => {
    if (!day) return '';
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return day.toString().split('').map(d => bnDigits[parseInt(d)]).join('');
    }
    return day;
  };

  return (
    <div className="calendar-container animate-fade-in">
      <div className="section-header calendar-nav-header">
        <h2 className="premium-title">
          {t('calendar')} - {t(monthNames[currentMonth])} {formatYear(currentYear)}
        </h2>
        <div className="calendar-controls">
          <button className="premium-btn secondary icon-btn" onClick={handlePrevMonth} title={t('prevMonth')}>
            <span>←</span>
          </button>
          <button className="premium-btn secondary icon-btn" onClick={handleNextMonth} title={t('nextMonth')}>
            <span>→</span>
          </button>
        </div>
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
              const now = new Date();
              const isToday = day === now.getDate() && 
                              currentMonth === now.getMonth() && 
                              currentYear === now.getFullYear();

              return (
                <div 
                  key={index} 
                  className={`calendar-day ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <span className="day-number">{formatDay(day)}</span>
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
            <h3>{t(monthNames[currentMonth])} {formatDay(selectedDate)}, {formatYear(currentYear)}</h3>
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
