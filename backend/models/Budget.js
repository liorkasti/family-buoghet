
// models/Budget.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['food', 'transportation', 'bills', 'entertainment', 'shopping', 'other']
    },
    limit: {
        type: Number,
        required: true,
        min: 0
    },
    used: {
        type: Number,
        default: 0,
        min: 0
    }
});

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'התקציב חייב להיות חיובי']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    categories: [categorySchema],
    remainingAmount: {
        type: Number,
        default: function() {
            return this.amount;
        }
    }
}, {
    timestamps: true
});

// וירטואלים
budgetSchema.virtual('isActive').get(function() {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
});

budgetSchema.virtual('usagePercentage').get(function() {
    return ((this.amount - this.remainingAmount) / this.amount) * 100;
});

// מתודות סטטיות
budgetSchema.statics.getCurrentBudget = async function(userId) {
    const now = new Date();
    return this.findOne({
        userId,
        startDate: { $lte: now },
        endDate: { $gte: now }
    });
};

budgetSchema.statics.createMonthlyBudget = async function(userId, amount, categories) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setMilliseconds(-1);

    return this.create({
        userId,
        amount,
        startDate,
        endDate,
        categories,
        remainingAmount: amount
    });
};

// מתודות של המסמך
budgetSchema.methods.updateCategoryUsage = async function(categoryName, amount) {
    const category = this.categories.find(cat => cat.name === categoryName);
    if (category) {
        category.used += amount;
        this.remainingAmount -= amount;
        
        // וידוא שהערכים לא שליליים
        if (category.used < 0) category.used = 0;
        if (this.remainingAmount < 0) this.remainingAmount = 0;

        return this.save();
    }
    throw new Error(`Category ${categoryName} not found`);
};

budgetSchema.methods.resetCategoryUsage = async function(categoryName) {
    const category = this.categories.find(cat => cat.name === categoryName);
    if (category) {
        const oldUsed = category.used;
        category.used = 0;
        this.remainingAmount += oldUsed;
        return this.save();
    }
    throw new Error(`Category ${categoryName} not found`);
};

// הוק לפני שמירה
budgetSchema.pre('save', function(next) {
    // וידוא שתאריך הסיום אחרי תאריך ההתחלה
    if (this.endDate <= this.startDate) {
        next(new Error('תאריך הסיום חייב להיות אחרי תאריך ההתחלה'));
    }
    
    // וידוא שסכום הקטגוריות לא עולה על התקציב הכולל
    const totalCategoryLimits = this.categories.reduce((sum, cat) => sum + cat.limit, 0);
    if (totalCategoryLimits > this.amount) {
        next(new Error('סך המגבלות בקטגוריות עולה על התקציב הכולל'));
    }

    next();
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;