const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Staff } = require('../models')
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const yup = require('yup');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });
 
router.post('/staff-register', async (req, res) => {
    const { email, password, username, phoneNumber } = req.body;

    // Validation schema
    const validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(100).required(),
        password: yup.string().trim().min(8).max(100).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
        username: yup.string().trim().max(50),
        phoneNumber: yup.string().trim().max(20),
    });

    try {
        const data = await validationSchema.validate({ email, password, username, phoneNumber }, { abortEarly: false });

        // Check if email or username already exists
        let existingStaff = await Staff.findOne({
            where: {
                [Op.or]: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        });

        if (existingStaff) {
            if (existingStaff.email === data.email) {
                return res.status(400).json({ message: "Email already exists." });
            }
            if (existingStaff.username === data.username) {
                return res.status(400).json({ message: "Username already exists." });
            }
        }

        data.password = await bcrypt.hash(data.password, 10);
        let newStaff = await Staff.create(data);
        res.json({ message: `Staff ${newStaff.email} registered successfully.` });
    } catch (err) {
        console.error("Error during staff registration:", err); // Log the error
        if (err instanceof yup.ValidationError) {
            res.status(400).json({ errors: err.errors });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});


// Staff login route
router.post('/staff-login', async (req, res) => {
    const { email, password } = req.body;
    const errorMsg = "Email or password is incorrect.";
  
    try {
      const staff = await Staff.findOne({ where: { email } });
      if (!staff) {
        return res.status(400).json({ message: errorMsg });
      }
  
      const match = await bcrypt.compare(password, staff.password);
      if (!match) {
        return res.status(400).json({ message: errorMsg });
      }
  
      const staffInfo = {
        id: staff.id,
        email: staff.email,
        username: staff.username,
        role: staff.role
      };
      const accessToken = sign(staffInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
      res.json({ accessToken, staff: staffInfo });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })

router.get('/auth', validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
    };
    res.json({ user: userInfo });
});

// Get logged-in staff profile
router.get('/staff-profile', validateToken, async (req, res) => {
    try {
      const staff = await Staff.findByPk(req.user.id, {
        attributes: ['email', 'username', 'phoneNumber', 'profilePicture', 'role']
      });
      res.json(staff);
    } catch (err) {
      res.status(500).json({ message: "Error fetching staff details" });
    }
  });

router.put('/staff-profile', validateToken, upload.single('profilePicture'), async (req, res) => {
    try {
      const { username, phoneNumber } = req.body;
      const staff = await Staff.findByPk(req.user.id);
  
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      if (username) staff.username = username;
      if (phoneNumber) staff.phoneNumber = phoneNumber;
      if (req.file) staff.profilePicture = req.file.path;
  
      await staff.save();
      res.json({ message: "Staff details updated successfully" });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        res.status(400).json({ errors: err.errors });
      } else {
        res.status(500).json({ message: "Error updating staff details" });
      }
    }
  });

// Change password route
router.put('/staff-change-password', validateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      const staff = await Staff.findByPk(req.user.id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found.' });
      }
  
      const match = await bcrypt.compare(currentPassword, staff.password);
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }
  
      if (newPassword.trim() === '') {
        return res.status(400).json({ message: 'New password cannot be empty.' });
      }
  
      staff.password = await bcrypt.hash(newPassword, 10);
      await staff.save();
  
      res.json({ message: 'Password changed successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error while changing password.' });
    }
  });

router.get('/showstaff', async (req, res) => {
    try {
      const staff = await Staff.findAll();
      res.json({ staff });
    } catch (err) {
      res.status(500).json({ message: "Error fetching staff" });
    }
  })

router.get('/showstaff/:id', async (req, res) => {
    try {
      const staffId = req.params.id;
      const staff = await Staff.findByPk(staffId, {
        attributes: ['email', 'username', 'phoneNumber', 'profilePicture']
      });
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
      res.json({ staff });
    } catch (err) {
      res.status(500).json({ message: "Error fetching staff" });
    }
  });

router.delete('/showstaff/:id', async (req, res) => {
    try {
      const staffId = req.params.id;
      await Staff.destroy({ where: { id: staffId } });
      res.json({ message: "Staff deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting staff" });
    }
  });
module.exports = router;
