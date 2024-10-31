const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// הגדרת הנתיב לרישום משתמש חדש
router.post('/register', userController.registerUser); // וודא ששורה זו קיימת

module.exports = router;
