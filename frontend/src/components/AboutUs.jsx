import React from 'react';
import './AboutUs.css';
import { useTranslation } from './theme/TranslationContext';

const AboutUs = ({ onBackHome }) => {
  const { t } = useTranslation();

  return (
    <div className="about-us">
      <button className="back-home-btn" onClick={onBackHome} title={t('backToHome')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        {t('backToHome')}
      </button>

      {/* Hero Section */}
      <section className="about-hero">
        <span className="hero-badge">{t('kiptaaz')}</span>
        <h1>{t('aboutKipta')}</h1>
        <p className="hero-description">
          {t('subtitle')}
        </p>
      </section>

      {/* Mission Narrative */}
      <section className="narrative-section">
        <div className="narrative-grid">
          <div className="narrative-content">
            <h2>{t('ourMission')}</h2>
            <p>{t('teamDesc')}</p>
          </div>
          <div className="narrative-visual">
            🎯
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="showcase-section">
        <div className="showcase-header">
          <h2>{t('whyChooseKipta')}</h2>
        </div>
        <div className="showcase-grid">
          <div className="showcase-card">
            <div className="card-icon">📊</div>
            <h3>{t('smartAnalytics')}</h3>
            <p>{t('smartAnalyticsDesc')}</p>
          </div>
          <div className="showcase-card">
            <div className="card-icon">🎯</div>
            <h3>{t('goalTracking')}</h3>
            <p>{t('goalTrackingDesc')}</p>
          </div>
          <div className="showcase-card">
            <div className="card-icon">🔒</div>
            <h3>{t('securePrivate')}</h3>
            <p>{t('securePrivateDesc')}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>{t('meetOurTeam')}</h2>
        <div className="team-members-grid">
          <div className="member-card">
            <div className="avatar-circle">👨‍💻</div>
            <h3>{t('devTeam')}</h3>
            <p>{t('devTeamDesc')}</p>
          </div>
          <div className="member-card">
            <div className="avatar-circle">📈</div>
            <h3>{t('finExperts')}</h3>
            <p>{t('finExpertsDesc')}</p>
          </div>
          <div className="member-card">
            <div className="avatar-circle">🎨</div>
            <h3>{t('uxDesigners')}</h3>
            <p>{t('uxDesignersDesc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
