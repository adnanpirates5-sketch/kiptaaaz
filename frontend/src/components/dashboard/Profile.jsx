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
      {/* Instagram-Style Premium Header */}
      <div className="profile-header-instagram">
        {/* Cover Image Area */}
        <div className="profile-cover-area"></div>
        
        {/* Main Profile Section */}
        <div className="profile-main-section">
          {/* Avatar with Edit */}
          <div className="profile-avatar-container">
            <div className="avatar-wrapper" onClick={handleAvatarClick} title={t('changePhoto')}>
              <div className="profile-avatar-instagram">
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
          </div>

          {/* User Info */}
          <div className="profile-user-info">
            <div className="profile-name-section">
              <h1 className="profile-name-instagram">{user.name || t('user')}</h1>
              <span className="status-indicator-instagram active">✓ {t('activeVerified')}</span>
            </div>
            <p className="profile-email-instagram">{user.email || t('noEmail')}</p>
            <p className="profile-level-instagram">🏆 {getAccountLevel()}</p>
            {error && <div className="profile-error-msg">{error}</div>}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats-instagram">
          <div className="stat-item-instagram">
            <span className="stat-number">{transactionCount}</span>
            <span className="stat-label-instagram">{t('transactionsCount')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-instagram">
            <span className="stat-number" style={{color: 'var(--success)'}}>
              {(((transactionCount/500)*100).toFixed(0))}%
            </span>
            <span className="stat-label-instagram">{t('dataUsage')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-instagram">
            <span className="stat-number" style={{color: 'var(--primary)'}}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {month: 'short', year: '2-digit'}) : 'N/A'}
            </span>
            <span className="stat-label-instagram">{t('memberSince')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards with Icons */}
      <div className="profile-stats-container">
        <div className="stat-card-premium income-card">
          <div className="stat-icon income-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">{t('totalEarnings')}</p>
            <p className="stat-value">{formatValue(totalIncome)}</p>
          </div>
          <div className="stat-bg-decoration income-decoration"></div>
        </div>

        <div className="stat-card-premium expense-card">
          <div className="stat-icon expense-icon">💸</div>
          <div className="stat-content">
            <p className="stat-label">{t('totalSpending')}</p>
            <p className="stat-value">{formatValue(totalExpense)}</p>
          </div>
          <div className="stat-bg-decoration expense-decoration"></div>
        </div>

        <div className="stat-card-premium debt-card">
          <div className="stat-icon debt-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">{t('activeDebts')}</p>
            <p className="stat-value" style={{ color: totalDebt > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {formatValue(totalDebt)}
            </p>
          </div>
          <div className="stat-bg-decoration debt-decoration"></div>
        </div>

        <div className="stat-card-premium transaction-card">
          <div className="stat-icon transaction-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">{t('transactionsCount')}</p>
            <p className="stat-value">{transactionCount}</p>
          </div>
          <div className="stat-bg-decoration transaction-decoration"></div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="profile-details-grid">
        {/* Account Information */}
        <div className="profile-detail-card">
          <div className="detail-header">
            <h3 className="detail-title">👤 {t('accountInfo')}</h3>
            <div className="detail-divider"></div>
          </div>
          
          <div className="detail-items">
            <div className="detail-item">
              <span className="detail-label">{t('fullName')}</span>
              <span className="detail-value">{user.name || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">{t('emailAddress')}</span>
              <span className="detail-value email-value">{user.email || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">{t('memberSince')}</span>
              <span className="detail-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Account Status */}
        <div className="profile-detail-card">
          <div className="detail-header">
            <h3 className="detail-title">🛡️ {t('securityStatus')}</h3>
            <div className="detail-divider"></div>
          </div>
          
          <div className="detail-items">
            <div className="detail-item">
              <span className="detail-label">{t('accountStatus')}</span>
              <div className="status-badge-inline active">
                <span className="status-indicator-dot"></span>
                {t('activeVerified')}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('dataUsage')}</span>
              <div className="usage-info">
                <div className="usage-stats">
                  <span>{transactionCount} {t('transactionsCount')}</span>
                  <span className="usage-percent">{((transactionCount/500)*100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar-modern">
                  <div className="progress-fill" style={{ width: `${Math.min((transactionCount/500)*100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;