const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.use(cors());
app.use(express.json());

// חיבור הנתיבים
app.use('/api/auth', authRoutes);
console.log('Routes registered successfully');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: err.message });
});

module.exports = app;
