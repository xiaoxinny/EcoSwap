const { FAQs } = require("../models");
const { Op } = require("sequelize");
const yup = require("yup"); 
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => { 
    let data = req.body; // Validate request body 
    let validationSchema = yup.object({ 
        question: yup.string().trim().min(3).max(500).required(), 
        answer: yup.string().trim().min(3).max(500).required() 
    }); 

    try { 
        data = await validationSchema.validate(
            data, 
            { abortEarly: false }
        ); 
        
        let result = await FAQs.create(data); 
        res.json(result); } 

    catch (err) { 
        res.status(400).json({ errors: err.errors }); } 
    }
);

router.get("/", async (req, res) => {
    try {
        console.log("Attempting to fetch all FAQs...");
        let result = await FAQs.findAll();
        console.log("FAQs fetched successfully:", result);
        res.json(result);
    } catch (err) {
        console.error("Error fetching FAQs:", err);
        res.status(400).json({ errors: err.errors });
    }
});

router.put("/:id", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        question: yup.string().trim().min(3).max(500).required(),
        answer: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(
            data,
            { abortEarly: false }
        );

        let result = await FAQs.update(data, {
            where: { id: req.params.id }
        });
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let result = await FAQs.destroy({
            where: { id: req.params.id }
        });
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
}
);

module.exports = router;