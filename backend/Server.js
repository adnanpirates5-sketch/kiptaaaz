require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kiptaaaz_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Connection Error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));