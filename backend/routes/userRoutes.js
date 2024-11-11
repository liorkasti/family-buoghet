const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // ייבוא קובץ הבקר

// נתיב ההתחברות
router.post('/login', userController.login); // וודא שפונקציית login קיימת בבקר

// נתיב ההרשמה
router.post('/signup', userController.signup); // וודא שפונקציית signup קיימת בבקר

module.exports = router;
