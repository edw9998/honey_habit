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

// PUT update task: Auto-Delete & Reward on Completion
router.put("/:id", authMiddleware, (req, res) => {
  const { completed } = req.body;

  if (completed) {
    // 1. Reward User (Add + save 10 Coins and 1 Streak)
    db.query(
      "UPDATE users SET coins = coins + 10, streak = streak + 1, lifetime_coins = lifetime_coins + 10 WHERE id = ?",
      [req.user.id],
      (err) => {
        if (err) return res.status(500).json({ message: "Server error" });

        // 2. Delete the Task from Database
        db.query(
          "DELETE FROM tasks WHERE id = ? AND user_id = ?",
          [req.params.id, req.user.id],
          (err, result) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Task not found" });
            
            // Success: Task is gone, user is rewarded
            res.json({ message: "Task completed! +10 Coins, +1 Streak 🍯" });
          }
        );
      }
    );
  } else {
    // Fallback: If for some reason completed is false (though unlikely with auto-delete)
    res.json({ message: "Nothing to update" });
  }
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