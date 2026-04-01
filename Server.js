require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/kiptaaaz_db')
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Connection Error:", err));

// Routes
app.use('/', authRoutes);
app.use('/api', taskRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));