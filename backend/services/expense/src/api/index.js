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


// Add a new expense/transaction
app.post('/expense', async (req, res) => {
  try {
    const { userId, amount, category, description, date, type } = req.body;
    const expense = new Expense({ userId, amount, category, description, date, type });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add expense', details: err.message });
  }
});

// Edit an expense/transaction
app.put('/expense/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const expense = await Expense.findByIdAndUpdate(id, update, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update expense', details: err.message });
  }
});

// Delete an expense/transaction
app.delete('/expense/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Expense.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete expense', details: err.message });
  }
});

// List all expenses/transactions for a user
app.get('/expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
  }
});

// --- Mock Credit Score Endpoints ---
// In production, store in DB. For now, use in-memory object
const creditScores = {};

app.get('/credit-score/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ creditScore: creditScores[userId] || 0 });
});

app.put('/credit-score/:userId', (req, res) => {
  const { userId } = req.params;
  const { creditScore } = req.body;
  creditScores[userId] = creditScore;
  res.json({ creditScore });
});

app.listen(PORT, () => {
  console.log(`Expense service listening on port ${PORT}`);
});
