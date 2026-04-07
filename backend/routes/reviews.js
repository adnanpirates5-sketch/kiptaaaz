const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Review = require('../models/Review');

// --- Get all reviews (public) ---
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .sort({ date: -1 });
    
    // Map to a cleaner format for frontend
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      author: review.user ? review.user.name : 'Anonymous User',
      rating: review.rating,
      comment: review.comment,
      date: review.date
    }));
    
    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Submit a review (authenticated) ---
router.post('/', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const review = new Review({
    user: req.user._id,
    rating,
    comment
  });
  
  try {
    const savedReview = await review.save();
    // Populate user name before sending back
    await savedReview.populate('user', 'name');
    
    res.status(201).json({
      id: savedReview._id,
      author: savedReview.user.name,
      rating: savedReview.rating,
      comment: savedReview.comment,
      date: savedReview.date
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
