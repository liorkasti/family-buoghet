// backend/routes/expenses.js

// מייבא את הביטוי המובנה 'express' כדי ליצור את הראוטר
const express = require('express');

// יוצר ראוטר חדש באמצעות express.Router()
const router = express.Router();

// מייבא את קובץ הבקר (controller) שמטפל בפעולות הקשורות להוצאות
const expenseController = require('../controllers/expenseController');

// הגדרת נתיב להוספת הוצאה חדשה
// המשתמש יבצע פנייה ל-/ (השורש) באמצעות שיטת POST
// הפונקציה addExpense() מהבקר expenseController תטפל בבקשה זו
router.post('/', expenseController.addExpense);

// מייצא את הראוטר כדי שיהיה ניתן לשימוש במקומות אחרים בקוד
module.exports = router;