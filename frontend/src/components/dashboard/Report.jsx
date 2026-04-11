import React, { useState, useMemo, useRef } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';
import './Report.css';

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

const Report = ({ incomes = [], expenses = [], budgets = [], debts = [], savingsGoals = [] }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  const reportRef = useRef();
  
  const [dateRange, setDateRange] = useState('allTime');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const now = new Date();
    let start, end;

    if (dateRange === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (dateRange === 'lastMonth') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (dateRange === 'thisYear') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (dateRange === 'customRange' && customDates.start && customDates.end) {
      start = new Date(customDates.start);
      end = new Date(customDates.end);
      end.setHours(23, 59, 59, 999);
    }

    const filterFn = (item) => {
      if (dateRange === 'allTime') return true;
      if (!start || !end) return true;
      const date = new Date(item.date);
      return date >= start && date <= end;
    };

    return {
      incomes: incomes.filter(filterFn),
      expenses: expenses.filter(filterFn),
    };
  }, [dateRange, customDates, incomes, expenses]);

  // Calculations
  const stats = useMemo(() => {
    const totalIncome = filteredData.incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = filteredData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netBalance = totalIncome - totalExpense;
    
    const totalDebt = debts.reduce((sum, d) => d.type === 'debt' ? sum + d.amount : sum, 0);
    const totalLending = debts.reduce((sum, d) => d.type === 'lending' ? sum + d.amount : sum, 0);
    
    const totalSavingsProgress = savingsGoals.reduce((sum, g) => sum + g.current, 0);
    const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);

    // Budget vs Actual
    const budgetAnalysis = budgets.map(b => {
      const actual = expenses
        .filter(e => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        category: b.category,
        budget: b.amount,
        actual: actual,
        diff: b.amount - actual,
        percent: b.amount > 0 ? (actual / b.amount) * 100 : 0
      };
    });

    return {
      totalIncome,
      totalExpense,
      netBalance,
      totalDebt,
      totalLending,
      totalSavingsProgress,
      totalSavingsTarget,
      budgetAnalysis
    };
  }, [filteredData, debts, budgets, expenses, savingsGoals]);

  // Chart Data
  const pieData = [
    { name: t('income'), value: stats.totalIncome },
    { name: t('expenses'), value: stats.totalExpense }
  ].filter(d => d.value > 0);

  const barData = stats.budgetAnalysis.slice(0, 6).map(b => ({
    name: b.category,
    [t('budget')]: convert(b.budget),
    [t('actualSpent')]: convert(b.actual)
  }));

  const downloadPDF = async () => {
    setIsGenerating(true);
    const element = reportRef.current;
    
    try {
      // Temporarily expand height for full capture if needed
      const originalStyle = element.style.height;
      element.style.height = 'auto';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#ffffff'
      });
      
      element.style.height = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
      pdf.save(`Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFinancialInsight = () => {
    if (stats.totalDebt > stats.totalIncome * 2) return { text: t('debtWarning'), type: 'danger' };
    if (stats.budgetAnalysis.some(b => b.percent > 100)) return { text: t('spendingWarning'), type: 'warning' };
    if (stats.totalSavingsTarget > 0 && (stats.totalSavingsProgress / stats.totalSavingsTarget) < 0.2) return { text: t('savingsWarning'), type: 'info' };
    if (stats.netBalance > 0) return { text: t('healthyBalance'), type: 'success' };
    return null;
  };

  const insight = getFinancialInsight();

  return (
    <div className="report-container animate-fade-in">
      <div className="report-controls section-card premium-card">
        <div className="filter-group">
          <label>{t('selectDateRange')}</label>
          <div className="date-options">
            {['allTime', 'thisMonth', 'lastMonth', 'thisYear', 'customRange'].map(opt => (
              <button 
                key={opt}
                className={`filter-btn ${dateRange === opt ? 'active' : ''}`}
                onClick={() => setDateRange(opt)}
              >
                {t(opt)}
              </button>
            ))}
          </div>
        </div>

        {dateRange === 'customRange' && (
          <div className="custom-date-inputs">
            <div className="input-field">
              <label>{t('startDate')}</label>
              <input 
                type="date" 
                value={customDates.start} 
                onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
              />
            </div>
            <div className="input-field">
              <label>{t('endDate')}</label>
              <input 
                type="date" 
                value={customDates.end} 
                onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
              />
            </div>
          </div>
        )}

        <button 
          className="premium-btn download-btn" 
          onClick={downloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <><span className="spinner"></span> {t('generatingPDF')}</>
          ) : (
            <>📥 {t('downloadReport')}</>
          )}
        </button>
      </div>

      <div className="report-content-wrapper" ref={reportRef}>
        <div className="report-header">
          <div className="brand">
            <h1 className="report-title">{t('financialReport')}</h1>
            <p className="report-subtitle">{t('kiptaaz')} - {new Date().toLocaleDateString()}</p>
          </div>
          <div className="report-period">
            {dateRange !== 'allTime' && (
              <span className="period-badge">
                {dateRange === 'customRange' 
                  ? `${customDates.start} - ${customDates.end}`
                  : t(dateRange)
                }
              </span>
            )}
          </div>
        </div>

        {insight && (
          <div className={`insight-card ${insight.type}`}>
            <span className="insight-icon">
              {insight.type === 'danger' ? '⚠️' : insight.type === 'warning' ? '🔔' : insight.type === 'success' ? '✅' : 'ℹ️'}
            </span>
            <p>{insight.text}</p>
          </div>
        )}

        <div className="report-grid">
          {/* Summary Section */}
          <div className="report-section full-width">
            <h2 className="section-title">{t('reportSummary')}</h2>
            <div className="summary-stats">
              <div className="stat-card income">
                <span className="stat-label">{t('totalIncome')}</span>
                <span className="stat-value">{currency} {convert(stats.totalIncome).toLocaleString()}</span>
              </div>
              <div className="stat-card expense">
                <span className="stat-label">{t('totalExpenses')}</span>
                <span className="stat-value">{currency} {convert(stats.totalExpense).toLocaleString()}</span>
              </div>
              <div className="stat-card balance">
                <span className="stat-label">{t('netBalance')}</span>
                <span className="stat-value">{currency} {convert(stats.netBalance).toLocaleString()}</span>
              </div>
              <div className="stat-card debt">
                <span className="stat-label">{t('totalDebt')}</span>
                <span className="stat-value">{currency} {convert(stats.totalDebt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="report-section">
            <h2 className="section-title">{t('incomeVsExpense')}</h2>
            <div className="chart-container">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">{t('noDataForPeriod')}</p>
              )}
            </div>
          </div>

          <div className="report-section">
            <h2 className="section-title">{t('budgetAnalysis')}</h2>
            <div className="chart-container">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
                    <YAxis tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)'}}
                      itemStyle={{color: 'var(--text-primary)'}}
                    />
                    <Legend />
                    <Bar dataKey={t('budget')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={t('actualSpent')} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">{t('noBudgetData')}</p>
              )}
            </div>
          </div>

          {/* Debt & Savings */}
          <div className="report-section">
            <h2 className="section-title">{t('debtOverview')}</h2>
            <div className="debt-list">
              <div className="debt-item">
                <span>{t('totalToPay')}</span>
                <span className="val danger">{currency} {convert(stats.totalDebt).toLocaleString()}</span>
              </div>
              <div className="debt-item">
                <span>{t('totalToReceive')}</span>
                <span className="val success">{currency} {convert(stats.totalLending).toLocaleString()}</span>
              </div>
              <div className="debt-item net">
                <span>{t('netDebtPosition')}</span>
                <span className={`val ${stats.totalLending - stats.totalDebt >= 0 ? 'success' : 'danger'}`}>
                  {currency} {convert(stats.totalLending - stats.totalDebt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h2 className="section-title">{t('savingsProgress')}</h2>
            <div className="savings-container">
              {savingsGoals.length > 0 ? (
                savingsGoals.slice(0, 3).map(goal => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div key={goal._id || goal.id} className="goal-progress">
                      <div className="goal-info">
                        <span className="goal-name">{goal.name}</span>
                        <span className="goal-percent">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${Math.min(100, progress)}%` }}></div>
                      </div>
                      <div className="goal-amounts">
                        <span>{currency} {convert(goal.current).toLocaleString()}</span>
                        <span>/ {currency} {convert(goal.target).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-data">{t('noGoals')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
