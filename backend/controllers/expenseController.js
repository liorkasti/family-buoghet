// const Expense = require('../models/Expense');  // ייבוא מודל ההוצאות

// // פונקציה להוספת הוצאה חדשה
// exports.addExpense = async (req, res) => {
//     try {
//         const { user_id, date, category, amount, description } = req.body;

//         // יצירת מסמך הוצאה חדש
//         const newExpense = new Expense({
//             user_id,
//             date,
//             category,
//             amount,
//             description
//         });

//         // שמירה למסד הנתונים
//         await newExpense.save();

//         res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add expense", error: error.message });
//     }
// };



const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    const { title, amount, category, date, description, isRecurring, userId } = req.body;
    try {
        const newExpense = new Expense({
            title,
            amount,
            category,
            date,
            description,
            isRecurring,
            userId,
        });
        await newExpense.save();
        res.status(201).json({ message: 'הוצאה נשמרה בהצלחה', expense: newExpense });
    } catch (error) {
        console.error('Error saving expense:', error);
        res.status(500).json({ message: 'שגיאה בשמירת ההוצאה', error: error.message });
    }
};
