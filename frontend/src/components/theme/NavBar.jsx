import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { useTranslation } from './TranslationContext';
import { useTheme } from './ThemeContext';

const NavBar = ({ onNavigate }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('home')}>
          <h1 className="navbar-logo">{t('kiptaaz')}</h1>
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
          <button className="control-btn theme-toggle" onClick={toggleTheme} title={t('toggleTheme')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="control-btn lang-toggle" onClick={toggleLanguage} title={t('switchLanguage')}>
            {language === 'en' ? 'EN' : 'BN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;