// models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: { 
        type: Number, 
        required: true,
        min: [0, 'סכום ההוצאה חייב להיות חיובי']
    },
    category: { 
        type: String, 
        required: true,
        enum: ['food', 'transportation', 'bills', 'entertainment', 'shopping', 'other'],
        default: 'other'
    },
    date: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    description: { 
        type: String,
        trim: true,
        maxlength: [200, 'התיאור ארוך מדי - מקסימום 200 תווים']
    },
    isRecurring: { 
        type: Boolean, 
        default: false 
    },
    // שדות חדשים לתמיכה בהוצאות קבועות
    recurringDetails: {
        frequency: {
            type: String,
            enum: ['monthly', 'weekly', 'yearly'],
            required: function() { return this.isRecurring; }
        },
        dayOfMonth: {
            type: Number,
            min: 1,
            max: 31,
            required: function() { 
                return this.isRecurring && this.recurringDetails?.frequency === 'monthly';
            }
        },
        endDate: {
            type: Date
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'  // הוצאות רגילות מאושרות אוטומטית, רק בקשות צריכות אישור
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // מוסיף אוטומטית createdAt ו-updatedAt
});

// אינדקסים לשיפור ביצועים בשאילתות נפוצות
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ category: 1, date: -1 });

// וירטואלים - שדות מחושבים
ExpenseSchema.virtual('monthlyTotal').get(function() {
    if (this.isRecurring && this.recurringDetails?.frequency === 'monthly') {
        return this.amount;
    }
    return 0;
});

// מתודות סטטיות
ExpenseSchema.statics.getTotalByCategory = async function(userId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' }
            }
        }
    ]);
};

// מתודות של המסמך
ExpenseSchema.methods.isOverBudget = async function(monthlyBudget) {
    const currentMonth = new Date(this.date).getMonth();
    const currentYear = new Date(this.date).getFullYear();
    
    const monthlyTotal = await this.constructor.aggregate([
        {
            $match: {
                userId: this.userId,
                $expr: {
                    $and: [
                        { $eq: [{ $month: '$date' }, currentMonth + 1] },
                        { $eq: [{ $year: '$date' }, currentYear] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    return monthlyTotal[0]?.total > monthlyBudget;
};

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;