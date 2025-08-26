const Message = require("../models/Message");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, jobId } = req.body;

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      jobId
    });

    await message.save();
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
