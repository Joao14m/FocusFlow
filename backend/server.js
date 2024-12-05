const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// MongoDB Connection
const PORT = 5000; // Backend server port
const url = 'mongodb+srv://joaomar:mvJMv@cluster0.3zicq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // MongoDB URI
const client = new MongoClient(url);

client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Middleware
app.use(cors({ // Enable CORS for the frontend domain
  origin: "https://focusflow.ink",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}));
app.use(bodyParser.json()); // Parse JSON bodies

// Routes

// Register
app.post('/api/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log(`Registering user: ${name}, ${username}, ${email}`);

  try {
    const db = client.db('TASKMANAGER_1');
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = { name, username, email, password };
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = client.db('TASKMANAGER_1');
    const user = await db.collection('users').findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const { _id: id, name, email } = user;
    res.status(200).json({ id, name, email });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Tasks
app.get('/api/tasks', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "user_id query parameter is required" });
  }

  try {
    const db = client.db('TASKMANAGER_1');
    const tasks = await db.collection('tasks').find({ user_id: userId }).toArray();
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Task
app.post('/api/tasks', async (req, res) => {
  const { user_id, category, title, description, status, daysOfTheWeek, time, priorityLevel } = req.body;

  try {
    const db = client.db('TASKMANAGER_1');
    const user = await db.collection('users').findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTask = { user_id, category, title, description, status, daysOfTheWeek, time, priorityLevel };
    await db.collection('tasks').insertOne(newTask);

    res.status(201).json({ message: "Task created successfully", newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Task
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { category, title, description, status, daysOfTheWeek, time, priorityLevel } = req.body;

  try {
    const db = client.db('TASKMANAGER_1');
    const objectId = new ObjectId(taskId);

    const updatedTask = { category, title, description, status, daysOfTheWeek, time, priorityLevel };
    const result = await db.collection('tasks').updateOne({ _id: objectId }, { $set: updatedTask });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const db = client.db('TASKMANAGER_1');
    const objectId = new ObjectId(taskId);

    const result = await db.collection('tasks').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
