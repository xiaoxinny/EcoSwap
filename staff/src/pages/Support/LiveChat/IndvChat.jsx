import React, { useState, useEffect } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import http from "../../../http";

// Create socket connection outside of the component
const socket = io("http://localhost:3001");

function ChatRoom() {
  const navigate = useNavigate();
  const { room } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Join the room when component mounts
    console.log("Emitting staffJoin event");
    socket.emit("staffJoin", {
      room: `room_${room}`,
      username: localStorage.getItem("staffUsername"),
    });

    http
      .get(`/chat/room_${room}`)
      .then((res) => console.log(res.data))
      .then((res) =>
        res.map((entry) => ({
          sender: entry.username,
          text: entry.message,
          timestamp: entry.createdAt,
          room: entry.room_name,
        }))
      )
      .then((res) => setChatHistory(res));

    // Listen for incoming chat messages
    socket.on("chatMessage", (msg) => {
      setChatHistory((prevHistory) => [...prevHistory, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      // Send the message to the room
      socket.emit("chatMessage", {
        room: `room_${room}`,
        message: message,
        username: localStorage.getItem("staffUsername"),
      });
      setMessage(""); // Clear the message input
    }
  };

  const leaveChat = () => {
    // Optionally handle leaving the chat if needed
    socket.emit("staffLeave", { room: `room_${room}` });
    setChatHistory([]); // Clear the chat history
    setMessage(""); // Clear the message input
    navigate("/live-support");
  };

  return (
    <Container>
      <h2>Chat Room</h2>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          height: "60vh",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          padding: 2,
          borderRadius: "8px",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
          marginBottom: "16px",
        }}
      >
        <List>
          {chatHistory.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${msg.sender}: ${msg.text}`}
                secondary={new Date(msg.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
        <Button variant="contained" onClick={leaveChat}>
          Leave
        </Button>
      </Box>
    </Container>
  );
}

export default ChatRoom;
