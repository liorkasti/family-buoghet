// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // נוסיף את זה להצפנת סיסמאות

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // להסרת רווחים מיותרים
    minlength: 3  // מינימום 3 תווים
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // מינימום 6 תווים
  },
  role: {
    type: String,
    enum: ['parent', 'child'],
    required: true
  },
  // שדות חדשים שנדרשים לפי האפיון
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.role === 'child'; // נדרש רק אם המשתמש הוא ילד
    }
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// מתודה להצפנת סיסמה לפני שמירה
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// מתודה להשוואת סיסמאות
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// מתודה להחזרת מידע בסיסי על המשתמש (ללא סיסמה)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;