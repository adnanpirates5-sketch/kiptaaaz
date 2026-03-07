import React, { useState } from "react";
import "./DebtForm.css";

const DebtForm = ({ onAddDebt }) => {
  const [type, setType] = useState("debt");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !amount || num <= 0) return;
    onAddDebt({ type, name: name.trim(), amount: num, id: Date.now() });
    setName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form debt-form">
      <h3>Add Debt / Lending</h3>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="debt">Debt (You owe)</option>
        <option value="lending">Lending (You lent)</option>
      </select>
      <input
        type="text"
        placeholder="Person / Source"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default DebtForm;