// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Debug: Check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Import Task model
const Task = require("./models/task");

// Example route: Add a new task
app.post("/add-task", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
