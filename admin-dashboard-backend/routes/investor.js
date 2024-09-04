const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all investors
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Investor');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single investor by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Investor WHERE InvestorID = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new investor
router.post('/', async (req, res) => {
    const { name, dateOfBirth, email, password, account, image } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Investor (Name, DateOfBirth, Email, Password, Account, Image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, dateOfBirth, email, password, account, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an investor
router.put('/:id', async (req, res) => {
    const { name, dateOfBirth, email, password, account, image } = req.body;
    try {
        const result = await db.query(
            'UPDATE Investor SET Name = $1, DateOfBirth = $2, Email = $3, Password = $4, Account = $5, Image = $6 WHERE InvestorID = $7 RETURNING *',
            [name, dateOfBirth, email, password, account, image, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an investor
router.delete('/:id', async (req, res) => {
    try {
        // Check for associated investments
        const investments = await db.query('SELECT * FROM investment WHERE investorid = $1', [req.params.id]);

        if (investments.rows.length > 0) {
            return res.status(400).json({ error: 'Cannot delete investor with active investments.' });
        }

        // Proceed with deletion if no associated investments
        await db.query('DELETE FROM Investor WHERE investorid = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error occurred while deleting investor:', err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
