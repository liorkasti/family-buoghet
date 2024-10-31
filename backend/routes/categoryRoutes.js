const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');  // ייבוא הקונטרולר של קטגוריות

// נתיב להוספת קטגוריה חדשה
router.post('/add', categoryController.addCategory);

module.exports = router;
