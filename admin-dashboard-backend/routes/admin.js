const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all admins
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Admin');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new admin
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Admin (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an admin
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const result = await db.query(
            'UPDATE Admin SET name = $1, email = $2, password = $3 WHERE adminid = $4 RETURNING *',
            [name, email, password, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an admin
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Admin WHERE adminid = $1', [id]);
        res.status(204).send(); // No content
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
