const express = require("express");
const router = express.Router();
const { User, Tutorial } = require("../../EcoSwap-amos/amos/server/models");
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require("../../EcoSwap-amos/amos/server/middlewares/auth");

router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;
  // Validate request body
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    category: yup.string().required(),
    condition: yup.string().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    let result = await Tutorial.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 tutorials per page if not specified
  const search = req.query.search;
  let condition = {};

  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  try {
    const { count, rows } = await Tutorial.findAndCountAll({
      where: condition,
      order: [["createdAt", "DESC"]],
      include: { model: User, as: "user", attributes: ["name"] },
      limit: limit,
      offset: (page - 1) * limit, // Calculate the offset
    });

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tutorialsPerPage: limit,
      totalTutorials: count,
      tutorials: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tutorials", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let tutorial = await Tutorial.findByPk(id, {
    include: { model: User, as: "user", attributes: ["name"] },
  });
  // Check id not found
  if (!tutorial) {
    res.sendStatus(404);
    return;
  }
  res.json(tutorial);
});

router.put("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let tutorial = await Tutorial.findByPk(id);
  if (!tutorial) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (tutorial.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100),
    description: yup.string().trim().min(3).max(500),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    let num = await Tutorial.update(data, {
      where: { id: id },
    });
    if (num == 1) {
      res.json({
        message: "Tutorial was updated successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot update tutorial with id ${id}.`,
      });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let tutorial = await Tutorial.findByPk(id);
  if (!tutorial) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (tutorial.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let num = await Tutorial.destroy({
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "Tutorial was deleted successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot delete tutorial with id ${id}.`,
    });
  }
  router.delete("/all", validateToken, async (req, res) => {
    let userId = req.user.id;
    try {
      let num = await Tutorial.destroy({
        where: { userId: userId },
      });
      if (num > 0) {
        res.json({ message: `${num} tutorials were deleted successfully.` });
      } else {
        res.status(404).json({ message: "No tutorials found for the user." });
      }
    } catch (err) {
      res.status(500).json({
        message: "Error occurred while deleting the user's tutorials.",
        error: err.message,
      });
    }
  });
});

module.exports = router;
