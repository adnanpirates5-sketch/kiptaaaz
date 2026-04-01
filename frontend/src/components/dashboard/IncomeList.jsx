import React from "react";
import { useCurrency } from "../theme/useCurrency";

const IncomeList = ({ incomes, onDeleteIncome }) => {
  const { currency } = useCurrency();
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
            <span>{currency} {inc.amount}</span>
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