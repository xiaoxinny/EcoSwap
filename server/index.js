const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const http = require("http");
const fs = require('fs');
const path = require('path');

require("dotenv").config();

app.use(express.json());

// Allow CORS from different endpoints
const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Defining the HTTP server to handle Socket IO
const server = http.createServer(app);

// Socket IO methods
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const chatHistory = {};
const staffRooms = {};

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUsername = null;
  let isStaff = false;

  socket.on('userJoin', ({ username }) => {
    if (!username) return;

    currentRoom = `room_${username}`;
    currentUsername = username;

    if (!chatHistory[currentRoom]) {
      chatHistory[currentRoom] = [];
    }

    const joinMessage = { sender: 'System', text: `${username} joined the chat.`, timestamp: new Date() };
    chatHistory[currentRoom].push(joinMessage);

    socket.join(currentRoom);
    io.to(currentRoom).emit('chatHistory', chatHistory[currentRoom]);
    io.to(currentRoom).emit('userJoinedRoom', joinMessage);

    if (!staffRooms[currentRoom]) {
      staffRooms[currentRoom] = [];
    }
    staffRooms[currentRoom].push(socket.id);
    io.emit('roomsList', Object.keys(staffRooms));
  });

  socket.on('staffLogin', ({ username }) => {
    currentUsername = username;
    isStaff = true;
    socket.emit('roomsList', Object.keys(staffRooms));
  });

  socket.on('staffJoinedRoom', ({ room, username }) => {
    currentRoom = room;
    currentUsername = username;

    const joinMessage = { sender: 'System', text: `Staff member ${username} joined the chat.`, timestamp: new Date() };
    if (!chatHistory[room]) {
      chatHistory[room] = [];
    }
    chatHistory[room].push(joinMessage);

    socket.join(room);
    io.to(room).emit('chatMessage', joinMessage);
  });

  socket.on('chatMessage', ({ room, msg, username }) => {
    if (!room || !msg) return;
    const message = { sender: username, text: msg, timestamp: new Date(), room: room };

    if (!chatHistory[room]) {
      chatHistory[room] = [];
    }
    console.log('Message:', message);
    chatHistory[room].push(message);
    io.to(room).emit('chatMessage', message); // Broadcast to room
  });

  // socket.on('userMessage', ({ msg }) => {
  //   if (!msg || !currentRoom) return;
  //   const message = { sender: currentUsername, text: msg, timestamp: new Date(), room: currentRoom };

  //   if (!chatHistory[currentRoom]) {
  //     chatHistory[currentRoom] = [];
  //   }
  //   console.log('userMessage:', message);
  //   chatHistory[currentRoom].push(message);
  //   io.to(currentRoom).emit('chatMessage', message); // Broadcast to room
  // });

  socket.on('disconnect', () => {
    if (currentRoom && currentUsername) {
      const leaveMessage = { sender: 'System', text: `${currentUsername} left the chat.`, timestamp: new Date() };

      if (chatHistory[currentRoom]) {
        chatHistory[currentRoom].push(leaveMessage);
        io.to(currentRoom).emit('chatMessage', leaveMessage);
      }

      if (staffRooms[currentRoom]) {
        staffRooms[currentRoom] = staffRooms[currentRoom].filter(id => id !== socket.id);
        if (staffRooms[currentRoom].length === 0) {
          delete staffRooms[currentRoom];
        }
      }

      io.emit('roomsList', Object.keys(staffRooms));
    }
  });
});

app.get('/downloadTranscript/:username', (req, res) => {
  const username = req.params.username;
  const room = `room_${username}`;
  if (!chatHistory[room]) {
    return res.status(404).send('Room not found');
  }

  const transcript = chatHistory[room].map(msg => `${new Date(msg.timestamp).toLocaleString()} - ${msg.sender}: ${msg.text}`).join('\n');
  const filePath = path.join(__dirname, `${username}-transcript.txt`);

  fs.writeFile(filePath, transcript, (err) => {
    if (err) {
      return res.status(500).send('Failed to generate transcript');
    }
    res.download(filePath, (err) => {
      if (err) {
        return res.status(500).send('Failed to download transcript');
      }
      fs.unlink(filePath, () => {});
    });
  });
});

// Base route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
const faqRoutes = require("./routes/faq.controller.js");
app.use("/faqs", faqRoutes);

// Sychronizing with database and launching the server
db.sequelize
  .sync({ alter: true })
  .then(() => {
    let port = process.env.APP_PORT;
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
