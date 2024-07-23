const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const http = require("http");

require("dotenv").config();

app.use(express.json())


const corsOptions = {
  origin: 'http://localhost:4000',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));


// Routes
const faqRoutes = require("./routes/faq.controller.js");
app.use("/faqs", faqRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

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
