const { Chats } = require("../models");
const yup = require("yup");
const express = require("express");
const router = express.Router();

const validationSchema = yup.object({
  socket_id: yup.string().trim().min(3).max(255).required(),
  room_name: yup.string().trim().min(3).max(255).required(),
  chat_data: yup
    .object({
      users: yup.array().of(yup.string().trim().min(1).max(255)).required(),
      messages: yup.array().of(
        yup.object({
          sender: yup.string().trim().min(1).max(255).required(),
          text: yup.string().trim().min(1).required(),
        })
      ).required(),
    })
    .required(),
});

// Create new chat entry
router.post("/", async (req, res) => {
  try {
    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    const result = await Chats.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

router.get("/:socket_id", async (req, res) => {
  try {
    const chat = await Chats.findOne({
      where: { socket_id: req.params.socket_id },
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

// Update chat entry
router.put("/:socket_id", async (req, res) => {
  try {
    const data = await validationSchema.validate(req.body, {
      abortEarly: false,
    });

    // Update chat entry
    const [updated] = await Chats.update(data, {
      where: { socket_id: req.params.socket_id },
    });

    if (updated) {
      // Fetch the updated entry
      const updatedChat = await Chats.findOne({
        where: { socket_id: req.params.socket_id },
      });
      res.json(updatedChat);
    } else {
      res.status(404).json({ message: "Chat entry not found" });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors || err.message });
  }
});

// Delete chat entry
router.delete("/:socket_id", async (req, res) => {
  try {
    const deleted = await Chats.destroy({
      where: { socket_id: req.params.socket_id },
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
