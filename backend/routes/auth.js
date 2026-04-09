const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await user.save();
    
    // Create token for auto-login
    const token = jwt.sign({ _id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, profilePicture: savedUser.profilePicture }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.patch('/profile/update', authenticateToken, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully', 
      user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Reset password URL - change this to your frontend URL in production
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the link below to reset your password:\n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message: message,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Password Reset Request</h2>
            <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
            <p>Please click on the button below to reset your password. This link is valid for 15 minutes.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>Alternatively, you can copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
          </div>
        `
      });

      res.json({ message: 'Email sent successfully' });
    } catch (err) {
      console.error('Email send error:', err);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, resetToken: token });

    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route example
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;