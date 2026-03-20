require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("./multerConfig");
const verifyToken = require("./authMiddleware");

const WARN_BEFORE_SEC = parseInt(process.env.WARN_BEFORE_SEC) || 30; 
router.post("/signup", upload.single("image"), async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  try {
    const exists = await pool.query(
      "SELECT id FROM auth_users WHERE email=$1", [email]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO auth_users (name, email, password, image)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, image`,
      [name, email, hashedPassword, image]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    const decoded = jwt.decode(token);
    const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000); 

    res.json({
      token,
      remainingSeconds,
      warnBeforeSec: WARN_BEFORE_SEC, 
      ...user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM auth_users WHERE email=$1", [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    const decoded = jwt.decode(token);
    const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000); 

    res.json({
      token,
      remainingSeconds,
      warnBeforeSec: WARN_BEFORE_SEC, 
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});


router.put("/profile/:id", verifyToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, email, oldPassword, newPassword } = req.body;
  const image = req.file
    ? `http://localhost:5000/uploads/${req.file.filename}`
    : req.body.image || null;

  try {
    const userRes = await pool.query(
      "SELECT password FROM auth_users WHERE id=$1", [id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedPassword = null;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password required" });
      }

      const isMatch = await bcrypt.compare(oldPassword, userRes.rows[0].password);

      if (!isMatch) {
        return res.status(401).json({ message: "Old password incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      updatedPassword = await bcrypt.hash(newPassword, 10);
    }

    const result = await pool.query(
      `UPDATE auth_users
       SET name=$1, email=$2, image=$3, password=COALESCE($4, password)
       WHERE id=$5
       RETURNING id, name, email, image`,
      [name, email, image, updatedPassword, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});


router.post("/refresh", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email FROM auth_users WHERE id=$1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    const decoded = jwt.decode(token);
    const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000); 

    res.json({
      token,
      remainingSeconds, 
      warnBeforeSec: WARN_BEFORE_SEC, 
    });

  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Token refresh failed" });
  }
});


module.exports = router;







// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const pool = require("./db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const upload = require("./multerConfig");
// const verifyToken = require("./authMiddleware");


// router.post("/signup", upload.single("image"), async (req, res) => {
//   const { name, email, password } = req.body;
//   const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

//   try {
//     const exists = await pool.query(
//       "SELECT id FROM auth_users WHERE email=$1", [email]
//     );

//     if (exists.rows.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO auth_users (name, email, password, image)
//        VALUES ($1,$2,$3,$4)
//        RETURNING id, name, email, image`,
//       [name, email, hashedPassword, image]
//     );

//     const user = result.rows[0];
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     const decoded = jwt.decode(token); 

//     res.json({ token, expiresAt: decoded.exp * 1000, ...user }); 

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Signup failed" });
//   }
// });


// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query(
//       "SELECT * FROM auth_users WHERE email=$1", [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "2m" }
//     );

//     const decoded = jwt.decode(token); 

//     res.json({
//       token,
//       expiresAt: decoded.exp * 1000, 
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       image: user.image,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// router.put("/profile/:id", verifyToken, upload.single("image"), async (req, res) => { 
//   const { id } = req.params;
//   const { name, email, oldPassword, newPassword } = req.body;
//   const image = req.file
//     ? `http://localhost:5000/uploads/${req.file.filename}`
//     : req.body.image || null;

//   try {
//     const userRes = await pool.query(
//       "SELECT password FROM auth_users WHERE id=$1", [id]
//     );

//     if (userRes.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let updatedPassword = null;

//     if (newPassword) {
//       if (!oldPassword) {
//         return res.status(400).json({ message: "Old password required" });
//       }

//       const isMatch = await bcrypt.compare(oldPassword, userRes.rows[0].password);

//       if (!isMatch) {
//         return res.status(401).json({ message: "Old password incorrect" });
//       }

//       if (newPassword.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters" });
//       }

//       updatedPassword = await bcrypt.hash(newPassword, 10);
//     }

//     const result = await pool.query(
//       `UPDATE auth_users
//        SET name=$1, email=$2, image=$3, password=COALESCE($4, password)
//        WHERE id=$5
//        RETURNING id, name, email, image`,
//       [name, email, image, updatedPassword, id]
//     );

//     res.json(result.rows[0]);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Profile update failed" });
//   }
// });

// router.post("/refresh", verifyToken, async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, email FROM auth_users WHERE id=$1",
//       [req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = result.rows[0];

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "2m" }
//     );

//     const decoded = jwt.decode(token); 

//     res.json({ token, expiresAt: decoded.exp * 1000 }); 

//   } catch (err) {
//     console.error("Refresh error:", err);
//     res.status(500).json({ message: "Token refresh failed" });
//   }
// });


// module.exports = router;








// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const pool = require("./db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const upload = require("./multerConfig");
// const verifyToken = require("./authMiddleware");


// router.post("/signup", upload.single("image"), async (req, res) => {
//   const { name, email, password } = req.body;
//   const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

//   try {
//     const exists = await pool.query(
//       "SELECT id FROM auth_users WHERE email=$1", [email]
//     );

//     if (exists.rows.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO auth_users (name, email, password, image)
//        VALUES ($1,$2,$3,$4)
//        RETURNING id, name, email, image`,
//       [name, email, hashedPassword, image]
//     );

//     const user = result.rows[0];
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ token, ...user });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Signup failed" });
//   }
// });


// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query(
//       "SELECT * FROM auth_users WHERE email=$1", [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "2m" }
//     );

//     res.json({
//       token,
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       image: user.image,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// router.put("/profile/:id", verifyToken, upload.single("image"), async (req, res) => { 
//   const { id } = req.params;
//   const { name, email, oldPassword, newPassword } = req.body;
//   const image = req.file
//     ? `http://localhost:5000/uploads/${req.file.filename}`
//     : req.body.image || null;

//   try {
//     const userRes = await pool.query(
//       "SELECT password FROM auth_users WHERE id=$1", [id]
//     );

//     if (userRes.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let updatedPassword = null;

//     if (newPassword) {
//       if (!oldPassword) {
//         return res.status(400).json({ message: "Old password required" });
//       }

//       const isMatch = await bcrypt.compare(oldPassword, userRes.rows[0].password);

//       if (!isMatch) {
//         return res.status(401).json({ message: "Old password incorrect" });
//       }

//       if (newPassword.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters" });
//       }

//       updatedPassword = await bcrypt.hash(newPassword, 10);
//     }

//     const result = await pool.query(
//       `UPDATE auth_users
//        SET name=$1, email=$2, image=$3, password=COALESCE($4, password)
//        WHERE id=$5
//        RETURNING id, name, email, image`,
//       [name, email, image, updatedPassword, id]
//     );

//     res.json(result.rows[0]);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Profile update failed" });
//   }
// });

// router.post("/refresh", verifyToken, async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, email FROM auth_users WHERE id=$1",
//       [req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = result.rows[0];

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "2m" }
//     );

//     res.json({ token });

//   } catch (err) {
//     console.error("Refresh error:", err);
//     res.status(500).json({ message: "Token refresh failed" });
//   }
// });


// module.exports = router;