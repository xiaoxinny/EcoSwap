const { Chat } = require('./models');
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const cors = require("cors");
const db = require("./models");
const http = require("http");
const path = require('path');
const sign = require('jsonwebtoken').sign;

app.use(express.json());

require("dotenv").config();
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false
}));

// Accounts Routes
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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


// Initialize Passport
require('./config/passport-setup');

// Allow CORS from different endpoints
const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Base route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Support Routes
const faqRoutes = require("./routes/Support/faq.controller.js");
app.use("/faqs", faqRoutes);

const chatRoutes = require("./routes/Support/chat.controller.js");
app.use("/chat", chatRoutes);

const roomRoutes = require("./routes/Support/rooms.controller.js");
app.use("/rooms", roomRoutes);

// Defining the HTTP server to handle Socket IO
const server = http.createServer(app);

// Socket IO methods
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const information = {};

io.on('connection', (socket) => {
  // User/Staff sends a message to the room specified
  socket.on("chatMessage", (message) => {
    const currentMessage = { sender: message.username, text: message.message, timestamp: new Date(), room: message.room };
    io.to(message.room).emit("chatMessage", currentMessage);
    information[message.room] = { username: message.username, currentMessage, counter: 1 };
    io.emit("updateInformation", information);
  });

  // User joins the chat, should only be called once
  socket.on("userJoin", (data) => {
    console.log('User joined:', data);
    if (!data) return;

    socket.join(data.room);

    const currentMessage = { sender: 'System', text: `User ${data.username} joined the chat.`, timestamp: new Date(), room: data.room };
    information[data.room] = { username: data.username, currentMessage, counter: 1 };
    io.to(data.room).emit("chatMessage", currentMessage);
    io.emit("updateInformation", information);
    information[data.room].counter = 0;
  });

  // Staff joins the chat, should only be called once
  socket.on('staffJoin', (data) => {
    console.log('Staff joined:', data);
    if (!data) return;
    socket.join(data.room);
    io.to(data.room).emit("chatMessage", { sender: 'System', text: `Staff ${data.username} joined the chat.`, timestamp: new Date(), room: data.room });
  });

  // User disconnects from the chat
  socket.on('sessionEnd', (data) => {
    console.log('User disconnected');
    io.to(data.room).emit('chatMessage', { sender: 'System', text: `User ${data.username} disconnected`, timestamp: new Date(), room: data.room });
    socket.leave(data.room);
    // rooms.pop(data.room);
    // socket.emit("roomList", rooms);
  });
});

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
