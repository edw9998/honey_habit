const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all cosmetics
router.get("/", authMiddleware, (req, res) => {
  db.query("SELECT id, name, emoji, type, cost FROM cosmetics", (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(result);
  });
});

// GET user's owned cosmetics
router.get("/my", authMiddleware, (req, res) => {
  db.query(
    `SELECT c.id, c.name, c.emoji, c.type, c.cost, uc.is_equipped 
     FROM cosmetics c
     JOIN user_cosmetics uc ON c.id = uc.cosmetic_id
     WHERE uc.user_id = ?`,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
});

// POST buy a cosmetic
router.post("/buy", authMiddleware, (req, res) => {
  const { cosmeticId } = req.body;
  const userId = req.user.id;

  db.query("SELECT id, cost FROM cosmetics WHERE id = ?", [cosmeticId], (err, items) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (items.length === 0) return res.status(404).json({ message: "Item not found" });

    const cost = items[0].cost;
    // Atomic coin check & deduct
    db.query(
      "UPDATE users SET coins = coins - ? WHERE id = ? AND coins >= ?",
      [cost, userId, cost],
      (err, update) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (update.affectedRows === 0) return res.status(400).json({ message: "Not enough coins!" });

        db.query(
          "INSERT IGNORE INTO user_cosmetics (user_id, cosmetic_id) VALUES (?, ?)",
          [userId, cosmeticId],
          (err) => err ? res.status(500).json({ message: "Failed to save" }) : res.json({ message: "Cosmetic purchased! 🎁" })
        );
      }
    );
  });
});

// PUT toggle equipped state
router.put("/equip", authMiddleware, (req, res) => {
  const { cosmeticId } = req.body;
  const userId = req.user.id;

  db.query("SELECT is_equipped FROM user_cosmetics WHERE user_id = ? AND cosmetic_id = ?", [userId, cosmeticId], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    const current = results.length > 0 ? results[0].is_equipped : false;
    const newStatus = !current;

    db.query(
      "INSERT INTO user_cosmetics (user_id, cosmetic_id, is_equipped) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_equipped = ?",
      [userId, cosmeticId, newStatus, newStatus],
      (err) => err ? res.status(500).json({ message: "Update failed" }) : res.json({ message: newStatus ? "Equipped! ✨" : "Unequipped" })
    );
  });
});

module.exports = router;