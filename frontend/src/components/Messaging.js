import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Typography, Paper } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const Messaging = ({ conversationWith }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.get(`/messages/${conversationWith}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (conversationWith) fetchMessages();
  }, [conversationWith]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await axiosInstance.post("/messages", { receiver: conversationWith, content: newMessage });
      setNewMessage("");
      fetchMessages(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h5" mb={2}>Chat</Typography>
      <Paper sx={{ maxHeight: 400, overflowY: "auto", p: 2, mb: 2 }}>
        <Stack spacing={1}>
          {messages.map((msg) => (
            <Box
              key={msg._id}
              sx={{
                alignSelf: msg.sender === conversationWith ? "flex-start" : "flex-end",
                bgcolor: msg.sender === conversationWith ? "#f0f0f0" : "#1976d2",
                color: msg.sender === conversationWith ? "#000" : "#fff",
                borderRadius: 2,
                p: 1,
                maxWidth: "80%",
              }}
            >
              {msg.content}
            </Box>
          ))}
        </Stack>
      </Paper>
      <Stack direction="row" spacing={1}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          fullWidth
          placeholder="Type a message"
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Stack>
    </Box>
  );
};

export default Messaging;
