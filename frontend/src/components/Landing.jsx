import React, { useState } from "react";
import { useTranslation } from "./theme/TranslationContext";
import Modal from "./Modal";
import UserGuide from "./UserGuide";
import "./Landing.css";

const Landing = ({ onGetStarted }) => {
  const { t } = useTranslation();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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
                <span>{t('smartAnalytics')}</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>{t('goalTracking')}</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>{t('securePrivate')}</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="premium-btn" onClick={onGetStarted}>
                {t('getStarted')}
              </button>
              <button 
                className="premium-btn secondary" 
                onClick={() => setIsGuideOpen(true)}
              >
                {t('learnMore')}
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="card-header">
                <div className="avatar">💰</div>
                <div className="card-info">
                  <h3>{t('monthlyBudget')}</h3>
                  <p>$2,450.00</p>
                </div>
              </div>
              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="progress-text">$1,837.50 {t('spent')}</p>
              </div>
            </div>

            <div className="floating-elements">
              <div className="floating-card card-1">
                <span>📈</span>
                <span>+12%</span>
              </div>
              <div className="floating-card card-2">
                <span>💡</span>
                <span>{t('aiInsights')}</span>
              </div>
              <div className="floating-card card-3">
                <span>🎯</span>
                <span>{t('goals')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">{t('activeUsers')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">$2M+</div>
            <div className="stat-label">{t('moneySaved')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">{t('userRating')}</div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t('reviewsFeedback')}</h2>
          <div className="testimonials-grid">
            {JSON.parse(localStorage.getItem('reviews') || '[]').slice(0, 3).length > 0 ? (
              JSON.parse(localStorage.getItem('reviews') || '[]').slice(0, 3).map((review) => (
                <div key={review.id} className="testimonial-card">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                    ))}
                  </div>
                  <p className="comment">"{review.comment}"</p>
                  <div className="date">{new Date(review.date).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <>
                <div className="testimonial-card">
                  <div className="stars">
                    <span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span>
                  </div>
                  <p className="comment">"{t('testimonial1')}"</p>
                  <div className="author">- Sarah J.</div>
                </div>
                <div className="testimonial-card">
                  <div className="stars">
                    <span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span>
                  </div>
                  <p className="comment">"{t('testimonial2')}"</p>
                  <div className="author">- Michael R.</div>
                </div>
                <div className="testimonial-card">
                  <div className="stars">
                    <span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span><span className="star filled">★</span>
                  </div>
                  <p className="comment">"{t('testimonial3')}"</p>
                  <div className="author">- Emily W.</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Modal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)}>
        <UserGuide />
      </Modal>
    </div>
  );
};

export default Landing;