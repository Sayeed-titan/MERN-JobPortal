const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  type: { type: String, required: true }, // e.g., "APPLICATION_RECEIVED", "MESSAGE"
  message: { type: String, required: false }, // notification text
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // optional
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // e.g., applicationId, messageId
  isRead: { type: Boolean, default: false },
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("Notification", notificationSchema);
