const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  amount: { type: Number, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Expense', expenseSchema);
