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
import { financeAPI } from "../../api";

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  
  // State Management
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

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="animate-fade-in">
            <BalanceSummary totalIncome={totalIncome} expenses={expenses} />
            <div className="dashboard-main-grid">
              <div className="section-card premium-card recent-transactions-box">
                <div className="section-header">
                  <h3>Recent Transactions</h3>
                </div>
                <div className="recent-transactions-content">
                  <p className="description-text">
                    Monitor your latest financial activities. You can view, manage, and track all your income and expense entries in detail.
                  </p>
                  <div className="preview-list">
                    <IncomeList incomes={incomes.slice(-2)} />
                    <ExpenseList expenses={expenses.slice(-2)} />
                  </div>
                  <button className="premium-btn secondary see-all-btn" onClick={() => setActiveTab("transactions")}>
                    See All Transactions
                  </button>
                </div>
              </div>
              <div className="transaction-forms-container">
                <div className="section-card premium-card">
                  <div className="section-header">
                    <h3>Add Income</h3>
                  </div>
                  <IncomeForm onAddIncome={addIncome} />
                </div>
                <div className="section-card premium-card">
                  <div className="section-header">
                    <h3>Add Expense</h3>
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
            <div className="section-header" style={{ marginBottom: '2rem' }}>
              <button className="premium-btn secondary" onClick={() => setActiveTab("overview")} style={{ padding: '0.5rem 1rem' }}>
                ← Back to Overview
              </button>
              <h2 className="premium-title" style={{ margin: 0, fontSize: '1.75rem' }}>All Transactions</h2>
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
      case "stats": return <Stats incomes={incomes} expenses={expenses} />;
      case "debt":
        return (
          <div className="animate-fade-in">
            <div className="dashboard-main-grid">
              <div className="section-card premium-card">
                <div className="section-header">
                  <h3>Debt Management</h3>
                </div>
                <DebtForm onAddDebt={addDebt} />
                <DebtList debts={debts} onDeleteDebt={deleteDebt} />
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
      case "profile": return <Profile incomes={incomes} expenses={expenses} debts={debts} />;
      case "settings": return <Settings onLogout={onLogout} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="navbar-logo" style={{ marginBottom: '2rem' }}>Kiptaaz</h2>
        <nav className="sidebar-menu">
          <button 
            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <span>🏠</span> Overview
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
          >
            <span>📝</span> Transactions
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
          >
            <span>📊</span> Statistics
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'debt' ? 'active' : ''}`}
            onClick={() => { setActiveTab('debt'); setIsSidebarOpen(false); }}
          >
            <span>💸</span> Debt
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => { setActiveTab('budget'); setIsSidebarOpen(false); }}
          >
            <span>🎯</span> Budget
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
          >
            <span>👤</span> Profile
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          >
            <span>⚙️</span> Settings
          </button>
        </nav>

        <button 
          className="premium-btn danger" 
          style={{ marginTop: 'auto', width: '100%' }}
          onClick={onLogout}
        >
          Logout
        </button>
      </aside>

      <header className="dashboard-header">
        <div className="user-welcome">
          <button className="premium-btn secondary" style={{ padding: '0.5rem', marginRight: '1rem' }} onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <div>
            <h2>Hello, {user.name || 'User'}</h2>
            <p>Here's what's happening with your money today.</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;