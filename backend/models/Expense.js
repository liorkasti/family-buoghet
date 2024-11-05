// models/Expense.js

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    isRecurring: { type: Boolean, default: false }, // שדה חדש עבור הוצאות קבועות
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
