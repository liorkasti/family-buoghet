// controllers/requestController.js
const Request = require('../models/Request');
const User = require('../models/User');
const Alert = require('../models/Alert');

exports.createRequest = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const childId = req.user.userId;

        // מציאת ההורה של הילד
        const child = await User.findById(childId);
        if (!child || !child.parentId) {
            return res.status(400).json({ error: 'לא נמצא הורה משויך' });
        }

        const newRequest = new Request({
            childId,
            parentId: child.parentId,
            amount,
            description,
            category,
            status: 'pending',
            date: new Date()
        });

        await newRequest.save();

        // יצירת התראה להורה
        await Alert.create({
            userId: child.parentId,
            type: 'request_pending',
            message: `בקשה חדשה מ-${child.username} על סך ${amount} ש"ח`,
            relatedData: {
                requestId: newRequest._id,
                childId,
                amount
            }
        });

        res.status(201).json({
            message: 'הבקשה נשלחה בהצלחה',
            request: newRequest
        });

    } catch (error) {
        res.status(500).json({ error: 'שגיאה ביצירת הבקשה' });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { status, startDate, endDate } = req.query;

        let query = {};
        
        // הורה רואה את כל הבקשות של הילדים שלו
        // ילד רואה רק את הבקשות שלו
        if (role === 'parent') {
            query.parentId = userId;
        } else {
            query.childId = userId;
        }

        if (status) {
            query.status = status;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const requests = await Request.find(query)
            .sort({ date: -1 })
            .populate('childId', 'username')
            .exec();

        res.json(requests);

    } catch (error) {
        res.status(500).json({ error: 'שגיאה בקבלת הבקשות' });
    }
};

exports.respondToRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, comment } = req.body;
        const parentId = req.user.userId;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'הבקשה לא נמצאה' });
        }

        if (request.parentId.toString() !== parentId) {
            return res.status(403).json({ error: 'אין הרשאה לטפל בבקשה זו' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'לא ניתן לשנות בקשה שכבר טופלה' });
        }

        request.status = status;
        request.parentComment = comment;
        request.responseDate = new Date();
        await request.save();

        // יצירת התראה לילד
        await Alert.create({
            userId: request.childId,
            type: 'request_response',
            message: `הבקשה שלך ${status === 'approved' ? 'אושרה' : 'נדחתה'}`,
            relatedData: {
                requestId: request._id,
                status,
                comment
            }
        });

        res.json({
            message: 'התגובה נשמרה בהצלחה',
            request
        });

    } catch (error) {
        res.status(500).json({ error: 'שגיאה בטיפול בבקשה' });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { userId, role } = req.user;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'הבקשה לא נמצאה' });
        }

        // רק הילד שיצר את הבקשה יכול למחוק אותה, וזה רק אם היא עדיין ממתינה
        if (role === 'child' && (request.childId.toString() !== userId || request.status !== 'pending')) {
            return res.status(403).json({ error: 'אין הרשאה למחוק בקשה זו' });
        }

        await Request.findByIdAndDelete(requestId);
        res.json({ message: 'הבקשה נמחקה בהצלחה' });

    } catch (error) {
        res.status(500).json({ error: 'שגיאה במחיקת הבקשה' });
    }
};

module.exports = exports;