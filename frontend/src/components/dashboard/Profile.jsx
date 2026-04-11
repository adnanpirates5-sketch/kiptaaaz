import React, { useState, useRef } from "react";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";
import { authAPI } from "../../api";
import "./Profile.css";

const Profile = ({ incomes, expenses, debts }) => {
  const { t } = useTranslation();
  const { currency, convert } = useCurrency();
  const fileInputRef = useRef(null);
  
  // Get user from localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDebt = debts.filter(d => d.type === 'debt').reduce((sum, d) => sum + d.amount, 0);
  const transactionCount = incomes.length + expenses.length;

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${currency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  
  const getInitials = (name) => {
    if (!name) {
      const savedUser = JSON.parse(localStorage.getItem('user')) || {};
      name = savedUser.name || "U";
    }
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getAccountLevel = () => {
    if (transactionCount > 50) return t('financePro');
    if (transactionCount > 20) return t('regularSaver');
    return t('newMember');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      setError(t('imageSizeLimit'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        setLoading(true);
        setError("");
        const res = await authAPI.updateProfile({ profilePicture: base64String });
        
        // Update local state and localStorage
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify other components (like Dashboard sidebar)
        window.dispatchEvent(new Event('userUpdate'));
      } catch (err) {
        setError(err.response?.data?.message || t('uploadFailed'));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container-premium animate-fade-in">
      {/* Header Card */}
      <div className="premium-card profile-header-card">
        <div className="profile-header-bg"></div>
        <div className="avatar-wrapper" onClick={handleAvatarClick} title={t('changePhoto')}>
          <div className="profile-avatar-large">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="avatar-img" />
            ) : (
              getInitials(user.name)
            )}
            <div className="avatar-overlay">
              <span>📷</span>
            </div>
          </div>
          {loading && <div className="avatar-loader"></div>}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        
        <div className="profile-header-info">
          <h2>{user.name || t('user')}</h2>
          <div className="profile-email-badge">{user.email || t('noEmail')}</div>
          {error && <div className="profile-error-msg">{error}</div>}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <span className="achievement-badge">🏆 {getAccountLevel()}</span>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="profile-stats-grid">
        <div className="premium-card stat-metric-card income" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">{t('totalEarnings')}</span>
          <span className="metric-value">{formatValue(totalIncome)}</span>
        </div>
        <div className="premium-card stat-metric-card expense" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">{t('totalSpending')}</span>
          <span className="metric-value">{formatValue(totalExpense)}</span>
        </div>
        <div className="premium-card stat-metric-card balance" style={{ borderLeftWidth: '4px' }}>
          <span className="metric-label">{t('activeDebts')}</span>
          <span className="metric-value" style={{ color: totalDebt > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {formatValue(totalDebt)}
          </span>
        </div>
      </div>

      <div className="profile-info-grid">
        {/* Account Details */}
        <div className="premium-card info-group">
          <div className="settings-group-header">
            <span className="settings-group-icon">👤</span>
            <h4>{t('accountInfo')}</h4>
          </div>
          
          <div className="info-item">
            <span className="info-label">{t('fullName')}</span>
            <span className="info-value">{user.name || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">{t('emailAddress')}</span>
            <span className="info-value">{user.email || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">{t('memberSince')}</span>
            <span className="info-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { 
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
            <h4>{t('securityStatus')}</h4>
          </div>
          
          <div className="info-item">
            <span className="info-label">{t('accountStatus')}</span>
            <div className="account-status-card">
              <div className="status-indicator"></div>
              <span className="info-value" style={{ color: 'var(--success)' }}>{t('activeVerified')}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">{t('dataUsage')}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span className="info-value">{transactionCount} {t('transactionsCount')}</span>
              <span className="info-value" style={{ color: 'var(--text-muted)' }}>{((transactionCount/500)*100).toFixed(1)}% {t('ofLimit')}</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((transactionCount/500)*100, 100)}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">{t('twoFactor')}</span>
            <span className="info-value" style={{ color: 'var(--text-muted)' }}>{t('notEnabled')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;