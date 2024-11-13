// models/Budget.js
const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['food', 'transportation', 'bills', 'entertainment', 'shopping', 'other']
    },
    limit: {
        type: Number,
        default: 0,
        min: [0, 'הגבלת תקציב חייבת להיות חיובית']
    },
    used: {
        type: Number,
        default: 0,
        min: [0, 'השימוש בתקציב חייב להיות חיובי']
    }
});

const budgetSchema = new mongoose.Schema({
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
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    categories: [budgetCategorySchema]
}, {
    timestamps: true
});

// וירטואלים
budgetSchema.virtual('remainingAmount').get(function() {
    const totalUsed = this.categories.reduce((sum, cat) => sum + (cat.used || 0), 0);
    return this.totalAmount - totalUsed;
});

// סטטיות
budgetSchema.statics.getCurrentBudget = function(userId) {
    const now = new Date();
    return this.findOne({
        userId,
        startDate: { $lte: now },
        endDate: { $gte: now }
    });
};

// מתודות
budgetSchema.methods.updateCategoryUsage = function(categoryName, amount) {
    const category = this.categories.find(c => c.name === categoryName);
    if (category) {
        category.used = (category.used || 0) + amount;
    }
    return this.save();
};

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;