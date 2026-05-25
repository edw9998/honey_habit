// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Import ALL your route files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const habitRoutes = require("./routes/habits");
const shopRoutes = require("./routes/shop");

dotenv.config();

const app = express();

// 2. Middleware (Must be placed BEFORE routes)
app.use(cors());
app.use(express.json());

// 3. Mount Routes (Connects URLs to your files)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);      // Fixes /api/tasks 404
app.use("/api/habits", habitRoutes);    // Fixes /api/habits 404
app.use("/api/shop", shopRoutes);       // Fixes /api/shop 404/401

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));