// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Import your route files
// Ensure these filenames match exactly what is in your 'server/routes/' folder
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const habitRoutes = require("./routes/habits");
const shopRoutes = require("./routes/shop");
const wellnessRoutes = require("./routes/wellness");

dotenv.config();
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json()); // Essential for reading JSON bodies from frontend

// 3. Mount Routes (Connect URLs to files)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);    // This fixes the Tasks 404
app.use("/api/habits", habitRoutes);  // This fixes the Habits 404
app.use("/api/shop", shopRoutes);     // This fixes the Shop 401/404
app.use("/api/wellness", wellnessRoutes);

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🛣️ Available routes: /api/auth, /api/users, /api/tasks, /api/habits, /api/shop`);
});