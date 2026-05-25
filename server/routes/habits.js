const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all habits with today's completion status
router.get("/", authMiddleware, (req, res) => {
  db.query(
    `SELECT h.*, 
     CASE WHEN hl.id IS NOT NULL THEN 1 ELSE 0 END as completed
     FROM habits h
     LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
       AND hl.log_date = CURDATE() AND hl.user_id = ?
     WHERE h.user_id = ?`,
    [req.user.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// POST new habit
router.post("/", authMiddleware, (req, res) => {
  const { title } = req.body;
  db.query(
    "INSERT INTO habits (title, user_id) VALUES (?, ?)",
    [title, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Habit Added", habitId: result.insertId });
    }
  );
});

// PUT toggle habit completion for today
router.put("/:id", authMiddleware, (req, res) => {
  // Force boolean conversion to prevent type mismatches
  const completed = req.body.completed === true || req.body.completed === "true";
  
  if (completed) {
    db.query(
      "INSERT IGNORE INTO habit_logs (habit_id, user_id, log_date) VALUES (?, ?, CURDATE())",
      [req.params.id, req.user.id],
      (err) => err ? res.status(500).json(err) : res.json({ message: "Habit logged" })
    );
  } else {
    db.query(
      "DELETE FROM habit_logs WHERE habit_id = ? AND user_id = ? AND log_date = CURDATE()",
      [req.params.id, req.user.id],
      (err) => err ? res.status(500).json(err) : res.json({ message: "Habit unlogged" })
    );
  }
});

module.exports = router;