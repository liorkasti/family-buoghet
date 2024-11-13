// controllers/expenseController.js
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// הוספת הוצאה חדשה
exports.addExpense = async (req, res) => {
    try {
        const { 
            amount, 
            category, 
            date, 
            description, 
            isRecurring,
            recurringDetails,
            userId 
        } = req.body;

        // בדיקת תקציב לפני הוספת ההוצאה
        const currentBudget = await Budget.getCurrentBudget(userId);
        if (currentBudget) {
            const categoryBudget = currentBudget.categories.find(cat => cat.name === category);
            if (categoryBudget && (categoryBudget.used + amount) > categoryBudget.limit) {
                return res.status(400).json({ 
                    message: 'חריגה מהתקציב בקטגוריה זו',
                    currentUsage: categoryBudget.used,
                    limit: categoryBudget.limit,
                    newExpenseAmount: amount
                });
            }
        }

        // יצירת ההוצאה
        const newExpense = new Expense({
            amount,
            category,
            date: date || new Date(),
            description,
            isRecurring,
            recurringDetails,
            userId
        });

        await newExpense.save();

        // עדכון התקציב
        if (currentBudget) {
            await currentBudget.updateCategoryUsage(category, amount);
        }

        res.status(201).json({ 
            message: 'ההוצאה נשמרה בהצלחה', 
            expense: newExpense,
            budgetStatus: currentBudget ? {
                categoryUsed: currentBudget.categories.find(cat => cat.name === category)?.used,
                totalRemaining: currentBudget.remainingAmount
            } : null
        });

    } catch (error) {
        console.error('Error saving expense:', error);
        res.status(500).json({ message: 'שגיאה בשמירת ההוצאה', error: error.message });
    }
};

// קבלת כל ההוצאות של משתמש
exports.getExpenses = async (req, res) => {
    try {
        const { 
            userId,
            startDate,
            endDate,
            category,
            isRecurring,
            sortBy = 'date',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        const query = { userId };

        // הוספת פילטרים
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) {
            query.category = category;
        }
        if (isRecurring !== undefined) {
            query.isRecurring = isRecurring === 'true';
        }

        const expenses = await Expense.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Expense.countDocuments(query);

        res.json({
            expenses,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת ההוצאות', error: error.message });
    }
};

// עדכון הוצאה
exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'ההוצאה לא נמצאה' });
        }

        // אם יש שינוי בסכום, צריך לעדכן גם את התקציב
        if (updateData.amount && updateData.amount !== expense.amount) {
            const currentBudget = await Budget.getCurrentBudget(expense.userId);
            if (currentBudget) {
                // מחזירים את הסכום הישן
                await currentBudget.updateCategoryUsage(expense.category, -expense.amount);
                // מוסיפים את הסכום החדש
                await currentBudget.updateCategoryUsage(updateData.category || expense.category, updateData.amount);
            }
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        res.json({ 
            message: 'ההוצאה עודכנה בהצלחה', 
            expense: updatedExpense 
        });

    } catch (error) {
        res.status(500).json({ message: 'שגיאה בעדכון ההוצאה', error: error.message });
    }
};

// מחיקת הוצאה
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'ההוצאה לא נמצאה' });
        }

        // עדכון התקציב לפני המחיקה
        const currentBudget = await Budget.getCurrentBudget(expense.userId);
        if (currentBudget) {
            await currentBudget.updateCategoryUsage(expense.category, -expense.amount);
        }

        await Expense.findByIdAndDelete(id);
        res.json({ message: 'ההוצאה נמחקה בהצלחה' });

    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת ההוצאה', error: error.message });
    }
};

// קבלת סיכום הוצאות לפי קטגוריות
exports.getExpenseSummary = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        const summary = await Expense.aggregate([
            {
                $match: {
                    userId: userId,
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(summary);

    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת סיכום ההוצאות', error: error.message });
    }
};

module.exports = exports;