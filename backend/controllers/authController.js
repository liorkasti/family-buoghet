// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Budget = require('../models/Budget');
const { generateToken } = require('../middleware/auth');

// Utility functions
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const validatePassword = (password) => {
    // לפחות 6 תווים, אות גדולה, אות קטנה ומספר
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
};

const createInitialBudget = async (userId) => {
    const defaultCategories = ['food', 'transportation', 'bills', 'entertainment', 'shopping', 'other'];
    const categories = defaultCategories.map(name => ({
        name,
        limit: 0,
        used: 0
    }));

    await Budget.create({
        userId,
        totalAmount: 0,
        categories,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
};

// Controllers
exports.register = async (req, res) => {
    try {
        const { username, password, role, parentId, email } = req.body;

        // ולידציות מורחבות
        if (!username || !password || !role || !email) {
            return res.status(400).json({ 
                error: 'כל השדות הם חובה',
                missingFields: {
                    username: !username,
                    password: !password,
                    role: !role,
                    email: !email
                }
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ 
                error: 'הסיסמה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'כתובת האימייל אינה תקינה' });
        }

        // בדיקות כפילויות
        const [existingUsername, existingEmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ]);

        if (existingUsername) {
            return res.status(409).json({ error: 'שם המשתמש כבר קיים במערכת' });
        }

        if (existingEmail) {
            return res.status(409).json({ error: 'כתובת האימייל כבר קיימת במערכת' });
        }

        // בדיקות נוספות לחשבון ילד
        if (role === 'child') {
            if (!parentId) {
                return res.status(400).json({ error: 'נדרש מזהה הורה עבור חשבון ילד' });
            }

            const parent = await User.findById(parentId);
            if (!parent || parent.role !== 'parent') {
                return res.status(400).json({ error: 'מזהה ההורה שגוי' });
            }

            // בדיקת מספר הילדים המקסימלי להורה
            const childrenCount = await User.countDocuments({ parentId });
            if (childrenCount >= 5) {
                return res.status(400).json({ error: 'הגעת למספר המקסימלי של ילדים להורה' });
            }
        }

        // יצירת משתמש חדש
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role,
            parentId: role === 'child' ? parentId : undefined,
            createdAt: new Date(),
            lastLogin: new Date()
        });

        await newUser.save();

        // יצירת תקציב התחלתי
        if (role === 'parent') {
            await createInitialBudget(newUser._id);
        }

        // יצירת טוקן
        const token = generateToken(newUser);

        // שליחת אימייל ברוכים הבאים
        // TODO: implement email service
        // await sendWelcomeEmail(email, username);

        res.status(201).json({
            message: 'המשתמש נרשם בהצלחה',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                parentId: newUser.parentId
            }
        });

    } catch (error) {
        console.error('שגיאה בתהליך ההרשמה:', error);
        res.status(500).json({ 
            error: 'שגיאה בתהליך ההרשמה',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'נדרשים שם משתמש וסיסמה' });
        }

        const user = await User.findOne({ username })
            .select('+password'); // נדרש אם הגדרנו את הסיסמה כ-select: false

        if (!user) {
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // עדכון מונה ניסיונות כניסה כושלים
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            
            if (user.failedLoginAttempts >= 5) {
                user.accountLocked = true;
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // נעילה ל-30 דקות
                await user.save();
                return res.status(403).json({ 
                    error: 'החשבון ננעל עקב ניסיונות כניסה כושלים. נסה שוב בעוד 30 דקות' 
                });
            }
            
            await user.save();
            return res.status(401).json({ error: 'סיסמה שגויה' });
        }

        // בדיקת נעילת חשבון
        if (user.accountLocked) {
            if (user.lockUntil && user.lockUntil > new Date()) {
                return res.status(403).json({ 
                    error: 'החשבון נעול. נסה שוב מאוחר יותר',
                    unlockTime: user.lockUntil
                });
            }
            // שחרור נעילה אם עבר הזמן
            user.accountLocked = false;
            user.lockUntil = null;
        }

        // איפוס ניסיונות כניסה כושלים
        user.failedLoginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                parentId: user.parentId,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('שגיאה בתהליך ההתחברות:', error);
        res.status(500).json({ error: 'שגיאה בתהליך ההתחברות' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        if (currentPassword === newPassword) {
            return res.status(400).json({ 
                error: 'הסיסמה החדשה חייבת להיות שונה מהסיסמה הנוכחית' 
            });
        }

        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'הסיסמה הנוכחית שגויה' });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ 
                error: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר' 
            });
        }

        user.password = await hashPassword(newPassword);
        user.passwordChangedAt = new Date();
        await user.save();

        // שליחת התראה על שינוי סיסמה
        // TODO: implement email service
        // await sendPasswordChangeNotification(user.email);

        res.json({ message: 'הסיסמה שונתה בהצלחה' });

    } catch (error) {
        console.error('שגיאה בשינוי הסיסמה:', error);
        res.status(500).json({ error: 'שגיאה בשינוי הסיסמה' });
    }
};

// שכחתי סיסמה
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'נדרשת כתובת אימייל' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // מסיבות אבטחה, נחזיר הודעת הצלחה גם אם המשתמש לא קיים
            return res.json({ message: 'אם האימייל קיים במערכת, ישלח אליך קישור לאיפוס סיסמה' });
        }

        // יצירת טוקן לאיפוס סיסמה
        const resetToken = generateToken(user, '1h');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // שעה אחת
        await user.save();

        // שליחת אימייל עם קישור לאיפוס סיסמה
        // TODO: implement email service
        // await sendPasswordResetEmail(email, resetToken);

        res.json({ message: 'נשלח אליך אימייל עם הוראות לאיפוס הסיסמה' });

    } catch (error) {
        console.error('שגיאה בתהליך שחזור הסיסמה:', error);
        res.status(500).json({ error: 'שגיאה בתהליך שחזור הסיסמה' });
    }
};

module.exports = exports;