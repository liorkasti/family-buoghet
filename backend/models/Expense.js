// models/Expense.js

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    isRecurring: { type: Boolean, default: false }, // שדה חדש עבור הוצאות קבועות
    userId:{type:mongoose.Schema.ObjectId, ref:'users'}//TODO: Update the refference to the user token correctly 

});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
