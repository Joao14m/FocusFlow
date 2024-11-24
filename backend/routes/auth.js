const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Mock user for demonstration purposes
const users = [];

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);
  users.push({ email, password: hashedPassword });

  res.status(201).json({ message: "User created successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1h" });

  res.status(200).json({ result: user, token });
});

module.exports = router;
