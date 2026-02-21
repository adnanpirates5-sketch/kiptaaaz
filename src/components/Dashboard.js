import React, { useState } from "react";

const Dashboard = ({ onLogout }) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [category, setCategory] = useState("");

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - totalExpenses;

  const addIncome = () => {
    if (!incomeAmount) return;
    setIncome(income + Number(incomeAmount));
    setIncomeAmount("");
  };

  const addExpense = () => {
    if (!expenseAmount || !category) return;

    setExpenses([
      ...expenses,
      { category, amount: Number(expenseAmount) }
    ]);

    setExpenseAmount("");
    setCategory("");
  };

  return (
    <div className="form-card" style={{ maxWidth: "600px" }}>
      <h2 className="form-title">Expense Dashboard</h2>

      <h3>Balance: ${balance}</h3>
      <p style={{ color: "lightgreen" }}>Income: ${income}</p>
      <p style={{ color: "salmon" }}>Expenses: ${totalExpenses}</p>

      <hr />

      <h3>Add Income</h3>
      <input
        type="number"
        className="input-field"
        placeholder="Amount"
        value={incomeAmount}
        onChange={(e) => setIncomeAmount(e.target.value)}
      />
      <button className="start-btn" onClick={addIncome}>
        Add Income
      </button>

      <hr />

      <h3>Add Expense</h3>
      <input
        type="text"
        className="input-field"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        className="input-field"
        placeholder="Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />

      <button className="start-btn" onClick={addExpense}>
        Add Expense
      </button>

      <hr />

      <h3>Expense List</h3>
      {expenses.length === 0 ? (
        <p>No expenses added yet</p>
      ) : (
        expenses.map((item, index) => (
          <p key={index}>
            {item.category} — ${item.amount}
          </p>
        ))
      )}

      <hr />

      <button className="start-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;