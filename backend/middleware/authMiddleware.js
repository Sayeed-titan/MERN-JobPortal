const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (excluding password) to request object
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to next middleware or controller
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};


module.exports = { protect, adminOnly};
