// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Import all your route files
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");   // Make sure this file exists!
const habitRoutes = require("./routes/habits");
const shopRoutes = require("./routes/shop");
const userRoutes = require("./routes/users");   // We will create this below

dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Mount Routes (The "Map" for your API)
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/users", userRoutes); // Fixes the /users/me error

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));