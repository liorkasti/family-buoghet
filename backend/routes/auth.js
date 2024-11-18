const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');

router.post('/signup', [
    check('username', 'שם משתמש הוא שדה חובה').notEmpty(),
    check('email', 'נדרש אימייל תקין').isEmail(),
    check('password', 'נדרשת סיסמה באורך 6 תווים לפחות').isLength({ min: 6 }),
    check('role', 'נדרש תפקיד תקין').isIn(['parent', 'child'])
], userController.signup);

router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail);
router.post('/check-username', userController.checkUsername);
router.post('/forgot-password', userController.forgotPassword);

module.exports = router; 