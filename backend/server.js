// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
import jobRoutes from "./routes/jobRoutes.js";

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


// Simple Test Route
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT, () =>
    console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
  );
})
.catch((err) => console.error("❌ MongoDB connection error:", err));
