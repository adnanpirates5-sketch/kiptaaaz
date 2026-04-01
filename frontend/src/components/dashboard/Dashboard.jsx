import React, { useState, useEffect } from "react";

import BalanceSummary from "./BalanceSummary";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import IncomeList from "./IncomeList";
import ExpenseList from "./ExpenseList";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary";

import DebtForm from "./DebtForm";
import DebtList from "./DebtList";
import DebtSummary from "./DebtSummary";

import BudgetForm from "./BudgetForm";
import BudgetSummary from "./BudgetSummary";
import { useTranslation } from "../theme/TranslationContext";

const Dashboard = ({ onLogout }) => {
  const { t } = useTranslation();
  // Existing states
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // New states
  const [debts, setDebts] = useState([]);
  const [budget, setBudget] = useState(
    Number(localStorage.getItem("budget")) || 0
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedIncomes = localStorage.getItem("incomes");
    const savedExpenses = localStorage.getItem("expenses");
    const savedDebts = localStorage.getItem("debts");

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
    localStorage.setItem("budget", budget);
  }, [budget]);

  // Handlers
  const addIncome = (income) => setIncomes((prev) => [...prev, { ...income, id: Date.now() }]);
  const addExpense = (expense) => setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);
  const addDebt = (debt) => setDebts((prev) => [...prev, { ...debt, id: Date.now() }]);

  const deleteIncome = (id) => setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  const deleteDebt = (id) => setDebts((prev) => prev.filter((d) => d.id !== id));

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>

      {/* Summary Cards */}
      <BalanceSummary totalIncome={totalIncome} expenses={expenses} />

      {/* Forms */}
      <div className="forms-row">
        <IncomeForm onAddIncome={addIncome} />
        <ExpenseForm onAddExpense={addExpense} />
        <DebtForm onAddDebt={addDebt} />
        <BudgetForm budget={budget} setBudget={setBudget} />
      </div>

      {/* Lists */}
      <IncomeList incomes={incomes} onDeleteIncome={deleteIncome} />
      <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
      <DebtList debts={debts} onDeleteDebt={deleteDebt} />

      {/* Category Summaries */}
      <div className="summaries-row">
        <IncomeCategorySummary incomes={incomes} />
        <CategorySummary expenses={expenses} />
        <DebtSummary debts={debts} />
        <BudgetSummary budget={budget} expenses={expenses} />
      </div>

      {/* Logout */}
      <button className="logout-btn" onClick={onLogout}>
        {t('logout')}
      </button>
    </div>
  );
};

export default Dashboard;