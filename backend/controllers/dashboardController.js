// controllers/dashboardController.js
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');

// פונקציית עזר לחישוב סיכומים לפי קטגוריות
const calculateCategorySummary = async (userId, startDate, endDate) => {
    return await Expense.aggregate([
        {
            $match: {
                userId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
};

exports.getDashboardData = async (req, res) => {
    try {
        const { userId } = req.user;
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // קבלת התקציב הנוכחי
        const currentBudget = await Budget.findOne({
            userId,
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        // קבלת הוצאות אחרונות
        const recentExpenses = await Expense.find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .populate('category', 'name');

        // חישוב סיכומי הוצאות לחודש הנוכחי
        const monthlyExpenses = await calculateCategorySummary(userId, startOfMonth, endOfMonth);
        
        // חישוב יתרת תקציב
        const totalExpenses = monthlyExpenses.reduce((sum, cat) => sum + cat.total, 0);
        const remainingBudget = currentBudget ? currentBudget.totalAmount - totalExpenses : 0;

        // הוצאות קבועות קרובות
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        const upcomingExpenses = await Expense.find({
            userId,
            isRecurring: true,
            'recurringDetails.nextDate': { 
                $gte: today, 
                $lt: nextMonth 
            }
        })
        .sort({ 'recurringDetails.nextDate': 1 })
        .limit(5);

        // קבלת התראות
        const alerts = await checkAndGenerateAlerts(userId, currentBudget, totalExpenses, monthlyExpenses);

        // חישוב נתונים סטטיסטיים
        const stats = {
            totalSpentThisMonth: totalExpenses,
            percentageOfBudgetUsed: currentBudget ? 
                (totalExpenses / currentBudget.totalAmount) * 100 : 0,
            topExpenseCategories: monthlyExpenses
                .sort((a, b) => b.total - a.total)
                .slice(0, 3),
            comparisonWithLastMonth: await getMonthlyComparison(userId)
        };

        res.json({
            currentBudget: {
                total: currentBudget?.totalAmount || 0,
                remaining: remainingBudget,
                categories: currentBudget?.categories || []
            },
            recentExpenses,
            upcomingExpenses,
            monthlyExpenses,
            alerts,
            stats
        });

    } catch (error) {
        console.error('שגיאה בקבלת נתוני דשבורד:', error);
        res.status(500).json({ 
            message: 'שגיאה בקבלת נתוני הדשבורד',
            error: error.message 
        });
    }
};

const checkAndGenerateAlerts = async (userId, budget, totalExpenses, categoryExpenses) => {
    const alerts = [];
    const today = new Date();

    try {
        // בדיקת חריגה מהתקציב הכללי
        if (budget && totalExpenses > budget.totalAmount) {
            await Alert.create({
                userId,
                type: 'budget_limit',
                severity: 'critical',
                message: `חריגה של ${totalExpenses - budget.totalAmount} ש"ח מהתקציב החודשי`
            });
        }

        // בדיקת חריגה בקטגוריות
        if (budget?.categories) {
            for (const catBudget of budget.categories) {
                const catExpense = categoryExpenses.find(ce => ce._id === catBudget.name);
                if (catExpense && catExpense.total > catBudget.limit) {
                    await Alert.create({
                        userId,
                        type: 'category_limit',
                        severity: 'warning',
                        message: `חריגה בקטגוריה ${catBudget.name}`,
                        relatedData: {
                            categoryId: catBudget.name,
                            amount: catExpense.total - catBudget.limit
                        }
                    });
                }
            }
        }

        // בדיקת הוצאות קבועות קרובות
        const upcomingRecurring = await Expense.find({
            userId,
            isRecurring: true,
            'recurringDetails.nextDate': { 
                $gte: today, 
                $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) 
            }
        });

        for (const expense of upcomingRecurring) {
            await Alert.create({
                userId,
                type: 'fixed_expense_due',
                severity: 'info',
                message: `תשלום קבוע קרב: ${expense.description}`,
                relatedData: {
                    expenseId: expense._id,
                    dueDate: expense.recurringDetails.nextDate,
                    amount: expense.amount
                }
            });
        }

        // קבלת כל ההתראות הפעילות
        return await Alert.find({
            userId,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            isRead: false
        }).sort({ severity: 1, createdAt: -1 });

    } catch (error) {
        console.error('שגיאה בבדיקת התראות:', error);
        return [];
    }
};

const getMonthlyComparison = async (userId) => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    const [thisMonthData, lastMonthData] = await Promise.all([
        calculateCategorySummary(userId, thisMonth, today),
        calculateCategorySummary(userId, lastMonth, thisMonth)
    ]);

    const thisMonthTotal = thisMonthData.reduce((sum, cat) => sum + cat.total, 0);
    const lastMonthTotal = lastMonthData.reduce((sum, cat) => sum + cat.total, 0);

    return {
        difference: thisMonthTotal - lastMonthTotal,
        percentageChange: lastMonthTotal ? 
            ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0,
        categoriesComparison: thisMonthData.map(cat => {
            const lastMonthCat = lastMonthData.find(lc => lc._id === cat._id);
            return {
                category: cat._id,
                thisMonth: cat.total,
                lastMonth: lastMonthCat?.total || 0,
                change: lastMonthCat ? 
                    ((cat.total - lastMonthCat.total) / lastMonthCat.total) * 100 : 100
            };
        })
    };
};

module.exports = {
    getDashboardData,
    checkAndGenerateAlerts
};