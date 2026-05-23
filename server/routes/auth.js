const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {

  const {
    username,
    email,
    password,
  } = req.body;

  try {

    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password
      )
      VALUES (?, ?, ?)
      `,
      [
        username,
        email,
        hashedPassword,
      ],
      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json(err);
        }

        res.json({
          message:
            "User registered successfully",
        });
      }
    );

  } catch (err) {

    res.status(500).json(err);
  }
});


// =========================
// LOGIN
// =========================

router.post("/login", (req, res) => {

  const {
    email,
    password,
  } = req.body;

  db.query(
    `
    SELECT * FROM users
    WHERE email=?
    `,
    [email],
    async (err, result) => {

      if (err) {

        return res
          .status(500)
          .json(err);
      }

      if (result.length === 0) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const user = result[0];

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {

        return res
          .status(401)
          .json({
            message:
              "Invalid password",
          });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        "honey_secret_key",
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user,
      });
    }
  );
});

module.exports = router;