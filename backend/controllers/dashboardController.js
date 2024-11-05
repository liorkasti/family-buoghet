const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');

// פונקציה לקבלת נתוני הדשבורד
exports.getDashboardData = async (req, res) => {
    try {
        const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5); // קבלת 5 ההוצאות האחרונות
        const alerts = await exports.checkAlerts();  // קריאה לפונקציה שמחזירה התראות

        res.json({ recentExpenses, alerts });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// פונקציה לקבלת יתרת התקציב
exports.getBudgetBalance = async (req, res) => {
    try {
        const budget = await Budget.findOne({});
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const balance = budget.amount - (totalExpenses[0] ? totalExpenses[0].total : 0); // חישוב יתרת התקציב
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// פונקציה לבדיקת חריגות והצגת התראות
exports.checkAlerts = async () => {
    try {
        const budget = await Budget.findOne({});
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const total = totalExpenses[0] ? totalExpenses[0].total : 0;
        const alerts = [];

        // בדיקה אם ההוצאות חורגות מהתקציב
        if (total > budget.amount) {
            alerts.push({ message: 'הוצאות חורגות מהתקציב!', type: 'error', date: new Date() });
        }

        // בדיקה אם התקציב קרוב למיצוי (90%)
        if (total >= budget.amount * 0.9) {
            alerts.push({ message: 'התקציב קרוב למיצוי!', type: 'warning', date: new Date() });
        }

        return alerts;
    } catch (error) {
        console.error('שגיאה בבדיקת התראות:', error);
        return [];
    }
};

// פונקציה לקבלת הוצאות קבועות קרובות
exports.getUpcomingRecurringExpenses = async (req, res) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    try {
        const upcomingExpenses = await Expense.find({
            isRecurring: true,  // מסנן רק הוצאות קבועות
            date: { $gte: today, $lt: nextMonth }  // הגבלת תאריכים לחודש הקרוב
        });

        res.status(200).json(upcomingExpenses);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
    }
};

// פונקציה לדוגמה לקבלת נתונים לגרף
exports.getGraphData = async (req, res) => {
    try {
        // כאן אפשר להוסיף קוד להחזרת נתונים לגרף
        res.status(200).json({ message: "Graph data example" });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
    }
};

// פונקציה לקבלת הוצאות האחרונות
exports.getRecentExpenses = async (req, res) => {
    try {
        // קבלת 5 ההוצאות האחרונות, ממוין לפי תאריך מהחדש לישן
        const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);

        // אם לא נמצאו הוצאות
        if (!recentExpenses.length) {
            return res.status(404).json({ message: 'לא נמצאו הוצאות האחרונות' });
        }

        // החזרת ההוצאות האחרונות כתגובה
        res.status(200).json(recentExpenses);
    } catch (error) {
        console.error('שגיאה בקבלת הוצאות האחרונות:', error);
        res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
    }
};
