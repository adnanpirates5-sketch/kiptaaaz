import React from 'react';
import './NavBar.css'; // We'll create this CSS file
import { useTranslation } from './TranslationContext';

const NavBar = ({ onNavigate, theme, onThemeToggle, language, onLanguageToggle }) => {
  const { t } = useTranslation();

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
          <button className="switch-btn theme-switch" onClick={onThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="switch-btn lang-switch" onClick={onLanguageToggle}>
            {language === 'en' ? 'EN' : 'BN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;