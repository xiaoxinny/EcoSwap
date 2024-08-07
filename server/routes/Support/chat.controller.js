const { Chat } = require("../../models");
const yup = require("yup");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 

const validationSchema = yup.object({
  room_name: yup.string().trim().min(3).max(255).required(),
  username: yup.string().trim().min(3).max(255).required(),
  message: yup.string().trim().min(1).required(),
  createdAt: yup.date().default(() => new Date()),
  updatedAt: yup.date().default(() => new Date()),
});

// Create new chat entry
router.post("/", async (req, res) => {
  try {
    // Generate a random 32-character alphanumeric string for message_id
    const message_id = uuidv4().replace(/-/g, '').slice(0, 32);

    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    const result = await Chat.create({ ...data, message_id });
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Get all chat entries for a specific room
router.get("/:room_name", async (req, res) => {
  try {
    const chat = await Chat.findAll({
      where: { room_name: req.params.room_name },
    });
    res.json(chat);
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});


// Get chat entry (specific)
router.get("/:message_id", async (req, res) => {
  try {
    const chat = await Chat.findOne({
      where: { message_id: req.params.message_id },
    });
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ message: "Chat entry not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Update chat entry (specific)
router.put("/:message_id", async (req, res) => {
  try {
    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    // Update chat entry
    const [updated] = await Chat.update(data, {
      where: { message_id: req.params.message_id },
    });

    if (updated) {
      // Fetch the updated entry
      const updatedChat = await Chat.findOne({
        where: { message_id: req.params.message_id },
      });
      res.json(updatedChat);
    } else {
      res.status(404).json({ message: "Chat entry not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Delete chat entry (not used)
router.delete("/:message_id", async (req, res) => {
  try {
    const deleted = await Chat.destroy({
      where: { message_id: req.params.message_id },
    });

    if (deleted) {
      res.json({ message: "Chat entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Chat entry not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

module.exports = router;