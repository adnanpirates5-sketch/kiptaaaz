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

import { useTranslation } from "../theme/TranslationContext";

const Dashboard = ({ onLogout }) => {
  const { t } = useTranslation();
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h2>Expense Dashboard</h2>
      </div>
      <div className="dashboard-main">
        <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h3>Menu</h3>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>Dashboard</button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>Profile</button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }}>Stats</button>
          <button className={activeTab === 'debt' ? 'active' : ''} onClick={() => { setActiveTab('debt'); setSidebarOpen(false); }}>Debt</button>
          <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => { setActiveTab('budget'); setSidebarOpen(false); }}>Budget</button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>Settings</button>
        </div>
        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <>
              <h2>{t('expenseDashboard')}</h2>

              {/* Summary Cards */}
              <BalanceSummary totalIncome={totalIncome} expenses={expenses} />

              {/* Forms */}
              <div className="forms-row">
                <IncomeForm onAddIncome={addIncome} />
                <ExpenseForm onAddExpense={addExpense} />
              </div>

              {/* Lists */}
              <IncomeList incomes={incomes} onDeleteIncome={deleteIncome} />
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />

              {/* Category Summaries */}
              <div className="summaries-row">
              </div>

              {/* Logout */}
              <button className="logout-btn" onClick={onLogout}>
                {t('logout')}
              </button>
            </>
          )}
          {activeTab === 'profile' && (
            <>
              <h2>{t('profileTitle')}</h2>
              <Profile />
            </>
          )}
          {activeTab === 'stats' && (
            <>
              <h2>{t('statsTitle')}</h2>
              <Stats incomes={incomes} expenses={expenses} />
            </>
          )}
          {activeTab === 'debt' && (
            <>
              <h2>Debt Management</h2>
              <DebtForm onAddDebt={addDebt} />
              <DebtList debts={debts} onDeleteDebt={deleteDebt} />
              <DebtSummary debts={debts} />
            </>
          )}
          {activeTab === 'budget' && (
            <>
              <h2>Budget Management</h2>
              <BudgetManager budgets={budgets} onAddBudget={addBudget} onDeleteBudget={deleteBudget} expenses={expenses} />
            </>
          )}
          {activeTab === 'settings' && (
            <>
              <h2>{t('settingsTitle')}</h2>
              <Settings onLogout={onLogout} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;