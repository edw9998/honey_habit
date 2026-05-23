// server/routes/auth.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "honey_habit_secret_dev";

// REGISTER
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (email, password, coins, streak) VALUES (?, ?, 0, 0)",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Registration failed" });
          const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: "7d" });
          res.status(201).json({ token, user: { id: result.insertId, email, coins: 0, streak: 0 } });
        }
      );
    } catch (err) {
      res.status(500).json({ message: "Password hashing failed" });
    }
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user.id, email: user.email, coins: user.coins, streak: user.streak } });
    } catch (err) {
      res.status(500).json({ message: "Login failed" });
    }
  });
});

module.exports = router;