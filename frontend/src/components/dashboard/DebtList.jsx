import React, { useState } from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from '../theme/TranslationContext';
import "./DebtList.css";

const DebtList = ({ debts, onDeleteDebt, onUpdateDebt }) => {
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || debt.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (debts.length === 0) return <p className="description-text">{t('noDebts')}</p>;

  return (
    <div className="debt-list">
      <div className="list-controls">
        <input 
          type="text" 
          placeholder={t('searchByName')} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t('allTypes')}</option>
          <option value="debt">{t('debts')}</option>
          <option value="lending">{t('lendings')}</option>
        </select>
      </div>

      <h3>{t('debtHistory')}</h3>
      <div className="list-items">
        {filteredDebts.length === 0 ? (
          <p className="description-text">{t('noMatches')}</p>
        ) : (
          filteredDebts.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div key={itemId} className={`debt-item ${item.status}`}>
                <div className="item-info">
                  <div className="item-main">
                    <span className={`type-tag ${item.type}`}>
                      {item.type === "debt" ? t('owe') : t('lent')}
                    </span>
                    <span className="name">{item.name}</span>
                  </div>
                  {item.dueDate && (
                    <span className="due-date">{t('due')}: {new Date(item.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="item-actions">
                  <span className="amount">{currency} {item.amount.toLocaleString()}</span>
                  <div className="btn-group">
                    <button 
                      className={`status-btn ${item.status}`}
                      onClick={() => onUpdateDebt(itemId, { status: item.status === 'paid' ? 'pending' : 'paid' })}
                      title={item.status === 'paid' ? t('markAsPending') : t('markAsPaid')}
                    >
                      {item.status === 'paid' ? "✅" : "⏳"}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteDebt(itemId)}
                      title={t('delete')}
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
