const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET current user profile
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, username, streak, coins, created_at FROM users WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// UPDATE STREAK (called when completing a task)
router.put("/streak", authMiddleware, (req, res) => {
  db.query(
    "UPDATE users SET streak = streak + 1 WHERE id = ?",
    [req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Streak updated!" });
    }
  );
});

// UPDATE COINS (called when completing a task)
router.put("/coins", authMiddleware, (req, res) => {
  db.query(
    "UPDATE users SET coins = coins + 10 WHERE id = ?",   // Give 10 coins per task
    [req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Coins updated!" });
    }
  );
});

module.exports = router;