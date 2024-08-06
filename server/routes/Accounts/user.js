const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const axios = require('axios');
const { User } = require('../../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../../middlewares/auth');
const yup = require('yup');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

//Downloads the user picture from google login
const downloadImage = async (url, filepath) => {
    const writer = fs.createWriteStream(filepath);
  
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });
  
        response.data.pipe(writer);
  
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        writer.end(); // Close the writer in case of error
        throw error;
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// User register account
router.post('/register', async (req, res) => {
    let { email, password, role } = req.body;
    const validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number")
    });

    try {
        const data = await validationSchema.validate({ email, password, role }, { abortEarly: false });
        let user = await User.findOne({ where: { email: data.email } });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }
        data.password = await bcrypt.hash(data.password, 10);
        let result = await User.create(data);
        res.json({ message: `Email ${result.email} was registered successfully.` });
    } catch (err) {
        console.log(err)
        if (err instanceof yup.ValidationError) {
            res.status(400).json({ errors: err.errors });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

//User login
router.post('/login', async (req, res) => {
    let data = req.body;
    let errorMsg = "Email or password is not correct.";
    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let userInfo = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
    res.json({ accessToken, user: userInfo });
});

// Set password for Google login users
router.post('/set-password', async (req, res) => {
    const { email, username, password, profilePicture } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Download and save the Google profile picture
        const imageName = `${username}-${Date.now()}.jpg`;
        const imagePath = path.join(__dirname, '..', 'uploads', imageName);
        await downloadImage(profilePicture, imagePath);

        // Hash the password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            profilePicture: `uploads/${imageName}`, // Save the path to the image
        });

        // Generate JWT token
        let userInfo = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
        };
        const accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });

        res.json({ message: 'User created successfully', user: userInfo, accessToken });
    } catch (error) {
        console.error('Error setting password:', error);
        res.status(500).json({ message: 'Error setting username and password' });
    }
});
  
//Check whether if email is in database else create a new user (google login)
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            let userInfo = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            };
            let accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
            res.json({ accessToken, user: userInfo, exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking email' });
    }
});

router.get('/auth', validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
    };
    res.json({ user: userInfo });
});

//View profile
router.get('/profile', validateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['email', 'username', 'contactNumber', 'dateOfBirth', 'location', 'profilePicture']
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user details" });
    }
});

//Update profile
router.put('/profile', validateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, contactNumber, dateOfBirth, location } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (username) {
            // Check if the username is already taken
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            user.username = username;
        }

        if (username) user.username = username;
        if (contactNumber) user.contactNumber = contactNumber;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (location) user.location = location;

        if (req.file) user.profilePicture = req.file.path;

        await user.save();
        res.json({ message: "User details updated successfully" });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            res.status(400).json({ errors: err.errors });
        } else {
            console.error(err);
            res.status(500).json({ message: "Error updating user details" });
        }
    }
});

// Change Password
router.put('/change-password', validateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        if (newPassword.trim() === '') {
            return res.status(400).json({ message: 'New password cannot be empty.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while changing password.' });
    }
})

// This is for the staff to see all the users
router.get('/showusers', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// For staff to edit user
router.get('/showusers/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: ['email', 'username', 'contactNumber', 'dateOfBirth', 'location']
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

// For staff to edit and make changes to user account
router.put('/showusers/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, username, contactNumber, dateOfBirth, location, password } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) user.email = email;
        if (username) user.username = username;
        if (contactNumber) user.contactNumber = contactNumber;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (location) user.location = location;

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user details' });
    }
});

// For staff to delete user account
router.delete('/showusers/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.destroy({ where: { id: userId } });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// User to set their user name after creating new account (non google)
router.put('/set-username', validateToken, async (req, res) => {
    const { username } = req.body;
    const userId = req.user.id;

    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Update the username in the database
        await User.update({ username }, { where: { id: userId } });
        res.json({ username });
    } catch (error) {
        res.status(500).json({ message: 'Error setting username' });
    }
});


module.exports = router;
