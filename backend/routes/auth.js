const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
<<<<<<< HEAD
const sendEmail = require('../utils/email');
=======
const sendEmail = require('../utils/sendEmail');
>>>>>>> db72b13e84f41cce57ce7e651237407346cbda71

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

    // Send welcome email
    try {
      await sendEmail({
        email: savedUser.email,
        subject: 'Welcome to Kiptaaz!',
        message: `Hello ${savedUser.name},\n\nWelcome to Kiptaaz! We're glad to have you on board. Start managing your finances today!`,
        html: `<h1>Welcome to Kiptaaz!</h1><p>Hello <strong>${savedUser.name}</strong>,</p><p>We're glad to have you on board. Start managing your finances today!</p>`,
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail registration if email fails
    }

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

    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFactorCode = code;
      user.twoFactorCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // Send code via email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your 2FA Verification Code',
          message: `Your verification code is: ${code}. It will expire in 10 minutes.`,
          html: `<h1>Two-Factor Authentication</h1><p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });
      } catch (err) {
        console.error('Error sending 2FA email:', err);
        return res.status(500).json({ message: 'Error sending verification code' });
      }

      return res.json({ 
        requires2FA: true, 
        email: user.email,
        message: 'Verification code sent to your email' 
      });
    }

    // Create token if 2FA is NOT enabled
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify 2FA Code
router.post('/verify-2fa', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ 
      email, 
      twoFactorCode: code,
      twoFactorCodeExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Clear code after successful verification
    user.twoFactorCode = null;
    user.twoFactorCodeExpiry = null;
    await user.save();

    // Create token
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enable/Disable 2FA (Protected)
router.post('/toggle-2fa', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is2FAEnabled = !user.is2FAEnabled;
    await user.save();

    res.json({ 
      message: `2FA ${user.is2FAEnabled ? 'enabled' : 'disabled'} successfully`, 
      is2FAEnabled: user.is2FAEnabled 
    });
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

<<<<<<< HEAD
    // Send reset email
    try {
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}\n\nThis link will expire in 15 minutes.`,
        html: `<h1>Password Reset Request</h1><p>You requested a password reset. Please click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 15 minutes.</p>`,
      });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return res.status(500).json({ message: 'Error sending reset email. Please try again later.' });
    }

    res.json({ message: 'Password reset link sent to your email' });
=======
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
>>>>>>> db72b13e84f41cce57ce7e651237407346cbda71
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