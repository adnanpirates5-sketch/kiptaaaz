import React from "react";
import { useCurrency } from "../theme/useCurrency";
import "./DebtList.css";

const DebtList = ({ debts, onDeleteDebt }) => {
  const { currency } = useCurrency();
  if (debts.length === 0) return <p>No debts or lendings added yet.</p>;

  return (
    <div className="debt-list">
      <h3>Debt & Lending List</h3>
      <ul>
        {debts.map((item) => (
          <li key={item.id}>
            <span>
              {item.type === "debt" ? "Owe to" : "Lent to"} {item.name}
            </span>
            <span>{currency} {item.amount}</span>
            <button onClick={() => onDeleteDebt(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebtList;