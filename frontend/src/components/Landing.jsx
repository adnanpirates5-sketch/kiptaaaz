import React from "react";
import { useTranslation } from "./theme/TranslationContext";
import "./Landing.css";

const Landing = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="premium-title animate-fade-in-up">
              {t('welcome')}
            </h1>
            <p className="premium-subtitle animate-fade-in-up">
              {t('subtitle')}
            </p>

            <div className="hero-features animate-fade-in-up">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Smart Analytics</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Goal Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Secure & Private</span>
              </div>
            </div>

            <div className="hero-actions animate-fade-in-up">
              <button className="premium-btn" onClick={onGetStarted}>
                <span className="btn-icon">🚀</span>
                {t('getStarted')}
              </button>
              <button className="premium-btn ghost">
                <span className="btn-icon">📖</span>
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-visual animate-slide-in-right">
            <div className="visual-card">
              <div className="card-header">
                <div className="avatar">💰</div>
                <div className="card-info">
                  <h3>Monthly Budget</h3>
                  <p>$2,450.00</p>
                </div>
              </div>
              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="progress-text">$1,837.50 spent</p>
              </div>
            </div>

            <div className="floating-elements">
              <div className="floating-card card-1">
                <span className="emoji">📈</span>
                <span className="text">+12%</span>
              </div>
              <div className="floating-card card-2">
                <span className="emoji">💡</span>
                <span className="text">AI Insights</span>
              </div>
              <div className="floating-card card-3">
                <span className="emoji">🎯</span>
                <span className="text">Goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card animate-slide-in-left">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card animate-fade-in-up">
            <div className="stat-number">$2M+</div>
            <div className="stat-label">Money Saved</div>
          </div>
          <div className="stat-card animate-slide-in-right">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;