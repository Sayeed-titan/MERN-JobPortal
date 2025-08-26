const Message = require("../models/Message");
const Notification = require("../models/Notification");


// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, jobId } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content,
      jobId
    });

    // Trigger notification for receiver
    await Notification.create({
      user: receiver,          // the recipient
      type: "message",
      referenceId: message._id
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params; // conversation with this user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 }); // chronological

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
