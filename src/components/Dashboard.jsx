import React, { useState, useEffect } from "react";
import BalanceSummary from "./BalanceSummary";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import IncomeList from "./IncomeList";
import ExpenseList from "./ExpenseList";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary"; // <-- New import

const Dashboard = ({ onLogout }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedIncomes = localStorage.getItem("incomes");
    const savedExpenses = localStorage.getItem("expenses");

    // Handle old single-number income if present (optional migration)
    const oldIncome = localStorage.getItem("income");
    if (oldIncome && !savedIncomes) {
      // Convert old single income to an array with a default category
      const oldAmount = Number(oldIncome);
      if (oldAmount > 0) {
        setIncomes([{ category: "Saved Income", amount: oldAmount, id: Date.now() }]);
      }
    } else if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save to localStorage whenever incomes or expenses change
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [incomes, expenses]);

  const addIncome = (income) => {
    setIncomes((prev) => [...prev, { ...income, id: Date.now() }]);
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);
  };

  const deleteIncome = (id) => {
    setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Calculate total income
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>

      <BalanceSummary totalIncome={totalIncome} expenses={expenses} />

      <div className="forms-row">
        <IncomeForm onAddIncome={addIncome} />
        <ExpenseForm onAddExpense={addExpense} />
      </div>

      <IncomeList incomes={incomes} onDeleteIncome={deleteIncome} />
      <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />

      {/* Two category summaries side by side or stacked */}
      <div className="summaries-row">
        <IncomeCategorySummary incomes={incomes} />
        <CategorySummary expenses={expenses} />
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;