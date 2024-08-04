

require('dotenv').config();
const requestsRouter = require('./routes/requests');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { validateToken } = require('./middlewares/auth'); // Import the auth middleware


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
app.use('/api', requestsRouter);

const requestRoute = require('./routes/requests')
app.use('/request', requestRoute)

// app.post('/request', (req, res) => {
//     const { tutorialbuyer, message, tutorialtitle } = req.body;
//     // Handle the request logic here
//     console.log(`Received request from buyer : ${tutorialbuyer} with message: ${message} for the product : ${tutorialtitle}`);
//     res.status(200).send({ success: true });
//   });


const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });