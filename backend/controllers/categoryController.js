const Category = require('../models/Category');  // ייבוא מודל קטגוריה

// פונקציה להוספת קטגוריה חדשה
exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // יצירת קטגוריה חדשה
        const newCategory = new Category({
            name,
            description
        });

        // שמירת הקטגוריה למסד הנתונים
        await newCategory.save();

        res.status(201).json({ message: "Category added successfully!", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Failed to add category", error: error.message });
    }
};
