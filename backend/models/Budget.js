const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    amount: { type: Number, required: true },  // הסכום הכולל של התקציב
    categories: [{
        name: String,       // שם הקטגוריה
        limit: Number       // המגבלה הכספית לכל קטגוריה
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'], // סטטוס של התקציב: פעיל או לא פעיל
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }  // תאריך יצירת התקציב
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
