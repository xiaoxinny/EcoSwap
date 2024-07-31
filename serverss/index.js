const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const http = require("http");

require("dotenv").config();

app.use(express.json());

// Allow CORS from different endpoints
const corsOptions = {
  origin: "http://localhost:4000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Defining the HTTP server to handle Socket IO
const server = http.createServer(app);

// Socket IO methods
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handle user messages
  socket.on("userMessage", (msg) => {
    console.log("User message: " + msg);
    io.emit("userMessage", msg);
  });

  // Handle staff messages
  socket.on("staffMessage", (msg) => {
    console.log("Staff message: " + msg);
    io.emit("staffMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Base route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
const faqRoutes = require("./routes/faq.controller.js");
app.use("/faqs", faqRoutes);

// const chatRoutes = require("./routes/chats.controller.js");
// app.use("/chats", chatRoutes);

// const emailRoutes = require("./routes/email.controller.js");
// app.use("/email", emailRoutes);

// const violationRoutes = require("./routes/violations.controller.js");
// app.use("/violations", violationRoutes);

// const appealRoutes = require("./routes/appeals.controller.js");
// app.use("/appeals", appealRoutes);


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
