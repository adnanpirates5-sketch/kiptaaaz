import React from 'react';
import './NavBar.css';
import { useTranslation } from './TranslationContext';
import { useTheme } from './ThemeContext';

const NavBar = ({ onNavigate }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('home')}>
          <h1 className="navbar-logo">Kiptaaz</h1>
        </div>

        <ul className="navbar-menu">
          <li>
            <button className="nav-link" onClick={() => onNavigate('home')}>
              {t('home')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('login')}>
              {t('login')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('register')}>
              {t('register')}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => onNavigate('about')}>
              {t('about')}
            </button>
          </li>
        </ul>

        <div className="navbar-controls">
          <button className="control-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="control-btn lang-toggle" onClick={toggleLanguage} title="Switch Language">
            {language === 'en' ? 'EN' : 'BN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;