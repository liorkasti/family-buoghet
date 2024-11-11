const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');  // ייבוא הקונטרולר

// נתיב להוספת הוצאה חדשה
router.post('/', expenseController.addExpense);

module.exports = router;
