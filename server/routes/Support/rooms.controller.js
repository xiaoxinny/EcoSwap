const { Rooms } = require("../../models");
const yup = require("yup");
const express = require("express");
const router = express.Router();

const validationSchema = yup.object({
  socket_id: yup.string().trim().min(3).max(255).required(),
  room_name: yup.string().trim().min(3).max(255).required(),
  status: yup.boolean().default(true),
  createdAt: yup.date().default(() => new Date()),
  updatedAt: yup.date().default(() => new Date()),
});

// Create new room entry
router.post("/", async (req, res) => {
  try {
    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    const result = await Rooms.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Get all room entries
router.get("/", async (req, res) => {
  try {
    const rooms = await Rooms.findAll();
    res.json(rooms);
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Obtain information of room entry
router.get("/:room_name", async (req, res) => {
  try {
    const room = await Rooms.findOne({
      where: { room_name: req.params.room_name },
    });
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: "Room entry not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Update information of room entry
router.put("/:room_name", async (req, res) => {
  try {
    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    const updated = await Rooms.update(data, {
      where: { room_name: req.params.room_name },
    });
    if (updated) {
      res.json({ message: "Room updated" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Delete room entry
router.delete("/:room_name", async (req, res) => {
  try {
    const deleted = await Rooms.destroy({
      where: { room_name: req.params.room_name },
    });
    if (deleted) {
      res.json({ message: "Room deleted" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

module.exports = router;