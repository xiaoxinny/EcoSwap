const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const eventRoutes = require('./routes/event.controller');
<<<<<<< Updated upstream
const loginRoutes = require('./routes/login.controller');

app.use('/api/events', eventRoutes);
app.use('/api', loginRoutes);
=======


app.use('/api/events', eventRoutes);

>>>>>>> Stashed changes


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


