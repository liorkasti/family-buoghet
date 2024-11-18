const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard'); // Ensure the model is imported

const dashboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalBudget: { type: Number, default: 0 },
    recentExpenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    upcomingExpenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    alerts: [{ message: String, type: String }],
    monthlyStats: Object,
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);

// Add a POST route to create a new dashboard entry
router.post('/', async (req, res) => {
    try {
        const newDashboard = new Dashboard(req.body);
        const savedDashboard = await newDashboard.save();
        res.status(201).json(savedDashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});