const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all tasks for logged-in user
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
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

// POST new task (with user_id)
router.post("/", authMiddleware, (req, res) => {
  const { title, focus_minutes = 25 } = req.body;

  db.query(
    "INSERT INTO tasks (title, focus_minutes, user_id) VALUES (?, ?, ?)",
    [title, focus_minutes, req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({ 
          message: "Task added successfully!",
          taskId: result.insertId 
        });
      }
    }
  );
});

// PUT update task
router.put("/:id", authMiddleware, (req, res) => {
  const { completed } = req.body;

  db.query(
    "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task updated!" });
      }
    }
  );
});

// DELETE task
router.delete("/:id", authMiddleware, (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task deleted!" });
      }
    }
  );
});

module.exports = router;