const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET Current User Profile (Coins, Streak, Email)
router.get("/me", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, email, coins, streak FROM users WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });
      res.json(result[0]);
    }
  );
});

// PUT Update Streak (Increment by 1)
router.put("/streak", authMiddleware, (req, res) => {
  db.query(
    "UPDATE users SET streak = streak + 1 WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Streak incremented" });
    }
  );
});

// PUT Update Coins (Accepts positive/negative amounts)
router.put("/coins", authMiddleware, (req, res) => {
  const { amount } = req.body;
  db.query(
    "UPDATE users SET coins = coins + ? WHERE id = ?",
    [amount, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Coins updated" });
    }
  );
});

module.exports = router;