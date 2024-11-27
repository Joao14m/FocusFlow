const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const PORT = 5000; // Hardcoded port
const MONGO_URI = "mongodb+srv://joaomar:mvJMv@cluster0.3zicq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Hardcoded MongoDB URI

mongoose.connect(MONGO_URI, {
  dbName: 'TASKMANAGER_1', // Specify the database name here
})
  .then(() => console.log('MongoDB Atlas connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const User = mongoose.model('User', userSchema);
  
  app.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      const newUser = new User({ name, username, email, password });
      const savedUser = await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });