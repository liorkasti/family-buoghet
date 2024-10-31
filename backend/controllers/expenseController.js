const Expense = require('../models/Expense');  // ייבוא מודל ההוצאות

// פונקציה להוספת הוצאה חדשה
exports.addExpense = async (req, res) => {
    try {
        const { user_id, date, category, amount, description } = req.body;

        // יצירת מסמך הוצאה חדש
        const newExpense = new Expense({
            user_id,
            date,
            category,
            amount,
            description
        });

        // שמירה למסד הנתונים
        await newExpense.save();

        res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Failed to add expense", error: error.message });
    }
};
