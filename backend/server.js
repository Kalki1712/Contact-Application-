
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);














// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const usersRoutes = require("./usersRoutes");

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "5mb" })); // allow large base64 image upload

// app.use("/users", usersRoutes);

// const PORT = process.env.SERVER_PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));





























// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const usersRoutes = require("./usersRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/users", usersRoutes);

// const PORT = process.env.SERVER_PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Backend running on http://localhost:${PORT}`)
// );
