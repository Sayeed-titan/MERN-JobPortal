// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require ("./routes/jobRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");


// Api tester Scalar
const scalar = require("@scalar/express-api-reference");
const apiReference = scalar.apiReference;
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server (server, {
  cors:{
    origin: "*", //later change it with React app url
    methods: ["GET", "Post"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);


// Load OpenAPI spec from file
const openapiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, "openapi.json"), "utf-8"));

app.use("/docs", apiReference({
  theme: "saturn",
  spec: { content: openapiSpec },
}));

// Simple Test Route
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Setup Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

// Join user-specific room for private messages/notifications
socket.on("join", (userId) => {
  socket.join(userId);
  console.log(`User ${userId} joined their room`);
});

  // Handle new message event
  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    // Save message in DB here if needed...
    io.to(receiverId).emit("newMessage", { senderId, content });
  });

  // Handle new notification
  socket.on("notify", ({ userId, notification }) => {
    io.to(userId).emit("newNotification", notification);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
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

module.exports = { app, server, io };
