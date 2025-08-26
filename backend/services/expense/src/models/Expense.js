const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' }
});

module.exports = mongoose.model('Expense', expenseSchema);
