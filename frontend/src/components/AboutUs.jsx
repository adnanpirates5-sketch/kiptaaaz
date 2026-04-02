import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import './AboutUs.css';

const AboutUs = () => {
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About Kiptaaz</h1>
          <p className="hero-subtitle">
            Empowering Your Financial Journey with Intelligent Budget Management
          </p>
          <div className="hero-stats">
            <div className="stat">
              <h3>10K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat">
              <h3>$2M+</h3>
              <p>Money Saved</p>
            </div>
            <div className="stat">
              <h3>4.8★</h3>
              <p>User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            At Kiptaaz, we believe financial freedom starts with smart budgeting.
            Our platform provides intuitive tools to track expenses, manage budgets,
            and achieve your financial goals with confidence.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Kiptaaz?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Analytics</h3>
              <p>Get detailed insights into your spending patterns with beautiful charts and reports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Tracking</h3>
              <p>Set and monitor financial goals with our intuitive progress tracking system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your financial data is encrypted and stored securely with bank-level security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Cross-Platform</h3>
              <p>Access your budget from any device - desktop, tablet, or mobile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>AI Insights</h3>
              <p>Receive personalized recommendations to optimize your spending habits.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multi-Currency</h3>
              <p>Support for multiple currencies with real-time exchange rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p>Passionate developers and financial experts working to revolutionize personal finance management.</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Development Team</h3>
              <p>Dedicated engineers building the future of finance</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">📈</div>
              <h3>Financial Experts</h3>
              <p>Certified advisors ensuring accuracy and reliability</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🎨</div>
              <h3>UX Designers</h3>
              <p>Creating beautiful, intuitive user experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <h2>User Reviews & Feedback</h2>
          <p>Hear what our users have to say and share your experience</p>

          <button
            className="review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>Share Your Experience</h3>

              <div className="rating-section">
                <label>Rating:</label>
                <div className="stars">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with Kiptaaz..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="suggestion">Suggestions for Improvement:</label>
                <textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Any features you'd like to see or improvements we can make?"
                />
              </div>

              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
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
                      <strong>Suggestion:</strong> {review.suggestion}
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