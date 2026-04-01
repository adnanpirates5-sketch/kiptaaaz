const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// API (POST)
router.post('/add-task', async (req, res) => {
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
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;