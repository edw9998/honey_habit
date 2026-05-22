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
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  db.query(
    "SELECT * FROM users WHERE id=1",
    (err, result) => {

      if (err) {

        return res
          .status(500)
          .json(err);
      }

      const user = result[0];

      const lastDate =
        user.last_completed_date;

      let newStreak =
        user.streak;

      // FIRST COMPLETION EVER
      if (!lastDate) {

        newStreak = 1;

      } else {

        const last =
          new Date(lastDate);

        const current =
          new Date(today);

        const diffTime =
          current - last;

        const diffDays =
          diffTime /
          (1000 * 60 * 60 * 24);

        // CONTINUE STREAK
        if (diffDays === 1) {

          newStreak += 1;

        }

        // RESET STREAK
        else if (diffDays > 1) {

          newStreak = 1;
        }
      }

      db.query(
        `
        UPDATE users
        SET streak=?,
        last_completed_date=?
        WHERE id=1
        `,
        [newStreak, today],
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