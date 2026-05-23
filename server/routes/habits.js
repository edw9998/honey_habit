// server/routes/habits.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all habits for the logged-in user
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM habits WHERE user_id = ?",
    [req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// POST new habit (associated with user_id)
router.post("/", authMiddleware, (req, res) => {
  const { title } = req.body;
  db.query(
    "INSERT INTO habits (title, user_id) VALUES (?, ?)",
    [title, req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({ message: "Habit Added", habitId: result.insertId });
      }
    }
  );
});

// PUT update habit (toggle completion)
router.put("/:id", authMiddleware, (req, res) => {
  const { completed } = req.body;
  db.query(
    "UPDATE habits SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Habit not found" });
      } else {
        res.json({ message: "Habit Updated" });
      }
    }
  );
});

module.exports = router;