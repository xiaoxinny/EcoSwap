const { Chats } = require('./models');
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const cors = require("cors");
const db = require("./models");
const http = require("http");
const fs = require('fs');
const path = require('path');
const sign = require('jsonwebtoken').sign;

require("dotenv").config();
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
const userRoute = require('./routes/Accounts/user');
app.use("/user", userRoute);

const staffRoute = require('./routes/Accounts/staff');
app.use("/staff", staffRoute);

// Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.APP_SECRET);
        res.redirect(`${process.env.CLIENT_URL}/account?token=${token}`);
    }
);

app.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

app.use(express.json());

// Initialize Passport
require('./config/passport-setup');

// Allow CORS from different endpoints
const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true
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
const faqRoutes = require("./routes/Support/faq.controller.js");
app.use("/faqs", faqRoutes);

const chatRoutes = require("./routes/Support/chats.controller.js");
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
