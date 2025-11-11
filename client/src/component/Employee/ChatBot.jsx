import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Fab,
  Box,
  TextField,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your Leave Assistant. You can ask about your leave balance, leave types, holidays, or how to apply for leave.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const userId = localStorage.getItem("userId") || "guest";

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/chat?message=${encodeURIComponent(
          message
        )}&userId=${userId}`
      );

      const botReply = res.data.reply || "Hmm, I couldn’t find that information.";
      setChatHistory((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error connecting to Leave Assistant. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 1000,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 30,
            width: 340,
            height: 480,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: "#1976d2",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Leave Assistant 🤖
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#f5f6fa",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatHistory.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.sender === "user" ? "#1976d2" : "#e9ecef",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Input Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #ddd",
              p: 1,
              backgroundColor: "#fff",
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Ask about leave..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatBot;
