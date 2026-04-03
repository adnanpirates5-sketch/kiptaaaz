import React, { useState } from "react";
import { useCurrency } from "../theme/useCurrency";
import "./DebtList.css";

const DebtList = ({ debts, onDeleteDebt, onUpdateDebt }) => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || debt.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (debts.length === 0) return <p className="description-text">No debts or lendings added yet.</p>;

  return (
    <div className="debt-list">
      <div className="list-controls">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="debt">Debts</option>
          <option value="lending">Lendings</option>
        </select>
      </div>

      <h3>Debt & Lending History</h3>
      <div className="list-items">
        {filteredDebts.length === 0 ? (
          <p className="description-text">No matches found.</p>
        ) : (
          filteredDebts.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div key={itemId} className={`debt-item ${item.status}`}>
                <div className="item-info">
                  <div className="item-main">
                    <span className={`type-tag ${item.type}`}>
                      {item.type === "debt" ? "Owe" : "Lent"}
                    </span>
                    <span className="name">{item.name}</span>
                  </div>
                  {item.dueDate && (
                    <span className="due-date">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="item-actions">
                  <span className="amount">{currency} {item.amount.toLocaleString()}</span>
                  <div className="btn-group">
                    <button 
                      className={`status-btn ${item.status}`}
                      onClick={() => onUpdateDebt(itemId, { status: item.status === 'paid' ? 'pending' : 'paid' })}
                      title={item.status === 'paid' ? "Mark as Pending" : "Mark as Paid"}
                    >
                      {item.status === 'paid' ? "✅" : "⏳"}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteDebt(itemId)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DebtList;
