import React from "react";
import { useCurrency } from "../theme/useCurrency";

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const { currency } = useCurrency();
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
            <span>{currency} {exp.amount}</span>
            <button onClick={() => onDeleteExpense(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;