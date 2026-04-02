import React from "react";
import { useTranslation } from "./theme/TranslationContext";
import "./Landing.css";

const Landing = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="landing-page animate-fade-in">
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              {t('welcome')}
            </h1>
            <p>
              {t('subtitle')}
            </p>

            <div className="hero-features">
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

            <div className="hero-actions">
              <button className="premium-btn" onClick={onGetStarted}>
                {t('getStarted')}
              </button>
              <button className="premium-btn secondary">
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-visual">
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
                <span>📈</span>
                <span>+12%</span>
              </div>
              <div className="floating-card card-2">
                <span>💡</span>
                <span>AI Insights</span>
              </div>
              <div className="floating-card card-3">
                <span>🎯</span>
                <span>Goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">$2M+</div>
            <div className="stat-label">Money Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;