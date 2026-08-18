const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =========================
// REGISTER
// =========================

router.post("/register", (req, res) => {
  const { name, email, password, business } = req.body;

  if (!name || !email || !password || !business) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const checkSql =
    "SELECT id FROM users WHERE email = ? LIMIT 1";

  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const insertSql = `
      INSERT INTO users
      (name, email, password, business)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [name, email, password, business],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Registration failed",
          });
        }

        res.status(201).json({
          message: "Registration successful",
          user: {
            id: result.insertId,
            name,
            email,
            business,
          },
        });
      }
    );
  });
});


// =========================
// LOGIN
// =========================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = `
    SELECT id, name, email, password, business
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        business: user.business,
      },
    });
  });
});


// =========================
// UPDATE PROFILE
// =========================

router.put("/profile", (req, res) => {
  const { id, name, email, business } = req.body;

  if (!id || !name || !email || !business) {
    return res.status(400).json({
      message: "All profile fields are required",
    });
  }

  const checkEmailSql = `
    SELECT id
    FROM users
    WHERE email = ?
    AND id != ?
    LIMIT 1
  `;

  db.query(
    checkEmailSql,
    [email, id],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already used by another account",
        });
      }

      const updateSql = `
        UPDATE users
        SET name = ?, email = ?, business = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [name, email, business, id],
        (err, result) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Failed to update profile",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          res.json({
            message: "Profile updated successfully",

            user: {
              id,
              name,
              email,
              business,
            },
          });
        }
      );
    }
  );
});

module.exports = router;