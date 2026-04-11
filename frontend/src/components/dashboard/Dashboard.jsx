import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";
import ExpenseList from "./ExpenseList";
import IncomeList from "./IncomeList";
import BalanceSummary from "./BalanceSummary";
import Stats from "./Stats";
import Profile from "./Profile";
import Settings from "./Settings";
import BudgetManager from "./BudgetManager";
import DebtForm from "./DebtForm";
import DebtList from "./DebtList";
import DebtSummary from "./DebtSummary";
import SavingsGoals from "./SavingsGoals";
import FinancialTips from "./FinancialTips";
import OverviewCharts from "./OverviewCharts";
import { financeAPI } from "../../api";
import { useTranslation } from "../theme/TranslationContext";

const Dashboard = ({ onLogout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", profilePicture: null });
  
  const [isVisible, setIsVisible] = useState(true);
  
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Load from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomesRes, expensesRes, debtsRes, budgetsRes] = await Promise.all([
          financeAPI.getIncomes(),
          financeAPI.getExpenses(),
          financeAPI.getDebts(),
          financeAPI.getBudgets()
        ]);
        
        setIncomes(incomesRes.data);
        setExpenses(expensesRes.data);
        setDebts(debtsRes.data);
        setBudgets(budgetsRes.data);
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();

    // Listen for user updates from Profile component
    const handleUserUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    };

    window.addEventListener('userUpdate', handleUserUpdate);
    return () => window.removeEventListener('userUpdate', handleUserUpdate);
  }, []);

  // Handlers
  const addIncome = async (income) => {
    try {
      const res = await financeAPI.addIncome(income);
      setIncomes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding income:", err);
    }
  };

  const addExpense = async (expense) => {
    try {
      const res = await financeAPI.addExpense(expense);
      setExpenses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const addDebt = async (debt) => {
    try {
      const res = await financeAPI.addDebt(debt);
      setDebts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding debt:", err);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await financeAPI.deleteIncome(id);
      setIncomes((prev) => prev.filter((inc) => (inc._id || inc.id) !== id));
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await financeAPI.deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => (exp._id || exp.id) !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const deleteDebt = async (id) => {
    try {
      await financeAPI.deleteDebt(id);
      setDebts((prev) => prev.filter((d) => (d._id || d.id) !== id));
    } catch (err) {
      console.error("Error deleting debt:", err);
    }
  };

  const updateDebt = async (id, updates) => {
    try {
      const res = await financeAPI.updateDebt(id, updates);
      setDebts((prev) => prev.map((d) => ((d._id || d.id) === id ? res.data : d)));
    } catch (err) {
      console.error("Error updating debt:", err);
    }
  };

  const addBudget = async (budget) => {
    try {
      const res = await financeAPI.addBudget(budget);
      setBudgets((prev) => {
        const existing = prev.find(b => b.category === budget.category);
        if (existing) {
          return prev.map(b => b.category === budget.category ? res.data : b);
        } else {
          return [...prev, res.data];
        }
      });
    } catch (err) {
      console.error("Error adding budget:", err);
    }
  };

  const deleteBudget = async (category) => {
    try {
      await financeAPI.deleteBudget(category);
      setBudgets((prev) => prev.filter((b) => b.category !== category));
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Type', 'Category', 'Amount', 'Date']
    ];

    incomes.forEach(inc => {
      csvRows.push(['Income', inc.category, inc.amount, new Date(inc.date).toLocaleDateString()]);
    });

    expenses.forEach(exp => {
      csvRows.push(['Expense', exp.category, exp.amount, new Date(exp.date).toLocaleDateString()]);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="animate-fade-in">
            <BalanceSummary totalIncome={totalIncome} expenses={expenses} isVisible={isVisible} />
            <div className="dashboard-main-grid">
              <OverviewCharts expenses={expenses} incomes={incomes} />
              <div className="section-card premium-card recent-transactions-box">
                <div className="section-header">
                  <h3>{t('recentTransactions')}</h3>
                </div>
                <div className="recent-transactions-content">
                  <p className="description-text">
                    {t('recentTransactionsDesc')}
                  </p>
                  <div className="preview-list">
                    <IncomeList incomes={incomes.slice(-2)} />
                    <div style={{ margin: '1rem 0' }}></div>
                    <ExpenseList expenses={expenses.slice(-2)} />
                  </div>
                  <button className="premium-btn secondary see-all-btn" onClick={() => setActiveTab("transactions")}>
                    {t('seeAllTransactions')}
                  </button>
                </div>
              </div>
              <div className="transaction-forms-container">
                <FinancialTips />
                <div className="section-card premium-card">
                  <div className="section-header">
                    <h3>{t('addIncome')}</h3>
                  </div>
                  <IncomeForm onAddIncome={addIncome} />
                </div>
                <div className="section-card premium-card">
                  <div className="section-header">
                    <h3>{t('addExpense')}</h3>
                  </div>
                  <ExpenseForm onAddExpense={addExpense} />
                </div>
              </div>
            </div>
          </div>
        );
      case "transactions":
        return (
          <div className="animate-fade-in">
            <div className="section-header" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className="premium-btn secondary" onClick={() => setActiveTab("overview")} style={{ padding: '0.5rem 1rem' }}>
                  ← {t('backToOverview')}
                </button>
                <h2 className="premium-title" style={{ margin: 0, fontSize: '1.75rem' }}>{t('allTransactions')}</h2>
              </div>
              <button className="premium-btn" onClick={exportToCSV} style={{ padding: '0.5rem 1.5rem', backgroundColor: 'var(--success)', fontSize: '0.9rem' }}>
                📥 {t('exportCSV')}
              </button>
            </div>
            <div className="dashboard-main-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="section-card premium-card">
                <IncomeList incomes={incomes} onDeleteIncome={deleteIncome} />
              </div>
              <div className="section-card premium-card">
                <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
              </div>
            </div>
          </div>
        );
      case "stats": return <Stats incomes={incomes} expenses={expenses} budgets={budgets} debts={debts} />;
      case "debt":
        return (
          <div className="animate-fade-in">
            <div className="dashboard-main-grid">
              <div className="section-card premium-card">
                <div className="section-header">
                  <h3>{t('debtManagement')}</h3>
                </div>
                <DebtForm onAddDebt={addDebt} />
                <DebtList debts={debts} onDeleteDebt={deleteDebt} onUpdateDebt={updateDebt} />
              </div>
              <div className="section-card premium-card">
                <DebtSummary debts={debts} />
              </div>
            </div>
          </div>
        );
      case "budget": 
        return <BudgetManager 
          budgets={budgets} 
          onAddBudget={addBudget} 
          onDeleteBudget={deleteBudget} 
          expenses={expenses} 
        />;
      case "savings": return <SavingsGoals />;
      case "profile": return <Profile incomes={incomes} expenses={expenses} debts={debts} />;
      case "settings": return <Settings onLogout={onLogout} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="navbar-logo">{t('kiptaaz')}</h2>
        </div>
        
        <div className="user-profile-section">
          <div className="user-avatar-small">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              (user.name || "U")[0].toUpperCase()
            )}
          </div>
          <div className="user-info-sidebar">
            <span className="user-name-sidebar">{user.name || t('user')}</span>
            <span className="user-email-sidebar">{user.email || t('noEmail')}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <span>🏠</span> {t('home')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
          >
            <span>📝</span> {t('transactions')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
          >
            <span>📊</span> {t('stats')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'debt' ? 'active' : ''}`}
            onClick={() => { setActiveTab('debt'); setIsSidebarOpen(false); }}
          >
            <span>💸</span> {t('debt')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => { setActiveTab('budget'); setIsSidebarOpen(false); }}
          >
            <span>🎯</span> {t('setBudget')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'savings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('savings'); setIsSidebarOpen(false); }}
          >
            <span>💰</span> {t('savingsGoals')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
          >
            <span>👤</span> {t('profile')}
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          >
            <span>⚙️</span> {t('settings')}
          </button>
        </nav>

        <button 
          className="premium-btn danger" 
          style={{ marginTop: 'auto', width: '100%' }}
          onClick={onLogout}
        >
          {t('logout')}
        </button>
      </aside>

      <header className="dashboard-header">
        <div className="user-welcome" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="premium-btn secondary" style={{ padding: '0.5rem', marginRight: '1rem' }} onClick={() => setIsSidebarOpen(true)}>
              ☰
            </button>
            <div>
              <h2>{t('hello')}, {user.name || t('user')}</h2>
              <p>{t('moneyToday')}</p>
            </div>
          </div>
          <button 
            className="premium-btn secondary"
            onClick={() => setIsVisible(!isVisible)}
            style={{ 
              borderRadius: '50%', 
              width: '45px', 
              height: '45px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: 'var(--shadow-md)'
            }}
            title={isVisible ? t('hideBalance') || "Hide Balance" : t('showBalance') || "Show Balance"}
          >
            {isVisible ? '👁️' : '🙈'}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;