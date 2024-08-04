const express = require('express');
const { Request } = require('../models');
const yup = require('yup');

const router = express.Router();

// Fetch all requests (for debugging or admin purposes)
router.get('/', async (req, res) => {
  try {
    const result = await Request.findAll();
    res.json(result);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ errors: err.message });
  }
});

// Fetch requests for a specific buyer
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const buyerId = req.params.buyerId;
    const requests = await Request.findAll({ where: { tutorialbuyer: buyerId } });
    if (requests.length > 0) {
      res.status(200).json(requests);
    } else {
      res.status(404).send('No requests found for this buyer');
    }
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests');
  }
});

// Fetch requests for a specific seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const requests = await Request.findAll({ where: { sellerId } });
    if (requests.length > 0) {
      res.status(200).json(requests);
    } else {
      res.status(404).send('No requests found for this seller');
    }
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests');
  }
});

// Create a new request
router.post('/', async (req, res) => {
  const data = req.body;

  const validationSchema = yup.object({
    tutorialbuyer: yup.string().trim().min(3).max(255).required(),
    tutorialtitle: yup.string().trim().min(3).max(255).required(),
    message: yup.string().trim().min(3).required(),
    sellerId: yup.number().integer().required()
  });

  try {
    const validatedData = await validationSchema.validate(data, { abortEarly: false });
    const result = await Request.create(validatedData);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(400).json({ errors: err.errors });
  }
});

// Delete a request by ID
router.delete('/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const result = await Request.destroy({ where: { id: requestId } });

    if (result) {
      res.status(200).send('Request deleted successfully');
    } else {
      res.status(404).send('Request not found');
    }
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).send('Error deleting request');
  }
});

module.exports = router;
