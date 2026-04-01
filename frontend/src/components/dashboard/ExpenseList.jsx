import React from "react";

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return <p>No expenses added yet.</p>;
  }

  return (
    <div className="expense-list">
      <h3>Expense List</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <span>{exp.category}</span>
            <span>৳ {exp.amount}</span>
            <button onClick={() => onDeleteExpense(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;