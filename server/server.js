const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Import ALL route files
// If any of these lines error, check that the file actually exists in server/routes/
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const habitRoutes = require("./routes/habits");
const shopRoutes = require("./routes/shop");

dotenv.config();
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Mount Routes
// These lines MUST match the paths your frontend calls
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);     // ✅ This fixes Tasks 404
app.use("/api/habits", habitRoutes);   // ✅ This fixes Habits 404
app.use("/api/shop", shopRoutes);      // ✅ This fixes Shop 404/401

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));