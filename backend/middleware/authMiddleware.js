const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // ✅ Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ✅ Extract token
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find the user by ID (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // ✅ Continue to next middleware
      next();
    } catch (error) {
      // ❌ Token verification failed
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // ❌ No token provided
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};




// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role ==="admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };