// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require ("./routes/jobRoutes.js");
const scalar = require("@scalar/express-api-reference");
const apiReference = scalar.apiReference;
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Load OpenAPI spec from file
const openapiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, "openapi.json"), "utf-8"));

// Scalar API Docs
// app.use("/docs", apiReference({
//   theme: "saturn",   // themes: default, saturn, alternate...
//   spec: {
//     content: {
//       openapi: "3.0.0",
//       info: {
//         title: "MERN Job Portal API",
//         version: "1.0.0",
//         description: "Interactive API documentation for the Job Portal project"
//       },
//       servers: [
//         { url: "http://localhost:5000/api" }
//       ],
//       components: {
//         securitySchemes: {
//           bearerAuth: {
//             type: "http",
//             scheme: "bearer",
//             bearerFormat: "JWT",
//           },
//         },
//       },
//       security: [{ bearerAuth: [] }],
//     },
//   },
// }));
app.use("/docs", apiReference({
  theme: "saturn",
  spec: { content: openapiSpec },
}));

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
