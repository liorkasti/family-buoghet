const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// הגדרת המסלול להרשמה
router.post('/signup', userController.signup);

module.exports = router;