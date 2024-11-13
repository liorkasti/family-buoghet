// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Utility functions
const createToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

const validatePassword = (password) => {
    // לפחות 6 תווים, אות גדולה, אות קטנה ומספר
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
};

// Controllers
exports.signup = async (req, res) => {
    const { username, password, role, parentId } = req.body;

    try {
        // ולידציות
        if (!username || !password || !role) {
            return res.status(400).json({ 
                error: 'חסרים שדות חובה',
                details: {
                    username: !username ? 'שם משתמש נדרש' : null,
                    password: !password ? 'סיסמה נדרשת' : null,
                    role: !role ? 'תפקיד נדרש' : null
                }
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ 
                error: 'הסיסמה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר'
            });
        }

        // בדיקת משתמש קיים
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                error: 'שם המשתמש כבר קיים במערכת'
            });
        }

        // ולידציה לחשבון ילד
        if (role === 'child' && !parentId) {
            return res.status(400).json({ 
                error: 'נדרש מזהה הורה עבור חשבון ילד'
            });
        }

        if (role === 'child') {
            const parent = await User.findById(parentId);
            if (!parent || parent.role !== 'parent') {
                return res.status(400).json({ 
                    error: 'מזהה ההורה שסופק אינו תקין'
                });
            }
        }

        // יצירת משתמש חדש
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            password: hashedPassword, 
            role,
            parentId: role === 'child' ? parentId : undefined,
            monthlyBudget: role === 'child' ? 0 : undefined // תקציב התחלתי לילד
        });

        await newUser.save();

        // יצירת טוקן והחזרת תשובה
        const token = createToken(newUser);
        
        res.status(201).json({
            message: 'המשתמש נרשם בהצלחה',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ 
            error: 'אירעה שגיאה בתהליך ההרשמה',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // ולידציות
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'נדרשים שם משתמש וסיסמה'
            });
        }

        // מציאת המשתמש
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ 
                error: 'שם המשתמש אינו קיים במערכת'
            });
        }

        // בדיקת סיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'הסיסמה שגויה'
            });
        }

        // עדכון תאריך התחברות אחרון
        user.lastLogin = new Date();
        await user.save();

        // יצירת טוקן והחזרת תשובה
        const token = createToken(user);

        res.json({
            message: 'התחברת בהצלחה',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                parentId: user.parentId
            }
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ 
            error: 'אירעה שגיאה בתהליך ההתחברות'
        });
    }
};

// קבלת פרטי משתמש
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'אירעה שגיאה בקבלת פרטי המשתמש' });
    }
};

// עדכון פרטי משתמש
exports.updateUserProfile = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.userId);

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'שם המשתמש כבר קיים במערכת' });
            }
            user.username = username;
        }

        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'הסיסמה הנוכחית שגויה' });
            }

            if (!validatePassword(newPassword)) {
                return res.status(400).json({ 
                    error: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר'
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.json({ message: 'הפרטים עודכנו בהצלחה' });

    } catch (error) {
        res.status(500).json({ error: 'אירעה שגיאה בעדכון הפרטים' });
    }
};

module.exports = exports;