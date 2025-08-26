const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, getConversation } = require("../controllers/messageController");

// Send a message
router.post("/", protect, sendMessage);

// Get conversation with a user
router.get("/:userId", protect, getConversation);

module.exports = router;
