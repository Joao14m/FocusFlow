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
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/TASKMANAGER_1";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Add verified field
});

const User = mongoose.model('User', userSchema);

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Signup Route
app.post('/signup', async (req, res) => {
  console.log("Received request:", req.body); // Log incoming data

  const { name, username, email, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User already exists:", existingUser); // Debug existing user
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const newUser = new User({ name, username, email, password });
    const savedUser = await newUser.save();
    console.log("User created:", savedUser); // Log the saved user

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error during signup:", error); // Log errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
