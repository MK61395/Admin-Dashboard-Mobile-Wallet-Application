const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg'); // or your DB client


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from frontend port
}));
app.use(express.json());

// Routes
const adminRoutes = require('./routes/admin');
const investorRoutes = require('./routes/investor');
const projectRoutes = require('./routes/project');
const investmentRoutes = require('./routes/investment');
const analyticsRoutes = require('./routes/analytics'); // Adjust the path as necessary

// Use routes
app.use('/admin', adminRoutes);
app.use('/investor', investorRoutes);
app.use('/project', projectRoutes);
app.use('/investment', investmentRoutes);
app.use('/analytics', analyticsRoutes);

app.use('/images', express.static('images'));

// Add route for file uploads
app.post('/upload', upload.single('media'), (req, res) => {
    try {
        res.status(200).json({
            filename: req.file.filename
        });
    } catch (err) {
        res.status(500).send('Error uploading file');
    }
});

// Serving uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
