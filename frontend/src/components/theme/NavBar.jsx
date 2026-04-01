import React from 'react';
import './NavBar.css'; // We'll create this CSS file
import { useTranslation } from './TranslationContext';
import { useTheme } from './ThemeContext';

const NavBar = ({ onNavigate }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li><button onClick={() => onNavigate('home')}>{t('home')}</button></li>
          <li><button onClick={() => onNavigate('login')}>{t('login')}</button></li>
          <li><button onClick={() => onNavigate('register')}>{t('register')}</button></li>
          <li><button onClick={() => onNavigate('about')}>{t('about')}</button></li>
        </ul>
        <h1 className="navbar-logo">Kipta</h1>
        <div className="navbar-switches">
          <button className="switch-btn theme-switch" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="switch-btn lang-switch" onClick={toggleLanguage}>
            {language === 'en' ? 'EN' : 'BN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;