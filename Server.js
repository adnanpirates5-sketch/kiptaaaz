require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// সরাসরি কানেকশন স্ট্রিং ব্যবহার করা হয়েছে যাতে .env ফাইল নিয়ে সমস্যা না হয়
mongoose.connect('mongodb://127.0.0.1:27017/kiptaaaz_db')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Connection Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));