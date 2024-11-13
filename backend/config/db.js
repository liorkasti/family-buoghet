const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // מנסה להתחבר למסד הנתונים MongoDB בהתאם למשתנה הסביבתי MONGO_URI
        // אם המשתנה הסביבתי אינו קיים, משתמש בכתובת localhost כברירת מחדל
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/familyBudgetDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        // במקרה של כישלון בהתחברות, מדפיס את הודעת השגיאה ויוצא מהתהליך
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;