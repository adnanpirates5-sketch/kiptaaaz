import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import { useTranslation } from './theme/TranslationContext';

const AboutUs = ({ onBackHome }) => {
  const { t } = useTranslation();

  return (
    <div className="about-us">
      <button className="back-home-btn" onClick={onBackHome} title={t('backToHome')}>
        ← {t('backToHome')}
      </button>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t('aboutKipta')}</h1>
          <p className="hero-subtitle">
            {t('subtitle')}
          </p>
          <div className="hero-stats">
            <div className="stat">
              <h3>10K+</h3>
              <p>{t('activeUsers')}</p>
            </div>
            <div className="stat">
              <h3>$2M+</h3>
              <p>{t('moneySaved')}</p>
            </div>
            <div className="stat">
              <h3>4.8★</h3>
              <p>{t('userRating')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2>{t('ourMission')}</h2>
          <p>
            {t('teamDesc')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>{t('whyChooseKipta')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>{t('smartAnalytics')}</h3>
              <p>{t('smartAnalyticsDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t('goalTracking')}</h3>
              <p>{t('goalTrackingDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>{t('securePrivate')}</h3>
              <p>{t('securePrivateDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t('crossPlatform')}</h3>
              <p>{t('crossPlatformDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>{t('aiInsights')}</h3>
              <p>{t('aiInsightsDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t('multiCurrency')}</h3>
              <p>{t('multiCurrencyDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>{t('meetOurTeam')}</h2>
          <p>{t('teamDesc')}</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>{t('devTeam')}</h3>
              <p>{t('devTeamDesc')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">📈</div>
              <h3>{t('finExperts')}</h3>
              <p>{t('finExpertsDesc')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🎨</div>
              <h3>{t('uxDesigners')}</h3>
              <p>{t('uxDesignersDesc')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;