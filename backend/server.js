const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.json());

const corsOptions = {
  origin: "https://focusflow.ink" ,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
};

app.use(cors(corsOptions));


// MongoDB Connection
const PORT = 5000; // Hardcoded port
const url = 'mongodb+srv://joaomar:mvJMv@cluster0.3zicq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Hardcoded MongoDB URI
const client = new MongoClient(url);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers', 
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE'
  );
  next();
});

// Register 
app.post('/api/register', async(req, res, next) => {
  let error = '';
  const { name, username, email, password } = req.body;
  console.log(`${name} ${username} ${email} ${password}`);

  try{
    const db = client.db('TASKMANAGER_1');
    const results = await db.collection('users').findOne({email: email});

    if(!results){
      const newUser = {
        name,
        username,
        email, 
        password,
      };

      const result = await db.collection('users').insertOne(newUser);
      const message = 'User added successfully';

      res.status(201).json({
        message: message,
        name: newUser.name,
        email: newUser.email,
      });
    } else {
      error = 'Email already exists';
      res.status(401).json({error});
    }
  } catch (err){
    error = 'Error while accessing the database';
    res.status(500).json({error});
  }
});

// Login
app.post('/api/login', async(req, res, next) => {
  let error = '';
  const {username, password} = req.body;

  try{
    const db = client.db('TASKMANAGER_1');
    const results = await db.collection('users').findOne(
      {username: username, password: password}
    );
    
    if(results){
      const {_id: id, name: name, username: username, email: email} = results;
      res.status(200).json({id, name, email, error: ''});
    } else {
      error = 'Invalid login or password';
      res.status(401).json({error});
    }
  } catch (err) {
    error = 'Error while accessing the database';
    res.status(500).json({error});
  }
});

// Task Creation
app.post('/api/tasks', async (req, res, next) => {
  const {user_id, category, title, description, status, daysOfTheWeek, time, priorityLevel} = req.body;

  try{
    const db = client.db('TASKMANAGER_1');

    const user = await db.collection('users').findOne({_id: new ObjectId(user_id)});
    if(!user){
      return res.status(404).json({error: "User not found"});
    }

    // Task Creation
    const task = {
      user_id: user._id,
      category, 
      title, 
      description,
      status,
      daysOfTheWeek,
      time,
      priorityLevel, //must be named the same thing in the frontend too2
    };

    await db.collection('tasks').insertOne(task);
    res.status(201).json({message: "Task created", task});
  } catch(error){
    console.error("Error creating task:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Update Task
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id; // Get task ID from the URL
  const { category, title, description, status, daysOfTheWeek, time, priorityLevel } = req.body; // Fields to update

  try {
    const db = client.db('TASKMANAGER_1');

    // Convert taskId to ObjectId and check if it's valid
    let objectId;
    try {
      objectId = new ObjectId(taskId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // Build the update object dynamically
    const updateFields = {};
    if (category) updateFields.category = category;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (daysOfTheWeek) updateFields.daysOfTheWeek = daysOfTheWeek;
    if (time) updateFields.time = time;
    if (priorityLevel) updateFields.priorityLevel = priorityLevel;

    // Perform the update
    const result = await db.collection('tasks').updateOne(
      { _id: objectId }, // Match the task by its ID
      { $set: updateFields } // Set the fields to be updated
    );

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
  const taskId = req.params.id; // Get task ID from the URL

  try {
    const db = client.db('TASKMANAGER_1');

    // Convert taskId to ObjectId and check if it's valid
    let objectId;
    try {
      objectId = new ObjectId(taskId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // Delete the task
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});