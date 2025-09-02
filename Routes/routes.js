
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db.js');


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'schoolImages/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });



router.post('/schools', upload.single('image'), async (req, res) => {
    const { name, address, city, state, email } = req.body;
    const contact = Number(req.body.contact); 
    const image = req.file ? req.file.filename : null;

    if (!name || !address || !city || !state || !contact || !email || !image) {
        return res.status(400).json({ error: "All fields are required and contact must be numeric" });
    }

    try {
        await pool.query(
            "INSERT INTO schools (name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, address, city, state, contact, image, email]
        );
        res.json({ message: "School added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET /api/schools -> Fetch all schools
router.get('/schools', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, name, address, city, image FROM schools");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

