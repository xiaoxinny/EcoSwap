const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const sign = require('jsonwebtoken').sign; // Ensure you have this for JWT signing

require('dotenv').config();

// Initialize Passport
require('./config/passport-setup');

const app = express();
app.use(express.static('public'));

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoute = require('./routes/user');
app.use("/user", userRoute);

const staffRoute = require('./routes/staff');
app.use("/staff", staffRoute);

const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

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

// Start Server
const db = require('./models'); // Adjust as necessary
db.sequelize.sync({ alter: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚡ Server running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
