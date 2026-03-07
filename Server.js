require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/kiptaaaz_db')
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Connection Error:", err));

// --- API Routes ---

// API (POST)
app.post('/add-task', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API (GET) 
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));