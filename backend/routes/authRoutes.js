// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// נתיבי הרשמה והתחברות
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authenticate, authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;