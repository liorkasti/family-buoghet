// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'אנא התחבר למערכת' });
    }
};

// מידלוור לבדיקת הרשאות הורה
const requireParent = async (req, res, next) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({ error: 'גישה להורים בלבד' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'שגיאה באימות הרשאות' });
    }
};

// מידלוור לבדיקת בעלות על משאב
const checkResourceOwnership = (Model) => async (req, res, next) => {
    try {
        const resource = await Model.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'המשאב לא נמצא' });
        }

        if (resource.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'אין הרשאות לגשת למשאב זה' });
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
    checkResourceOwnership
};