const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "events",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL server.");
  }
});

app.post("/register", (req, res) => {
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


app.post("/login", (req, res) => {
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


app.get("/events", (req, res) => {
  const sql = "SELECT * FROM event_details";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result);
  });
});


app.get("/get_event/:id", (req, res) => {
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


app.post("/edit_user/:id", (req, res) => {
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


app.delete("/delete/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.post('/add', (req, res) => {
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
