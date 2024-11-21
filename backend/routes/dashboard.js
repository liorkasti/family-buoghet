const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route to create a new dashboard entry
router.post('/', dashboardController.createDashboard);
router.post('/dashboard', dashboardController.createDashboard);

// Route to get all dashboard entries
router.get('/', dashboardController.getDashboards);
router.get('/dashboard', dashboardController.getDashboards);

// Additional routes can be added here (e.g., update, delete)

module.exports = router;