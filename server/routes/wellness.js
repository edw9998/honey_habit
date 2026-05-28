// server/routes/wellness.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET today's value for a specific type
router.get("/:type", authMiddleware, (req, res) => {
  const { type } = req.params;
  db.query(
    "SELECT value FROM wellness_logs WHERE user_id = ? AND log_type = ? AND log_date = CURDATE()",
    [req.user.id, type],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ value: result.length > 0 ? result[0].value : 0 });
    }
  );
});

// POST update wellness log
router.post("/update", authMiddleware, (req, res) => {
  const { type, value } = req.body;
  
  // 1. Check current value to prevent farming bonus
  db.query(
    "SELECT value FROM wellness_logs WHERE user_id = ? AND log_type = ? AND log_date = CURDATE()",
    [req.user.id, type],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      
      const oldValue = results.length > 0 ? parseFloat(results[0].value) : 0;
      let bonus = 0;
      const targets = { hydration: 8, sleep: 7 };

      // Award bonus ONLY when crossing the target threshold
      if (targets[type] && oldValue < targets[type] && value >= targets[type]) {
        bonus = type === 'hydration' ? 5 : 10;
      }

      // 2. Upsert (Insert or Update)
      db.query(
        `INSERT INTO wellness_logs (user_id, log_type, value, log_date) 
         VALUES (?, ?, ?, CURDATE())
         ON DUPLICATE KEY UPDATE value = VALUES(value)`,
        [req.user.id, type, value],
        (err) => {
          if (err) return res.status(500).json({ message: "Server error" });
          if (bonus > 0) {
            db.query("UPDATE users SET coins = coins + ?, lifetime_coins = lifetime_coins + ? WHERE id = ?", [bonus, bonus, req.user.id]);
          }
          res.json({ message: "Wellness log updated", bonus });
        }
      );
    }
  );
});

module.exports = router;