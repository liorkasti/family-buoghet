const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // ודא שהבקר נכון

// הגדרת המסלול
router.post('/signup', userController.signup); // ודא שהפונקציה signup קיימת במנהל הבקר

module.exports = router;
