const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "your-mongo-db-connection-string-here";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
