const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Request = require('../models/Request');
const User = require('../models/User');
const Dashboard = require('../models/Dashboard');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        console.log("xxx", {user});
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const budget = await Budget.findOne({ userId });
        const expenses = await Expense.find({
            userId,
            date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        });

        const monthlyStats = await calculateMonthlyStats(userId, firstDayOfMonth, lastDayOfMonth);
        const alerts = await checkAlerts(budget, expenses);

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

        const dashboardData = {
            userId,
            totalBudget: budget?.amount || 0,
            recentExpenses: await getRecentExpenses(userId),
            upcomingExpenses: await getUpcomingExpenses(userId),
            alerts,
            monthlyStats
        };

        await Dashboard.findOneAndUpdate({ userId }, dashboardData, { upsert: true, new: true });

        res.json(dashboardData);

    } catch (error) {
        console.error('שגיאה בקבלת נתוני דשבורד:', error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// Create a new dashboard entry
exports.createDashboard = async (req, res) => {
    try {
        const newDashboard = new Dashboard(req.body);
        const savedDashboard = await newDashboard.save();
        res.status(201).json(savedDashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all dashboard entries
exports.getDashboards = async (req, res) => {
    try {
        const dashboards = await Dashboard.find();
        res.status(200).json(dashboards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Additional methods can be added here (e.g., update, delete)

exports.getDashboardData = async (req, res) => {
    const userId = req.params.userId;
    console.log("xxx", req.params);
    try {
        const dashboardData = await Dashboard.findOne({ userId: userId });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
