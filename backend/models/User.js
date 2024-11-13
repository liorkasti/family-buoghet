// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'שם משתמש הוא שדה חובה'],
        unique: true,
        trim: true,
        minlength: [3, 'שם משתמש חייב להכיל לפחות 3 תווים']
    },
    password: {
        type: String,
        required: [true, 'סיסמה היא שדה חובה'],
        minlength: [6, 'סיסמה חייבת להכיל לפחות 6 תווים'],
        select: false // לא יוחזר בשאילתות רגילות
    },
    email: {
        type: String,
        required: [true, 'אימייל הוא שדה חובה'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'כתובת אימייל לא תקינה'
        }
    },
    role: {
        type: String,
        enum: ['parent', 'child'],
        required: [true, 'תפקיד הוא שדה חובה']
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { 
            return this.role === 'child';
        }
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: {
        type: Date
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordChangedAt: Date
}, {
    timestamps: true
});

// אינדקסים
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ parentId: 1 }, { sparse: true });

// וירטואלים
userSchema.virtual('isLocked').get(function() {
    return this.accountLocked && this.lockUntil > Date.now();
});

// מידלוור לפני שמירה
userSchema.pre('save', async function(next) {
    // אם הסיסמה לא שונתה, המשך
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// מתודות סטטיות
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// מתודות של המסמך
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

userSchema.methods.incrementLoginAttempts = async function() {
    // מעדכן את מספר ניסיונות הכניסה הכושלים
    this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
    
    if (this.failedLoginAttempts >= 5) {
        this.accountLocked = true;
        this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 דקות
    }
    
    return this.save();
};

userSchema.methods.resetLoginAttempts = function() {
    this.failedLoginAttempts = 0;
    this.accountLocked = false;
    this.lockUntil = null;
    return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;