const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    totalBudget: { type: Number, required: true },
    recentExpenses: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        date: { type: Date, required: true }
    }],
    upcomingExpenses: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true }
    }],
    alerts: [{
        message: { type: String, required: true },
        type: { type: String, enum: ['warning', 'error', 'info'], required: true }
    }],
    monthlyStats: {
        totalExpenses: { type: Number, required: true },
        totalIncome: { type: Number, required: true },
        expensesByCategory: [{
            category: { type: String, required: true },
            amount: { type: Number, required: true }
        }],
        dailyExpenses: [{
            date: { type: Date, required: true },
            amount: { type: Number, required: true }
        }]
    }
});

module.exports = mongoose.model('Dashboard', dashboardSchema); 