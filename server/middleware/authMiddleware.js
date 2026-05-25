// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    // Verify token using the same secret used during login/register
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "honey_habit_secret_dev");
    
    req.user = decoded; // Attaches { id, email, iat, exp } to the request
    console.log(`✅ Auth successful for user ID: ${decoded.id}`);
    next(); // Proceed to the route handler
  } catch (err) {
    console.error(`❌ Token verification failed: ${err.message}`);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;