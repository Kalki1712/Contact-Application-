const express = require("express");
const router = express.Router();
const pool = require("./db");

// GET users with pagination & search
router.get("/:ownerId", async (req, res) => {
  const { ownerId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM users
       WHERE owner_id = $1
       AND (
         LOWER(name) LIKE LOWER($2) OR
         LOWER(email) LIKE LOWER($2) OR
         contact LIKE $3 OR
         LOWER(country) LIKE LOWER($2) OR
         LOWER(state) LIKE LOWER($2) OR
         LOWER(city) LIKE LOWER($2)
       )`,
      [ownerId, `%${search}%`, `%${search}%`]
    );

    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM users
       WHERE owner_id = $1
       AND (
         LOWER(name) LIKE LOWER($2) OR
         LOWER(email) LIKE LOWER($2) OR
         contact LIKE $3 OR
         LOWER(country) LIKE LOWER($2) OR
         LOWER(state) LIKE LOWER($2) OR
         LOWER(city) LIKE LOWER($2)
       )
       ORDER BY id DESC
       LIMIT $4 OFFSET $5`,
      [ownerId, `%${search}%`, `%${search}%`, limit, offset]
    );

    res.json({
      users: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET single user
router.get("/details/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// ADD user
router.post("/", async (req, res) => {
  const {
    name, email, gender, country,
    countryCode, contact, state,
    city, address, image, ownerId
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users
       (name,email,gender,country,country_code,contact,state,city,address,image,owner_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name, email, gender, country,
        countryCode, contact, state,
        city, address, image, ownerId
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name, email, gender, country,
    countryCode, contact, state,
    city, address, image
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
       name=$1,email=$2,gender=$3,country=$4,
       country_code=$5,contact=$6,state=$7,
       city=$8,address=$9,image=$10
       WHERE id=$11 RETURNING *`,
      [
        name, email, gender, country,
        countryCode, contact, state,
        city, address, image, id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;