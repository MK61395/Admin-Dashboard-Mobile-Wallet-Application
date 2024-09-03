const express = require('express');
const db = require('../db');
const router = express.Router();

// Get the count of admins
router.get('/admin', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM Admin');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get the count of investors
router.get('/investor', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM Investor');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get the count of projects
router.get('/project', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM Project');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get the count of investments
router.get('/investment', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM Investment');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get the number of investors per project
router.get('/investors-per-project', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT Project.Title, COUNT(Investment.InvestmentID) AS InvestorCount
            FROM Project
            LEFT JOIN Investment ON Project.ProjectID = Investment.ProjectID
            GROUP BY Project.Title
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;