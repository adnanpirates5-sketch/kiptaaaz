import React, { useState, useEffect } from "react";

import BalanceSummary from "./BalanceSummary";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import IncomeList from "./IncomeList";
import ExpenseList from "./ExpenseList";

import DebtForm from "./DebtForm";
import DebtList from "./DebtList";
import DebtSummary from "./DebtSummary";

import BudgetManager from "./BudgetManager";

import Profile from "./Profile";
import Stats from "./Stats";
import Settings from "./Settings";

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Existing states
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // New states
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || []
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedIncomes = localStorage.getItem("incomes");
    const savedExpenses = localStorage.getItem("expenses");
    const savedDebts = localStorage.getItem("debts");
    const savedBudgets = localStorage.getItem("budgets");

    // Handle old single-number income if present (optional migration)
    const oldIncome = localStorage.getItem("income");
    if (oldIncome && !savedIncomes) {
      const oldAmount = Number(oldIncome);
      if (oldAmount > 0) {
        setIncomes([{ category: "Saved Income", amount: oldAmount, id: Date.now() }]);
      }
    } else if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedDebts) setDebts(JSON.parse(savedDebts));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
  }, []);

  // Save to localStorage whenever incomes, expenses, debts, or budget change
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Handlers
  const addIncome = (income) => setIncomes((prev) => [...prev, { ...income, id: Date.now() }]);
  const addExpense = (expense) => setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);
  const addDebt = (debt) => setDebts((prev) => [...prev, { ...debt, id: Date.now() }]);

  const deleteIncome = (id) => setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  const deleteDebt = (id) => setDebts((prev) => prev.filter((d) => d.id !== id));

  const addBudget = (budget) => {
    setBudgets((prev) => {
      const existing = prev.find(b => b.category === budget.category);
      if (existing) {
        return prev.map(b => b.category === budget.category ? { ...b, amount: budget.amount } : b);
      } else {
        return [...prev, { ...budget, id: Date.now() }];
      }
    });
  };

  const deleteBudget = (category) => setBudgets((prev) => prev.filter((b) => b.category !== category));

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <button className="hamburger-btn premium-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="hamburger-icon">☰</span>
        </button>
        <h1 className="dashboard-title">Expense Dashboard</h1>
        <div className="header-actions">
          <div className="user-welcome">
            <span>Welcome back!</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Navigation</h3>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            >
              Dashboard
            </button>

            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            >
              Profile
            </button>

            <button
              className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }}
            >
              Statistics
            </button>

            <button
              className={`nav-item ${activeTab === 'debt' ? 'active' : ''}`}
              onClick={() => { setActiveTab('debt'); setSidebarOpen(false); }}
            >
              Debt
            </button>

            <button
              className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => { setActiveTab('budget'); setSidebarOpen(false); }}
            >
              Budget
            </button>

            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            >
              Settings
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="premium-btn danger logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              <div className="tab-header">
                <h1 className="tab-title">Financial Overview</h1>
                <p className="tab-subtitle">Track your income, expenses, and financial goals</p>
              </div>

              {/* Summary Cards */}
              <div className="summary-section">
                <BalanceSummary totalIncome={totalIncome} expenses={expenses} />
              </div>

              {/* Forms */}
              <div className="forms-section">
                <h2 className="section-title">Add Transactions</h2>
                <div className="forms-grid">
                  <IncomeForm onAddIncome={addIncome} />
                  <ExpenseForm onAddExpense={addExpense} />
                </div>
              </div>

              {/* Lists */}
              <div className="lists-section">
                <div className="list-container">
                  <IncomeList incomes={incomes} onDeleteIncome={deleteIncome} />
                </div>
                <div className="list-container">
                  <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h1 className="tab-title">Profile Settings</h1>
                <p className="tab-subtitle">Manage your account information</p>
              </div>
              <Profile />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-tab">
              <div className="tab-header">
                <h1 className="tab-title">Financial Statistics</h1>
                <p className="tab-subtitle">Detailed analysis of your financial data</p>
              </div>
              <Stats incomes={incomes} expenses={expenses} />
            </div>
          )}

          {activeTab === 'debt' && (
            <div className="debt-tab">
              <div className="tab-header">
                <h1 className="tab-title">Debt Management</h1>
                <p className="tab-subtitle">Track and manage your debts</p>
              </div>
              <div className="debt-content">
                <DebtForm onAddDebt={addDebt} />
                <DebtList debts={debts} onDeleteDebt={deleteDebt} />
                <DebtSummary debts={debts} />
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-tab">
              <div className="tab-header">
                <h1 className="tab-title">Budget Management</h1>
                <p className="tab-subtitle">Set and monitor category budgets</p>
              </div>
              <BudgetManager budgets={budgets} onAddBudget={addBudget} onDeleteBudget={deleteBudget} expenses={expenses} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="tab-header">
                <h1 className="tab-title">Settings</h1>
                <p className="tab-subtitle">Customize your experience</p>
              </div>
              <Settings onLogout={onLogout} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;