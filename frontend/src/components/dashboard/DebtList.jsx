import React, { useState } from "react";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from '../theme/TranslationContext';
import "./DebtList.css";

const DebtList = ({ debts, onDeleteDebt, onUpdateDebt }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || debt.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    if (debts.length === 0) {
      alert(t('noDebts'));
      return;
    }

    const csvData = debts.map(debt => ({
      'Name': debt.name,
      'Type': debt.type === 'debt' ? t('owe') : t('lent'),
      'Amount': convert(debt.amount).toFixed(2),
      'Status': debt.status === 'paid' ? 'Paid' : 'Pending',
      'Due Date': debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'N/A',
      'Currency': currency
    }));

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `debts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>{t('debtHistory')}</h3>
        {debts.length > 0 && (
          <button 
            onClick={exportToCSV}
            title="Export to CSV"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
            }}
          >
            📥 Export CSV
          </button>
        )}
      </div>
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
                  <span className="amount">{formatValue(item.amount)}</span>
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
