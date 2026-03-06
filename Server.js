require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ফ্রন্টএন্ড থেকে ডাটা নেওয়ার জন্য এটি দরকার

const app = express();
app.use(express.json()); // JSON ডাটা বোঝার জন্য
app.use(cors());

// ডাটাবেস কানেকশন
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Connection Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));