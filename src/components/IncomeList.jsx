import React from "react";

const IncomeList = ({ incomes, onDeleteIncome }) => {
  if (incomes.length === 0) {
    return <p>No income added yet.</p>;
  }

  return (
    <div className="income-list">
      <h3>Income List</h3>
      <ul>
        {incomes.map((inc) => (
          <li key={inc.id}>
            <span>{inc.category}</span>
            <span>৳ {inc.amount}</span>
            {onDeleteIncome && (
              <button onClick={() => onDeleteIncome(inc.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;