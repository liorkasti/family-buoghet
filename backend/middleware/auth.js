// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * יצירת טוקן JWT
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/**
 * מידלוור לאימות משתמש
 */
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'נא להתחבר למערכת' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'טוקן לא תקין' });
        }
    } catch (error) {
        res.status(500).json({ error: 'שגיאת אימות' });
    }
};

/**
 * מידלוור לבדיקת הרשאות הורה
 */
const requireParent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'נא להתחבר למערכת' });
    }

    if (req.user.role !== 'parent') {
        return res.status(403).json({ error: 'גישה להורים בלבד' });
    }

    next();
};

/**
 * בדיקת בעלות על משאב
 */
const checkOwnership = (Model) => async (req, res, next) => {
    try {
        const resource = await Model.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ error: 'משאב לא נמצא' });
        }

        // אם זה הורה, מאפשר גישה גם למשאבים של הילדים
        if (req.user.role === 'parent') {
            next();
            return;
        }

        // בדיקה שהמשאב שייך למשתמש
        if (resource.userId?.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'אין הרשאה למשאב זה' });
        }

        req.resource = resource;
        next();
    } catch (error) {
        res.status(500).json({ error: 'שגיאה בבדיקת הרשאות' });
    }
};

module.exports = {
    generateToken,
    authenticate,
    requireParent,
    checkOwnership
};