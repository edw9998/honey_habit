const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET USER
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id=1",
    (err, result) => {

      if (err) {

        res.status(500).json(err);

      } else {

        res.json(result[0]);
      }
    }
  );
});

// UPDATE STREAK
router.put("/streak", (req, res) => {

  db.query(
    "SELECT * FROM users WHERE id=1",
    (err, result) => {

      if (err) {

        return res
          .status(500)
          .json(err);
      }

      const user = result[0];

      let newStreak =
        user.streak;

      // SIMPLE PROTOTYPE LOGIC
      newStreak += 1;

      db.query(
        `
        UPDATE users
        SET streak=?
        WHERE id=1
        `,
        [newStreak],
        (err2) => {

          if (err2) {

            return res
              .status(500)
              .json(err2);
          }

          res.json({
            streak: newStreak,
          });
        }
      );
    }
  );
});

module.exports = router;