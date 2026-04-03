import React from "react";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";
import "./Profile.css";

const Profile = ({ incomes, expenses, debts }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDebt = debts.filter(d => d.type === 'debt').reduce((sum, d) => sum + d.amount, 0);
  const transactionCount = incomes.length + expenses.length;
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getAccountLevel = () => {
    if (transactionCount > 50) return "Finance Pro";
    if (transactionCount > 20) return "Regular Saver";
    return "New Member";
  };

  return (
    <div className="profile-container-premium animate-fade-in">
      {/* Header Card */}
      <div className="premium-card profile-header-card">
        <div className="profile-header-bg"></div>
        <div className="profile-avatar-large">
          {getInitials(user.name)}
        </div>
        <div className="profile-header-info">
          <h2>{user.name || 'User'}</h2>
          <div className="profile-email-badge">{user.email || 'No email provided'}</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <span className="achievement-badge">🏆 {getAccountLevel()}</span>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="profile-stats-grid">
        <div className="premium-card stat-metric-card income" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">Total Earnings</span>
          <span className="metric-value">{currency} {totalIncome.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card expense" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">Total Spending</span>
          <span className="metric-value">{currency} {totalExpense.toLocaleString()}</span>
        </div>
        <div className="premium-card stat-metric-card balance" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">Active Debts</span>
          <span className="metric-value" style={{ color: totalDebt > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {currency} {totalDebt.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="profile-info-grid">
        {/* Account Details */}
        <div className="premium-card info-group">
          <div className="settings-group-header">
            <span className="settings-group-icon">👤</span>
            <h4>Account Information</h4>
          </div>
          
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">{user.name || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Email Address</span>
            <span className="info-value">{user.email || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Security & Status */}
        <div className="premium-card info-group">
          <div className="settings-group-header">
            <span className="settings-group-icon">🛡️</span>
            <h4>Security & Status</h4>
          </div>
          
          <div className="info-item">
            <span className="info-label">Account Status</span>
            <div className="account-status-card">
              <div className="status-indicator"></div>
              <span className="info-value" style={{ color: 'var(--success)' }}>Active & Verified</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">Data Usage</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span className="info-value">{transactionCount} Transactions</span>
              <span className="info-value" style={{ color: 'var(--text-muted)' }}>{((transactionCount/500)*100).toFixed(1)}% of limit</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((transactionCount/500)*100, 100)}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">Two-Factor Authentication</span>
            <span className="info-value" style={{ color: 'var(--text-muted)' }}>Not Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;