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
} from "@mui/material";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Chats() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const roomsRef = useRef(rooms);

  useEffect(() => {
    const storedUsername = localStorage.getItem("staffUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      handleLogin(storedUsername);
    }

    const handleDetails = (data) => {
      const index = roomsRef.current.findIndex(
        (item) => item.identifier === data.identifier
      );
      if (index !== -1) {
        setRooms((prevRooms) => {
          const newRooms = [...prevRooms];
          newRooms[index] = data;
          roomsRef.current = newRooms;
          return newRooms;
        });
      } else {
        setRooms((prevRooms) => {
          const newRooms = [...prevRooms, data];
          roomsRef.current = newRooms;
          return newRooms;
        });
      }
    };

    socket.on("chatDetails", handleDetails);

    return () => {
      socket.off("chatDetails", handleDetails);
    };
  }, []);

  const handleLogin = (staffUsername) => {
    socket.emit("staffLogin", { username: staffUsername });
    localStorage.setItem("staffUsername", staffUsername);
    setLoggedIn(true);
  };

  const handleRoomClick = (identifier) => {
    navigate(`/live-support/${identifier}`);
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
        <Container>
          <h1>Chats</h1>
          <Divider></Divider>
          <p>Click on any to begin chatting.</p>
          <List>
            {rooms.map((data, index) => (
              <ListItem key={index} id={data.identifier} sx={{backgroundColor:'white', border:"1px solid rgba(0,0,0,0.2)", borderRadius:"5px"}} button onClick={() => handleRoomClick(data.identifier)}>
                <ListItemText
                  primary={`${data.sender}: ${data.message}`}
                  secondary={new Date(data.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      )}
    </Container>
  );
}

export default Chats;