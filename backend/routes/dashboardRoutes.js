const express = require('express');
const router = express.Router();

// פונקציה שמטפלת בבקשות לדשבורד
const getDashboardData = (req, res) => {
    // כאן יש להוסיף את הקוד שמפיק את נתוני הדשבורד מהמסד הנתונים
    const dashboardData = {
        // דוגמה לנתוני דשבורד
        totalExpenses: 5000,
        totalIncome: 7000,
        balance: 2000
    };
    res.json(dashboardData);
};

router.get('/', getDashboardData);

module.exports = router;