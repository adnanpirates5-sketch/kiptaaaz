import React, { useState, useEffect } from 'react';
import './Reviews.css';
import { useTranslation } from './theme/TranslationContext';

const Reviews = ({ onBackHome }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const renderStars = (currentRating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className={`star ${starValue <= currentRating ? 'filled' : ''}`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="reviews-page">
      <button className="back-home-btn" onClick={onBackHome} title={t('backToHome')}>
        ← {t('backToHome')}
      </button>
      
      <section className="reviews-hero">
        <div className="container">
          <h1>{t('reviewsFeedback')}</h1>
          <p>{t('reviewsDesc')}</p>
        </div>
      </section>

      <section className="reviews-content">
        <div className="container">
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews-container">
                <p className="no-reviews">{t('noReviews')}</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card animate-fade-in">
                  <div className="review-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        {(review.author || 'U')[0].toUpperCase()}
                      </div>
                      <div className="author-details">
                        <span className="author-name">{review.author || 'Anonymous User'}</span>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
