const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const PORT = 5000; // Hardcoded port
const MONGO_URI = "mongodb://54.225.24.146:27017/TASKMANAGER_1"; // Hardcoded MongoDB URI

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Routes, Models, etc.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
