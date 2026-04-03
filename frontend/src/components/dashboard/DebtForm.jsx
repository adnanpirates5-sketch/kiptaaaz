import React, { useState } from "react";
import "./DebtForm.css";

const DebtForm = ({ onAddDebt }) => {
  const [type, setType] = useState("debt");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !amount || num <= 0) return;
    onAddDebt({ 
      type, 
      name: name.trim(), 
      amount: num, 
      dueDate: dueDate || undefined,
      status: "pending" 
    });
    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Add Debt / Lending</h3>
      
      <div className="form-group">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="premium-input"
        >
          <option value="debt">Debt (You owe)</option>
          <option value="lending">Lending (You lent)</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Person / Source"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="premium-input"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          className="premium-input"
          required
        />
      </div>

      <div className="form-group">
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
          Due Date (Optional)
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="premium-input"
        />
      </div>

      <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
        Add Entry
      </button>
    </form>
  );
};

export default DebtForm;
