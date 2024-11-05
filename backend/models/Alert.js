const mongoose = require('mongoose');


const AlertSchema = new mongoose.Schema({
    message: { type: String, required: true }, // תוכן הודעת ההתראה
    type: {
        type: String,
        enum: ['budget', 'expense', 'limit'],  // סוג ההתראה: מגבלת תקציב, הוצאה או קרוב למגבלת קטגוריה
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }  // תאריך יצירת ההתראה
});

const Alert = mongoose.model('Alert', AlertSchema);

module.exports = Alert;
