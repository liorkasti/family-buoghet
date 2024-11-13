const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// פונקציה לקבלת נתוני הדשבורד, כולל הוצאות אחרונות, יתרת התקציב, הוצאות קבועות קרובות והתראות
exports.getDashboardData = async (req, res) => {
    try {
        // קבלת 5 ההוצאות האחרונות
        const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);

        // חישוב יתרת התקציב
        const budget = await Budget.findOne({});
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalBudget = budget ? (budget.amount - (totalExpenses[0] ? totalExpenses[0].total : 0)) : 0;

        // הוצאות קבועות קרובות (לחודש הקרוב)
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        const upcomingExpenses = await Expense.find({
            isRecurring: true,
            date: { $gte: today, $lt: nextMonth }
        }).sort({ date: 1 }).limit(3);

        // בדיקת חריגות והצגת התראות
        const alerts = await checkAlerts(budget, totalExpenses);

        // החזרת כל נתוני הדשבורד
        res.json({
            recentExpenses,
            totalBudget,
            upcomingExpenses,
            alerts
        });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// פונקציה לבדיקת חריגות והצגת התראות
const checkAlerts = async (budget, totalExpenses) => {
    try {
        const total = totalExpenses[0] ? totalExpenses[0].total : 0;
        const alerts = [];

        // בדיקה אם ההוצאות חורגות מהתקציב
        if (budget && total > budget.amount) {
            alerts.push({ message: 'הוצאות חורגות מהתקציב!', type: 'error', date: new Date() });
        }

        // בדיקה אם התקציב קרוב למיצוי (90%)
        if (budget && total >= budget.amount * 0.9) {
            alerts.push({ message: 'התקציב קרוב למיצוי!', type: 'warning', date: new Date() });
        }

        return alerts;
    } catch (error) {
        console.error('שגיאה בבדיקת התראות:', error);
        return [];
    }
};

// ייצוא הפונקציה checkAlerts כדי לאפשר ייבוא חיצוני במידת הצורך
exports.checkAlerts = checkAlerts;
