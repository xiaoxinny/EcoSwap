import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { io } from "socket.io-client";
import http from "../../http";

const socket = io("http://localhost:3001");

function UserChat() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [joined, setJoined] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // All handlers for ON events from server
  useEffect(() => {
    if (joined) {
      const handleChatMessage = (message) => {
        setChatHistory((prev) => [...prev, message]);
      };

      socket.on("chatMessage", handleChatMessage);

      return () => {
        socket.off("chatMessage", handleChatMessage);
      };
    }
  }, [joined, roomName, username]);

  // Handler for when user joins the chat
  const handleJoinChat = () => {
    if (username.trim()) {
      setJoined(true);
      setRoomName(`room_${socket.id}`);

      const data = {
        room: `room_${socket.id}`,
        username: username,
      };

      socket.emit("userJoin", data);

      // Create a new room entry in the database
      http.post("/rooms", {
        socket_id: socket.id,
        room_name: `room_${socket.id}`,
        status: true,
      });

      // Initialize chat data for the new room
      http.post("/chat", {
        room_name: `room_${socket.id}`,
        username: username,
        message: `User ${username} joined the chat.`,
      });
    }
  };

  // Handler for when user sends a message
  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", {
        room: roomName,
        username: username,
        message: message,
      });

      // Create a new chat entry in the database
      http.post("/chat", {
        room_name: roomName,
        username: username,
        message: message,
      });

      setMessage("");
    }
  };

  // Handler for opening the exit confirmation dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handler for closing the exit confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handler for confirming exit
  const handleConfirmExit = () => {
    socket.emit("sessionEnd", {
      room: roomName,
      username: username,
    });

    // Update the room entry in the database
    http.put(`/rooms/${roomName}`, {
      status: false,
    });

    setJoined(false);
    setUsername("");
    setMessage("");
    setRoomName("");
    setChatHistory([]);
    handleCloseDialog();
    navigate("/support/livechat");
  };

  // Handler for downloading chat transcript
  const handleDownloadTranscript = () => {
    console.log("Download transcript");
    http.get(
      `/chat/${roomName}`.then((res) => {
        res
          .blob()
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${username}-transcript.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch((err) => console.error("Failed to fetch chat history:", err));
      })
    );
  };

  return (
    <Container sx={{ display: "flex", alignItems: "center" }}>
      {!joined ? (
        <Container
          sx={{ height: "70vh", display: "flex", alignItems: "center" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ChatIcon style={{ fontSize: 60 }} />
              <h1 style={{ marginTop: 0 }}>Live Chat</h1>
              <Divider></Divider>
              <p>
                To begin a session, please enter the name you would like to be
                addressed by.
              </p>
              <p>
                Once in a chat, please remain patient whilst we assign you the
                next available agent.
              </p>
              <p>
                At the end of the session, you may choose to keep a copy of your
                responses for future reference.
              </p>
              <p>
                <strong>We hope you enjoy our service.</strong>
              </p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <p>
                  <strong>Please enter your username.</strong>
                </p>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mt: 2, mb: 3, width: "45%" }}
                />
                <Button
                  variant="contained"
                  onClick={handleJoinChat}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkgrey",
                    },
                    width: "45%",
                    borderRadius: "99999px",
                  }}
                >
                  Join Chat
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container>
          <h1>Chat</h1>
          <Box
            sx={{
              border: "1px solid rgb(0,0,0,0.1)",
              borderRadius: "99999px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
              boxShadow: "0px 3px 3px rgb(0,0,0,0.2)",
              gap: 12,
            }}
          >
            <Box
              sx={{
                border: "1px solid rgb(0,0,0,0.1)",
                borderRadius: "99999px",
                maxWidth: "25%",
                px: 2,
              }}
            >
              <p>
                <strong>Chat Room:</strong> {roomName}
              </p>
            </Box>
            <Box
              sx={{
                border: "1px solid rgb(0,0,0,0.1)",
                borderRadius: "99999px",
                maxWidth: "25%",
                px: 2,
              }}
            >
              <p>
                <strong>Assigned Staff</strong>
              </p>
            </Box>
            <Box
              sx={{
                border: "1px solid rgb(0,0,0,0.1)",
                borderRadius: "99999px",
                maxWidth: "25%",
                px: 2,
              }}
            >
              <p>
                <strong>Status</strong>
              </p>
            </Box>
          </Box>
          <Box
            sx={{
              height: "40vh",
              border: "1px solid rgb(0,0,0,0.2)",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
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
          </Box>
          <TextField
            label="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box
            sx={{
              my: 3,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkgrey",
                },
                borderRadius: "99999px",
              }}
            >
              Send
            </Button>
            <Box
              sx={{
                display: "flex",
                gap: 2, // Adds spacing between the buttons inside this box
              }}
            >
              <Button
                variant="contained"
                onClick={handleDownloadTranscript}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkgrey",
                  },
                  borderRadius: "99999px",
                }}
              >
                Download Transcript
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleOpenDialog}
                sx={{ borderRadius: "99999px" }}
              >
                End Session
              </Button>
            </Box>
          </Box>

          {/* Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>End Session</DialogTitle>
            <DialogContent>
              <p>
                Are you sure you want to end the session? This action cannot be
                undone.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmExit} color="secondary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Container>
  );
}

export default UserChat;
