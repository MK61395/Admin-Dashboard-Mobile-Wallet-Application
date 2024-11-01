const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg'); // or your DB client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware: Set up CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://bigbuffalowings.com'],
  credentials: true
}));



// Middleware: Enable JSON parsing
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage });

// Routes
const adminRoutes = require('./routes/admin');
const investorRoutes = require('./routes/investor');
const projectRoutes = require('./routes/project');
const investmentRoutes = require('./routes/investment');
const analyticsRoutes = require('./routes/analytics'); // Adjust the path as necessary
const authRoutes = require('./routes/auth');  // New auth routes

// Use routes
app.use('/admin', adminRoutes);
app.use('/investor', investorRoutes);
app.use('/project', projectRoutes);
app.use('/investment', investmentRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/auth', authRoutes);  // New auth routes

// Serving static files
app.use('/images', express.static('images'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload route
app.post('/upload', upload.single('media'), (req, res) => {
    try {
        res.status(200).json({
            filename: req.file.filename
        });
    } catch (err) {
        res.status(500).send('Error uploading file');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
