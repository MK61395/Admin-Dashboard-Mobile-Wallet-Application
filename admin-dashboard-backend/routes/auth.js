const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  console.log('Login attempt:', { name, password: '****' });

  try {
    const result = await pool.query('SELECT * FROM admin WHERE name = $1', [name]);
    console.log('Database query result:', result.rows);
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('Found admin:', { id: admin.id, name: admin.name });

      // If passwords are stored as plain text (not recommended)
      if (password === admin.password) {
        const token = jwt.sign({ id: admin.id, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated');
        return res.json({ success: true, token });
      } else {
        console.log('Password mismatch');
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      
      // If passwords are hashed (recommended), use this instead:
      // const isMatch = await bcrypt.compare(password, admin.password);
      // if (isMatch) {
      //   const token = jwt.sign({ id: admin.id, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      //   console.log('Login successful, token generated');
      //   return res.json({ success: true, token });
      // } else {
      //   console.log('Password mismatch');
      //   return res.status(400).json({ success: false, message: 'Invalid credentials' });
      // }
    } else {
      console.log('No admin found with the provided name');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;