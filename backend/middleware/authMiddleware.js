const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};



// Admin access middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// Employer access middleware
const isEmployer = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    res.status(403).json({ message: "Employer access only" });
  }
};

// Candidate access middleware
const isCandidate = (req, res, next) => {
  if (req.user && req.user.role === "candidate") {
    next();
  } else {
    res.status(403).json({ message: "Candidate access only" });
  }
};

module.exports = { protect, isAdmin, isEmployer, isCandidate };
