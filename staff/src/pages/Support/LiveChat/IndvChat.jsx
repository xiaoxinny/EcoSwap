import React, { useState, useEffect, useRef } from "react";
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

// Create socket connection outside of the component
const socket = io("http://localhost:3001");

function ChatRoom() {
  const navigate = useNavigate();
  const { identifier } = useParams(); // Get the room identifier from the URL
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const hasJoinedRef = useRef(false); // Ref to track if staffJoin has been emitted

  useEffect(() => {
    console.log("useEffect triggered with identifier:", identifier);

    if (!hasJoinedRef.current) {
      // Join the room when component mounts
      console.log("Emitting staffJoin event");
      socket.emit("staffJoin", { room: `room_${identifier}`, username: "Staff" });
      hasJoinedRef.current = true; // Set the ref to true after emitting
    }

    // Listen for incoming chat messages
    socket.on("chatMessage", (msg) => {
      setChatHistory((prevHistory) => [...prevHistory, msg]);
    });

    // Clean up the event listener when component unmounts
    return () => {
      console.log("Cleaning up chatMessage listener and emitting staffLeave event");
      socket.off("chatMessage");
    };
  }, [identifier]); // This useEffect should only run when 'identifier' changes

  const sendMessage = () => {
    if (message.trim()) {
      // Send the message to the room
      socket.emit("chatMessage", { room: `room_${identifier}`, msg: message, username: "Staff" });
      setMessage(""); // Clear the message input
    }
  };

  const leaveChat = () => {
    // Optionally handle leaving the chat if needed
    socket.emit("staffLeave", { room: `room_${identifier}` });
    setChatHistory([]); // Clear the chat history
    setMessage(""); // Clear the message input
    navigate("/live-support");
  }

  return (
    <Container>
      <h2>Chat Room {identifier}</h2>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          height: "60vh",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          padding: 2,
          borderRadius: "8px",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
          marginBottom: "16px"
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
        <Button variant="contained" onClick={leaveChat}>Leave</Button>
      </Box>
    </Container>
  );
}

export default ChatRoom;
