import React from "react";
import { useTranslation } from "../theme/TranslationContext";
import { useTheme } from "../theme/ThemeContext";
import { useCurrency } from "../theme/useCurrency";
import "./Settings.css";

const Settings = ({ onLogout }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currency, changeCurrency } = useCurrency();

  // Review Form State
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const currencies = [
    { symbol: '৳', name: 'BDT' },
    { symbol: '$', name: 'USD' },
  ];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = savedUser.name || 'Anonymous User';

    const newReview = {
      id: Date.now(),
      author: userName,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const updatedReviews = [newReview, ...savedReviews];
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    // Reset form
    setRating(0);
    setComment('');
    setSubmitStatus('success');
    setTimeout(() => {
      setSubmitStatus(null);
      setShowReviewForm(false);
    }, 2000);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className={`settings-star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="settings-container-premium animate-fade-in">
      <div className="settings-header-premium">
        <h2>{t('settings')}</h2>
        <p className="settings-subtitle">{t('settingsDesc')}</p>
      </div>

      <div className="settings-grid">
        {/* Appearance & Language */}
        <div className="premium-card settings-group-card">
          <div className="settings-group-header">
            <span className="settings-group-icon">🎨</span>
            <h4>{t('preferences')}</h4>
          </div>
          
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">{t('darkMode')}</span>
              <span className="setting-description">{t('darkModeDesc')}</span>
            </div>
            <div 
              className={`premium-toggle ${theme === 'dark' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              <div className="toggle-knob"></div>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">{t('language')}</span>
              <span className="setting-description">{t('languageDesc')}</span>
            </div>
            <button 
              onClick={toggleLanguage} 
              className="premium-btn secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {language === 'en' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>

        {/* Currency Settings */}
        <div className="premium-card settings-group-card">
          <div className="settings-group-header">
            <span className="settings-group-icon">💰</span>
            <h4>{t('currency')}</h4>
          </div>
          <div className="setting-info" style={{ marginBottom: '1rem' }}>
            <span className="setting-description">{t('currencyDesc')}</span>
          </div>
          <div className="currency-grid">
            {currencies.map((curr) => (
              <div
                key={curr.symbol}
                onClick={() => changeCurrency(curr.symbol)}
                className={`currency-option ${currency === curr.symbol ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.25rem' }}>{curr.symbol}</span>
                <span>{curr.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="premium-card settings-group-card">
        <div className="settings-group-header">
          <span className="settings-group-icon">⭐</span>
          <h4>{t('reviewsFeedback')}</h4>
        </div>
        <div className="setting-info" style={{ marginBottom: '1rem' }}>
          <span className="setting-description">{t('reviewsDesc')}</span>
        </div>
        
        {!showReviewForm ? (
          <button 
            className="premium-btn secondary"
            onClick={() => setShowReviewForm(true)}
            style={{ alignSelf: 'flex-start' }}
          >
            {t('writeReview')}
          </button>
        ) : (
          <form className="settings-review-form" onSubmit={handleSubmitReview}>
            {submitStatus === 'success' ? (
              <div className="submit-success-msg">
                {t('submitReviewSuccess') || 'Thank you for your review!'}
              </div>
            ) : (
              <>
                <div className="settings-rating-section">
                  <div className="settings-stars">
                    {renderStars()}
                  </div>
                </div>

                <div className="settings-form-group">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('reviewPlaceholder')}
                    required
                  />
                </div>

                <div className="settings-review-actions">
                  <button type="submit" className="premium-btn primary">
                    {t('submitReview')}
                  </button>
                  <button 
                    type="button" 
                    className="premium-btn ghost" 
                    onClick={() => setShowReviewForm(false)}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="premium-card logout-zone">
        <div className="logout-text">
          <h4>{t('accountSession')}</h4>
          <span className="setting-description">{t('logoutDesc')}</span>
        </div>
        <button onClick={onLogout} className="premium-btn danger" style={{ background: 'var(--danger)' }}>
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Settings;