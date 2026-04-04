import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import { useTranslation } from './theme/TranslationContext';

const AboutUs = ({ onBackHome }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      suggestion,
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    // Reset form
    setRating(0);
    setComment('');
    setSuggestion('');
    setShowReviewForm(false);
  };

  const renderStars = (currentRating, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className={`star ${starValue <= (interactive ? hoverRating || rating : currentRating) ? 'filled' : ''}`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          ★
        </span>
      );
    });
  };

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

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <h2>{t('reviewsFeedback')}</h2>
          <p>{t('reviewsDesc')}</p>

          <button
            className="review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? t('cancel') : t('writeReview')}
          </button>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>{t('shareExperience')}</h3>

              <div className="rating-section">
                <label>{t('rating')}</label>
                <div className="stars">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">{t('yourReview')}</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviewPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="suggestion">{t('suggestions')}</label>
                <textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder={t('suggestionPlaceholder')}
                />
              </div>

              <button type="submit" className="submit-review-btn">{t('submitReview')}</button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">{t('noReviews')}</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="stars">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  {review.suggestion && (
                    <div className="review-suggestion">
                      <strong>{t('suggestionLabel')}</strong> {review.suggestion}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;