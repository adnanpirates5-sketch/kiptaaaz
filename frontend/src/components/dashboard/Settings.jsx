import React from "react";
import { useTranslation } from "../theme/TranslationContext";
import { useTheme } from "../theme/ThemeContext";
import { useCurrency } from "../theme/useCurrency";
import "./Settings.css";

const Settings = ({ onLogout }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currency, changeCurrency } = useCurrency();

  const currencies = [
    { symbol: '৳', name: 'BDT' },
    { symbol: '$', name: 'USD' },
  ];

  return (
    <div className="settings-container-premium animate-fade-in">
      <div className="settings-header-premium">
        <h2>{t('settings')}</h2>
        <p className="settings-subtitle">Manage your account preferences and application configuration</p>
      </div>

      <div className="settings-grid">
        {/* Appearance & Language */}
        <div className="premium-card settings-group-card">
          <div className="settings-group-header">
            <span className="settings-group-icon">🎨</span>
            <h4>Preferences</h4>
          </div>
          
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">{t('darkMode')}</span>
              <span className="setting-description">Switch between light and dark visual modes</span>
            </div>
            <div 
              className={`premium-toggle ${theme === 'dark' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              <div className="toggle-knob"></div>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">{t('language')}</span>
              <span className="setting-description">Choose your preferred interface language</span>
            </div>
            <button 
              onClick={toggleLanguage} 
              className="premium-btn secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {language === 'en' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>

        {/* Currency Settings */}
        <div className="premium-card settings-group-card">
          <div className="settings-group-header">
            <span className="settings-group-icon">💰</span>
            <h4>{t('currency')}</h4>
          </div>
          <div className="setting-info" style={{ marginBottom: '1rem' }}>
            <span className="setting-description">Select the primary currency for your transactions and reports</span>
          </div>
          <div className="currency-grid">
            {currencies.map((curr) => (
              <div
                key={curr.symbol}
                onClick={() => changeCurrency(curr.symbol)}
                className={`currency-option ${currency === curr.symbol ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.25rem' }}>{curr.symbol}</span>
                <span>{curr.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="premium-card logout-zone">
        <div className="logout-text">
          <h4>Account Session</h4>
          <span className="setting-description">Sign out of your account on this device</span>
        </div>
        <button onClick={onLogout} className="premium-btn danger" style={{ background: 'var(--danger)' }}>
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Settings;