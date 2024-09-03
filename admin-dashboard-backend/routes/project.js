const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Project');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Project WHERE ProjectID = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Project not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new project
router.post('/', async (req, res) => {
    const { adminID, title, description, targetAmount, startDate, endDate } = req.body;
    if (!adminID || !title || !targetAmount || !startDate || !endDate) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const result = await db.query(
            'INSERT INTO Project (AdminID, Title, Description, TargetAmount, StartDate, EndDate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [adminID, title, description, targetAmount, startDate, endDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a project
router.put('/:id', async (req, res) => {
    const { adminID, title, description, targetAmount, startDate, endDate } = req.body;
    if (!adminID || !title || !targetAmount || !startDate || !endDate) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const result = await db.query(
            'UPDATE Project SET AdminID = $1, Title = $2, Description = $3, TargetAmount = $4, StartDate = $5, EndDate = $6 WHERE ProjectID = $7 RETURNING *',
            [adminID, title, description, targetAmount, startDate, endDate, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Project not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Project WHERE ProjectID = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Project not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
