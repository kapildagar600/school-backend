
const express = require('express');
const pool = require('../config/db.js');
// const  upload  = require('../utils/multer.js');
const cloudinary = require('../utils/cloudinary.js')
const multer = require('multer')

const router = express.Router();



const storage = multer.memoryStorage();
const upload = multer({ storage });





router.post('/schools', upload.single('image'), async (req, res) => {
    const { name, address, city, state, email } = req.body;
    const contact = Number(req.body.contact); 
    

    if (!name || !address || !city || !state || !contact || !email || !req.file) {
        return res.status(400).json({ error: "All fields are required and contact must be numeric" });
    }

    try {
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64, {
      folder: 'schoolImages',
    });
        await pool.query(
            "INSERT INTO schools (name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, address, city, state, contact, result.secure_url, email]
        );
        res.json({ message: "School added successfully",
            imageUrl: result.secure_url
         });
    } catch (err) {
        console.log(err)
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

