// models/Budget.js
const mongoose = require('mongoose');

const CategoryBudgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['food', 'transportation', 'bills', 'entertainment', 'shopping', 'other']
    },
    limit: {
        type: Number,
        required: true,
        min: [0, 'הגבלת תקציב חייבת להיות חיובית']
    },
    used: {
        type: Number,
        default: 0
    },
    alerts: {
        enabled: { type: Boolean, default: true },
        threshold: { type: Number, default: 80 } // אחוז שבו תופיע התראה
    }
});

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'סכום התקציב חייב להיות חיובי']
    },
    startDate: {
        type: Date,
        required: true,
        default: function () {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), 1); // תחילת החודש הנוכחי
        }
    },
    endDate: {
        type: Date,
        required: true,
        default: function () {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 0); // סוף החודש הנוכחי
        }
    },
    categories: [CategoryBudgetSchema],
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    type: {
        type: String,
        enum: ['monthly', 'weekly', 'custom'],
        default: 'monthly'
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
    timestamps: true
});

// אינדקסים
BudgetSchema.index({ userId: 1, startDate: -1 });
BudgetSchema.index({ status: 1, userId: 1 });

// וירטואלים
BudgetSchema.virtual('remainingAmount').get(function () {
    const used = this.categories.reduce((total, cat) => total + (cat.used || 0), 0);
    return this.totalAmount - used;
});

BudgetSchema.virtual('usagePercentage').get(function () {
    const used = this.categories.reduce((total, cat) => total + (cat.used || 0), 0);
    return (used / this.totalAmount) * 100;
});

// מתודות סטטיות
BudgetSchema.statics.getCurrentBudget = async function (userId) {
    const now = new Date();
    return this.findOne({
        userId: userId,
        status: 'active',
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).exec();
};

// מתודות של המסמך
BudgetSchema.methods.updateCategoryUsage = async function (categoryName, amount) {
    const category = this.categories.find(cat => cat.name === categoryName);
    if (category) {
        category.used = (category.used || 0) + amount;
        if (category.alerts.enabled &&
            (category.used / category.limit * 100) >= category.alerts.threshold) {
            // כאן אפשר להוסיף לוגיקה של שליחת התראה
            console.log(`Alert: Category ${categoryName} has reached ${category.alerts.threshold}% of its limit`);
        }
    }
    return this.save();
};

BudgetSchema.methods.resetMonthlyUsage = function () {
    this.categories.forEach(cat => {
        cat.used = 0;
    });
    return this.save();
};

// Middleware לפני שמירה
BudgetSchema.pre('save', function (next) {
    // וידוא שסכום הקטגוריות לא עולה על התקציב הכולל
    const totalCategoryLimits = this.categories.reduce((sum, cat) => sum + cat.limit, 0);
    if (totalCategoryLimits > this.totalAmount) {
        next(new Error('סך המגבלות בקטגוריות עולה על התקציב הכולל'));
    }
    next();
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;