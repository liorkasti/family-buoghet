// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); // ייבוא קונטרולר של הדשבורד

// נתיב לקבלת כל המידע עבור ה-Dashboard
router.get('/', dashboardController.getDashboardData);

module.exports = router;
