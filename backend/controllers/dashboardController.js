const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Request = require('../models/Request');
const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // קבלת נתוני תקציב ומעקב אחר הוצאות
        const budget = await Budget.findOne({ userId });
        const expenses = await Expense.find({
            userId,
            date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        });

        // חישוב סטטיסטיקות חודשיות
        const monthlyStats = await calculateMonthlyStats(userId, firstDayOfMonth, lastDayOfMonth);

        // בדיקת התראות
        const alerts = await checkAlerts(budget, expenses);

        // בדיקת בקשות ממתינות (עבור הורים)
        if (user.role === 'parent') {
            const pendingRequests = await Request.find({ 
                parentId: userId,
                status: 'pending'
            });
            
            if (pendingRequests.length > 0) {
                alerts.push({
                    message: `יש ${pendingRequests.length} בקשות ממתינות לאישור`,
                    type: 'info'
                });
            }
        }

        res.json({
            totalBudget: budget?.amount || 0,
            recentExpenses: await getRecentExpenses(userId),
            upcomingExpenses: await getUpcomingExpenses(userId),
            alerts,
            monthlyStats
        });

    } catch (error) {
        console.error('שגיאה בקבלת נתוני דשבורד:', error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// המשך הפונקציות הקיימות...
