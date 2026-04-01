import React from "react";
import { useTranslation } from "../theme/TranslationContext";
import { useTheme } from "../theme/ThemeContext";
import { useCurrency } from "../theme/useCurrency";

const Settings = ({ onLogout }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currency, changeCurrency } = useCurrency();

  const currencies = [
    { symbol: '৳', name: 'BDT' },
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'EUR' },
    { symbol: '£', name: 'GBP' },
    { symbol: '¥', name: 'JPY' },
  ];

  return (
    <div className="settings-section">
      <h3>{t('settings')}</h3>
      <div className="settings-options">
        <div className="setting-item">
          <label>{t('darkMode')}:</label>
          <button onClick={toggleTheme} className="toggle-btn">
            {theme === 'dark' ? t('on') : t('off')}
          </button>
        </div>
        <div className="setting-item">
          <label>{t('language')}:</label>
          <button onClick={toggleLanguage} className="toggle-btn">
            {language === 'en' ? 'English' : 'বাংলা'}
          </button>
        </div>
        <div className="setting-item">
          <label>{t('currency')}:</label>
          <div className="currency-buttons">
            {currencies.map((curr) => (
              <button
                key={curr.symbol}
                onClick={() => changeCurrency(curr.symbol)}
                className={`currency-btn ${currency === curr.symbol ? 'active' : ''}`}
              >
                {curr.symbol} {curr.name}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-item">
          <label>{t('logout')}:</label>
          <button onClick={onLogout} className="logout-btn">
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;