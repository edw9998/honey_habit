// server/routes/shop.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all available rewards
router.get("/rewards", authMiddleware, (req, res) => {
  db.query("SELECT id, title, description, cost, image_emoji FROM rewards", (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(result);
  });
});

// POST purchase a reward
router.post("/purchase", authMiddleware, (req, res) => {
  const { rewardId } = req.body;
  const userId = req.user.id;

  // 1. Get reward cost
  db.query("SELECT id, cost FROM rewards WHERE id = ?", [rewardId], (err, rewards) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (rewards.length === 0) return res.status(404).json({ message: "Reward not found" });

    const cost = rewards[0].cost;

    // 2. Atomic coin check & deduction (prevents race conditions & negative balances)
    db.query(
      "UPDATE users SET coins = coins - ? WHERE id = ? AND coins >= ?",
      [cost, userId, cost],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (result.affectedRows === 0) return res.status(400).json({ message: "Not enough coins!" });

        // 3. Log the purchase
        db.query(
          "INSERT INTO reward_purchases (user_id, reward_id) VALUES (?, ?)",
          [userId, rewardId],
          (err) => {
            if (err) console.error("Failed to log purchase:", err);
            res.json({ message: "Reward purchased successfully! 🍯" });
          }
        );
      }
    );
  });
});

module.exports = router;