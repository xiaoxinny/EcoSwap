import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Container,
  Divider,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");
var messageCounts = {};

function Chats() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [information, setInformation] = useState({});

  useEffect(() => {
    //TODO: Integrate Bernard's profile service 
    const storedUsername = localStorage.getItem("staffUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      handleLogin(storedUsername);
    }

    const handleInformation = (data) => {
      setInformation(data);
      Object.keys(data).forEach((room) => {

        // Check if the room exists in messageCounts, else initialize it
        if (messageCounts[room] !== undefined) {
          messageCounts[room] += data[room].counter;
        } else {
          messageCounts[room] = data[room].counter;
        }
    
        console.log(`Updated messageCounts for ${room}:`, messageCounts[room]);
      });
    }

    socket.on("updateInformation", handleInformation);

    return () => {
      socket.off("updateInformation", handleInformation);
    };
  }, []);

  const handleLogin = (staffUsername) => {
    socket.emit("staffLogin", { username: staffUsername });
    localStorage.setItem("staffUsername", staffUsername);
    setLoggedIn(true);
  };

  const handleRoomClick = (socket) => {
    console.log("Navigating to room:", socket);
    navigate(`/live-support/${socket}`);
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
        <Container>
          <h1>Active Chats</h1>
          <Divider></Divider>
          <p>Click on any to begin chatting.</p>
          <List>
            {Object.keys(information).map((room, index) => (
              <ListItem key={index} id={room} sx={{backgroundColor:'white', border:"1px solid rgba(0,0,0,0.2)", borderRadius:"5px"}} onClick={() => handleRoomClick(room.slice(5))}>
                <ListItemText
                  primary={`${information[room].username}`}
                  secondary={`${information[room].currentMessage.sender}: ${information[room].currentMessage.text}`}
                />
                <Badge badgeContent={messageCounts[room]} color="error">
                  <NotificationsIcon />
                </Badge>
              </ListItem>
            ))}
          </List>
        </Container>
        <Container>
          <h1>History</h1>
          <Divider></Divider>
        </Container>
        </>
      )}
    </Container>
  );
}

export default Chats;