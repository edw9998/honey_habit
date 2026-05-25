// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Import your auth routes here
const authRoutes = require("./routes/auth"); 
const shopRoutes = require("./routes/shop");

dotenv.config();
const app = express();

// 2. Middleware (Must come first!)
app.use(cors());
app.use(express.json());

// 3. Mount your routes here
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);

// 4. Database connection / Other routes / Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));