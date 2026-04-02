import React from 'react';
import './NavBar.css';
import { useTranslation } from './TranslationContext';
import { useTheme } from './ThemeContext';

const NavBar = ({ onNavigate }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-logo">Kiptaaz</h1>
          <div className="brand-accent"></div>
        </div>

        <ul className="navbar-menu">
          <li>
            <button className="nav-link" onClick={() => onNavigate('home')}>
              <span className="nav-icon">🏠</span>
              {t('home')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('login')}>
              <span className="nav-icon">🔐</span>
              {t('login')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('register')}>
              <span className="nav-icon">✨</span>
              {t('register')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('about')}>
              <span className="nav-icon">ℹ️</span>
              {t('about')}
            </button>
          </li>
        </ul>

        <div className="navbar-controls">
          <button className="control-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            <span className="control-icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>
          <button className="control-btn lang-toggle" onClick={toggleLanguage} title="Switch Language">
            <span className="control-text">
              {language === 'en' ? 'EN' : 'BN'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;