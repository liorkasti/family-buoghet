// backend/routes/auth.js

// מייבא את הביטוי המובנה 'express' כדי ליצור את הראוטר
const express = require('express');

// יוצר ראוטר חדש באמצעות express.Router()
const router = express.Router();

// מייבא את קובץ הבקר (controller) שמטפל בפעולות הקשורות לאימות והרשאות
const authController = require('../controllers/authController');

// הגדרת נתיב ההתחברות, המשתמש יבצע פנייה ל-/login באמצעות שיטת POST
// הפונקציה login() מהבקר authController תטפל בבקשה זו
router.post('/login', authController.login);

// מייצא את הראוטר כדי שיהיה ניתן לשימוש במקומות אחרים בקוד
module.exports = router;