require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Expense = require('../models/Expense');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/budgro-expense';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB (expense)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Get dashboard stats for a user
app.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Get all expenses and incomes for the user
    const expenses = await Expense.find({ userId });
    // Calculate stats
    const totalBalance = expenses.reduce((sum, e) => sum + (e.type === 'income' ? e.amount : -e.amount), 0);
    const spendingByMonth = Array(12).fill(0);
    const now = new Date();
    expenses.forEach(e => {
      if (e.type === 'expense') {
        const month = new Date(e.date).getMonth();
        spendingByMonth[month] += e.amount;
      }
    });
    const recentExpenses = expenses.filter(e => e.type === 'expense').sort((a, b) => b.date - a.date).slice(0, 10);
    // Dummy credit score logic
    const creditScore = 1620;
    res.json({
      balance: totalBalance,
      spending: spendingByMonth,
      expenses: recentExpenses,
      creditScore,
      transactions: recentExpenses.map(e => ({
        name: e.category,
        date: e.date,
        amount: -e.amount,
        description: e.description
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Expense service listening on port ${PORT}`);
});
