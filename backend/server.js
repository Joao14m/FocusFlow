const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.json());

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

  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});