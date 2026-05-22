const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {

  db.query(
    "SELECT * FROM habits",
    (err, result) => {

      if (err) {
        res.status(500).json(err);

      } else {
        res.json(result);
      }
    }
  );
});

router.post("/", (req, res) => {

  const { title } = req.body;

  db.query(
    "INSERT INTO habits (title) VALUES (?)",
    [title],
    (err, result) => {

      if (err) {
        res.status(500).json(err);

      } else {
        res.json({
          message: "Habit Added",
        });
      }
    }
  );
});

router.put("/:id", (req, res) => {

  const { completed } = req.body;

  db.query(
    "UPDATE habits SET completed=? WHERE id=?",
    [completed, req.params.id],
    (err, result) => {

      if (err) {
        res.status(500).json(err);

      } else {
        res.json({
          message: "Habit Updated",
        });
      }
    }
  );
});

module.exports = router;