const express = require("express");
const router = express.Router();
const pool = require("./db");


router.post("/signup", async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

  const { name, email, password, image } = req.body;

  try {
    const exists = await pool.query(
      "SELECT id FROM auth_users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await pool.query(
      `
      INSERT INTO auth_users (name, email, password, image)
      VALUES ($1,$2,$3,$4)
      RETURNING id, name, email, image
      `,
      [
        name,
        email,
        password,
        image && image.startsWith("data:image") ? image : null
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `
    SELECT id, name, email, image
    FROM auth_users
    WHERE email=$1 AND password=$2
    `,
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(result.rows[0]);
});


router.put("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, image, oldPassword, newPassword } = req.body;

  try {
    // 1. Fetch existing password
    const userRes = await pool.query(
      "SELECT password FROM auth_users WHERE id=$1",
      [id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentPassword = userRes.rows[0].password;

    // 2. If password change requested
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password required" });
      }

      if (oldPassword !== currentPassword) {
        return res.status(401).json({ message: "Old password incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
    }

    // 3. Update profile
    const result = await pool.query(
      `
      UPDATE auth_users
      SET
        name=$1,
        email=$2,
        image=$3,
        password=COALESCE($4, password)
      WHERE id=$5
      RETURNING id, name, email, image
      `,
      [name, email, image, newPassword || null, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});


module.exports = router;
