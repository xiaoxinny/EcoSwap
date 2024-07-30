const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you create a db.js file to handle database connection

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (`username`, `email`, `password`, `is_staff`) VALUES (?, ?, ?, ?)";
  const values = [username, email, password, false]; 

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error: " + err });
    }
    return res.json({ success: "User registered successfully" });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error: " + err });
    }

    if (result.length > 0) {
      const user = result[0];
      const isStaff = user.is_staff;
      return res.json({ success: true, isStaff });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

module.exports = router;
