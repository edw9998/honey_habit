const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM tasks",
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
  const { title, focus_minutes } =
    req.body;

  db.query(
    "INSERT INTO tasks (title, focus_minutes) VALUES (?, ?)",
    [title, focus_minutes],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          message: "Task added !",
        });
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    (err, result) => {

      if (err) {
        res.status(500).json(err);

      } else {
        res.json({
          message: "Task Deleted !",
        });
      }
    }
  );
});

module.exports = router;