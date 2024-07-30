import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function UserApp() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [joined, setJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(''); // Track current room

  useEffect(() => {
    if (joined) {
      socket.emit('userJoin', { username });

      const handleChatMessage = (message) => {
        if (message.room === currentRoom) { // Check if the message is from the current room
          setChatHistory((prev) => [...prev, message]);
        }
      };

      const handleChatHistory = (history) => {
        setChatHistory(history);
      };

      const handleUserJoinedRoom = (data) => {
        if (data.room === currentRoom) {
          setChatHistory((prev) => [
            ...prev,
            { sender: 'System', text: `${data.username} has joined the room.` }
          ]);
        }
      };

      socket.on('chatMessage', handleChatMessage);
      socket.on('chatHistory', handleChatHistory);
      socket.on('userJoinedRoom', handleUserJoinedRoom);

      return () => {
        socket.off('chatMessage', handleChatMessage);
        socket.off('chatHistory', handleChatHistory);
        socket.off('userJoinedRoom', handleUserJoinedRoom);
      };
    }
  }, [joined, currentRoom, username]);

  const handleJoinChat = () => {
    if (username.trim()) {
      setJoined(true);
      setCurrentRoom(`room_${username}`);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
        console.log('currentRoom:', currentRoom);
        console.log('message:', message);
      socket.emit('chatMessage', { room: currentRoom, msg: message, username });
      setMessage('');
    }
  };

  const handleDownloadTranscript = () => {
    fetch(`http://localhost:3001/downloadTranscript/${username}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username}-transcript.txt`;
        a.click();
      })
      .catch((err) => console.error('Failed to download transcript:', err));
  };

  return (
    <Container>
      {!joined ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Button variant="contained" onClick={handleJoinChat}>Join Chat</Button>
        </Box>
      ) : (
        <>
          <List>
            {chatHistory.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${msg.sender}: ${msg.text}`} secondary={new Date(msg.timestamp).toLocaleString()} />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSendMessage}>Send</Button>
          <Button variant="contained" onClick={handleDownloadTranscript}>Download Transcript</Button>
        </>
      )}
    </Container>
  );
}

export default UserApp;
