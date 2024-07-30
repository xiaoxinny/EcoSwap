const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/events', (req, res) => {
  const sql = "SELECT * FROM event_details";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result);
  });
});

router.get('/get_event/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM event_details WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result);
  });
});

router.post('/add', (req, res) => {
  const { title, picture, date, speaker, sponsors, description, venue } = req.body;
  const sql = 'INSERT INTO event_details (title, picture, date, speaker, sponsors, description, venue) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, picture, date, speaker, sponsors, description, venue], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Database query failed' });
    } else {
      res.status(201).json({ success: true, message: 'Event added successfully' });
    }
  });
});

router.post('/edit_user/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE event_details SET `title`=?, `picture`=?, `date`=?, `speaker`=?, `sponsors`=?, `description`=?, `venue`=? WHERE id=?";
  const values = [req.body.title, req.body.picture, req.body.date, req.body.speaker, req.body.sponsors, req.body.description, req.body.venue, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Something unexpected has occurred: " + err });
    }
    return res.json({ success: "Event updated successfully" });
  });
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM event_details WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Something unexpected has occurred: " + err });
    }
    return res.json({ success: "Event deleted successfully" });
  });
});

module.exports = router;
