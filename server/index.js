const { Chats } = require('./models');
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

io.on('connection', (socket) => {

  socket.on("chatMessage", (msg) => {
    const currentMessage = { sender: msg.username, text: msg.msg, timestamp: new Date(), room: msg.room };

    socket.join(msg.room);
    io.to(msg.room).emit("chatMessage", currentMessage);
    io.emit('chatDetails', {identifier: msg.socket, room: msg.room, sender: msg.username, message: msg.msg, timestamp: new Date()});
  });

  socket.on("userJoin", (data) => {
    console.log('User joined:', data);
    if (!data) return;

    socket.join(data.room);

    io.to(data.room).emit("chatMessage", { sender: 'System', text: `User ${data.username} joined the chat.`, timestamp: new Date(), room: data.room });
    io.emit("chatDetails", {identifier: data.socket, room: data.room, sender: data.username, message: data.msg, timestamp: new Date()});
  });

  socket.on('staffJoin', (data) => {
    console.log('Staff joined:', data);
    if (!data) return;

    socket.join(data.room);
 
    io.to(data.room).emit("chatMessage", { sender: 'System', text: `Staff member ${data.username} joined the chat.`, timestamp: new Date() });
  });

  socket.on('sessionEnd', (data) => {
    console.log('User disconnected');
    io.to(data.room).emit('chatMessage', { sender: 'System', text: `User ${data.username} disconnected`, timestamp: new Date(), room: data.room });
    socket.leave(data.room);

  });

  socket.on('staffLeave', (data) => {
    console.log('Staff disconnected');
    io.to(data.room).emit('chatMessage', { sender: 'System', text: `Staff disconnected`, timestamp: new Date(), room: data.room });
    socket.leave(data.room);

  });


  // socket.on('staffLogin', ({ username }) => {
  //   currentUsername = username;
  //   isStaff = true;
  //   socket.emit('roomsList', Object.keys(staffRooms));
  // });

  // socket.on('staffJoinedRoom', ({ room, username }) => {
  //   currentRoom = room;
  //   currentUsername = username;

  //   const joinMessage = { sender: 'System', text: `Staff member ${username} joined the chat.`, timestamp: new Date() };
  //   if (!chatHistory[room]) {
  //     chatHistory[room] = [];
  //   }
  //   chatHistory[room].push(joinMessage);

  //   socket.join(room);
  //   io.to(room).emit('chatMessage', joinMessage);
  // });

  // socket.on('chatMessage', ({ room, msg, username }) => {
  //   if (!room || !msg) return;
  //   const message = { sender: username, text: msg, timestamp: new Date(), room: room };

  //   if (!chatHistory[room]) {
  //     chatHistory[room] = [];
  //   }
  //   console.log('Message:', message);
  //   chatHistory[room].push(message);
  //   io.to(room).emit('chatMessage', message); // Broadcast to room
  // });

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

//   socket.on('disconnect', () => {
//     if (currentRoom && currentUsername) {
//       const leaveMessage = { sender: 'System', text: `${currentUsername} left the chat.`, timestamp: new Date() };

//       if (chatHistory[currentRoom]) {
//         chatHistory[currentRoom].push(leaveMessage);
//         io.to(currentRoom).emit('chatMessage', leaveMessage);
//       }

//       if (staffRooms[currentRoom]) {
//         staffRooms[currentRoom] = staffRooms[currentRoom].filter(id => id !== socket.id);
//         if (staffRooms[currentRoom].length === 0) {
//           delete staffRooms[currentRoom];
//         }
//       }

//       io.emit('roomsList', Object.keys(staffRooms));
//     }
//   });
});

app.get('/downloadTranscript/:socket_id', async (req, res) => {
  const socketId = req.params.socket_id;

  try {
    const chatEntry = await Chats.findOne({ where: { socket_id: socketId } });

    if (!chatEntry) {
      return res.status(404).send('Chat entry not found');
    }

    const { room_name, chat_data } = chatEntry;
    
    const transcript = chat_data.messages
      .map(msg => `${new Date().toLocaleString()} - ${msg.sender}: ${msg.text}`)
      .join('\n');

    const filePath = path.join(__dirname, `${socketId}-transcript.txt`);

    fs.writeFile(filePath, transcript, (err) => {
      if (err) {
        return res.status(500).send('Failed to generate transcript');
      }

      res.download(filePath, (err) => {
        if (err) {
          return res.status(500).send('Failed to download transcript');
        }

        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete transcript file');
        });
      });
    });
  } catch (err) {
    console.error('Error fetching chat entry:', err);
    res.status(500).send('Internal server error');
  }
});

// Base route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
const faqRoutes = require("./routes/faq.controller.js");
app.use("/faqs", faqRoutes);

const chatRoutes = require("./routes/chats.controller.js");
app.use("/chats", chatRoutes);

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
