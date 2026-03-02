import React, { useState, useEffect } from "react";
import BalanceSummary from "./BalanceSummary";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import CategorySummary from "./CategorySummary";

const Dashboard = ({ onLogout }) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedIncome = localStorage.getItem("income");
    const savedExpenses = localStorage.getItem("expenses");
    if (savedIncome) setIncome(Number(savedIncome));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save to localStorage whenever income or expenses change
  useEffect(() => {
    localStorage.setItem("income", income);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [income, expenses]);

  const addIncome = (amount) => {
    setIncome((prev) => prev + amount);
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]); // simple unique id
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>

      <BalanceSummary income={income} expenses={expenses} />

      <div className="forms-row">
        <IncomeForm onAddIncome={addIncome} />
        <ExpenseForm onAddExpense={addExpense} />
      </div>

      <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />

      <CategorySummary expenses={expenses} />

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;