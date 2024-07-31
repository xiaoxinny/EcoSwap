import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function IndvChat() {
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("staffUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      handleLogin(storedUsername);
    }

    socket.on('chatMessage', handleChatMessage);

    socket.on('staffJoinedRoom', handleStaffJoinedRoom);

    socket.on("roomsList", (roomsList) => {
      setRooms(roomsList);
    });

    socket.on("chatHistory", (history) => {
      setChatHistory((prev) => ({
        ...prev,
        [rooms[value]]: history,
      }));
    });

    return () => {
      socket.off("chatMessage");
      socket.off("roomsList");
      socket.off("chatHistory");
      socket.off("staffJoinedRoom");
    };

  }, [username, value, rooms, message, chatHistory, loggedIn]);

  const handleChatMessage = (message) => {
    console.log("handleChatMessage:", message);
    setChatHistory((prev) => {
      const chatHistory = { ...prev };
      if (!chatHistory[message.room]) {
        chatHistory[message.room] = [];
      }
      chatHistory[message.room].push(message);
      return chatHistory;
    });
  };

  const handleStaffJoinedRoom = (data) => {
    if (data.room === currentRoom) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'System', text: `${data.username} has joined the room.` }
      ]);
    }
  };

  const handleLogin = (staffUsername) => {
    socket.emit("staffLogin", { username: staffUsername });
    localStorage.setItem("staffUsername", staffUsername);
    setLoggedIn(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("currentRoom:", rooms[value]);
      console.log("message:", message);
      const storedUsername = localStorage.getItem("staffUsername");
      const room = rooms[value];
      socket.emit("chatMessage", { room, msg: message, username: username || storedUsername });
      setMessage("");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const room = rooms[newValue];
    socket.emit("staffJoinedRoom", { room, username });
  };

  const handleDownload = (room) => {
    fetch(`http://localhost:3001/downloadTranscript/${room}`) 
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${room}-transcript.txt`;
        a.click();
      })
      .catch((err) => console.error("Failed to download transcript:", err));
  };

  return (
    <Container>
      {!loggedIn ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => username && handleLogin(username)}
          >
            Login
          </Button>
        </Box>
      ) : (
        <>
        <h1>Sessions</h1>
          <Tabs value={value} onChange={handleChange} aria-label="chat rooms">
            {rooms.map((room, index) => (
              <Tab key={index} label={room} />
            ))}
          </Tabs>
          {rooms.length > 0 && (
            <Paper style={{ padding: "10px" }}>
              <List>
                {chatHistory[rooms[value]] &&
                  chatHistory[rooms[value]].map((msg, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${msg.sender}: ${msg.text}`}
                        secondary={new Date(msg.timestamp).toLocaleString()}
                      />
                    </ListItem>
                  ))}
              </List>
              <TextField
                label="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleSendMessage}>
                Send
              </Button>
              <Button
                variant="contained"
                onClick={() => handleDownload(rooms[value])}
              >
                Download Transcript
              </Button>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}

export default IndvChat;
