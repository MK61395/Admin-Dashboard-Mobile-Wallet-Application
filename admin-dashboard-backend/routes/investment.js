const express = require('express');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save file with its original name
    },
});

const upload = multer({ storage });

// Get all investments
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Investment');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Create a new investment with media upload
router.post('/', upload.single('media'), async (req, res) => {
  const { investorID, projectID, amount, investedDate, profitOrLoss } = req.body;
  const mediaFileName = req.file ? req.file.originalname : null;

  if (!amount || isNaN(amount)) {
    return res.status(400).send('Invalid amount');
  }

  try {
    const result = await db.query(
      'INSERT INTO Investment (InvestorID, ProjectID, Amount, InvestedDate, ProfitOrLoss, Media) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [investorID, projectID, amount, investedDate, profitOrLoss || null, mediaFileName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Update an investment
router.put('/:id', upload.single('media'), async (req, res) => {
    const { investorID, projectID, amount, investedDate, profitOrLoss } = req.body;
    const mediaFileName = req.file ? req.file.originalname : null; // Get the media file name

    if (!amount || isNaN(amount)) {
        return res.status(400).send('Invalid amount');
    }

    try {
        const result = await db.query(
            'UPDATE Investment SET InvestorID = $1, ProjectID = $2, Amount = $3, InvestedDate = $4, ProfitOrLoss = $5, Media = $6 WHERE InvestmentID = $7 RETURNING *',
            [investorID, projectID, amount, investedDate, profitOrLoss || null, mediaFileName, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Upload media
router.post('/:id/media', upload.single('media'), (req, res) => {
    res.sendStatus(200);
});

module.exports = router;