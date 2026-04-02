const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const Budget = require('../models/Budget');

// --- Incomes ---
router.get('/incomes', authenticateToken, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/incomes', authenticateToken, async (req, res) => {
  const { category, amount, date } = req.body;
  const income = new Income({
    user: req.user._id,
    category,
    amount,
    date
  });
  try {
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/incomes/:id', authenticateToken, async (req, res) => {
  try {
    await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Expenses ---
router.get('/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/expenses', authenticateToken, async (req, res) => {
  const { category, amount, date } = req.body;
  const expense = new Expense({
    user: req.user._id,
    category,
    amount,
    date
  });
  try {
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/expenses/:id', authenticateToken, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Debts ---
router.get('/debts', authenticateToken, async (req, res) => {
  try {
    const debts = await Debt.find({ user: req.user._id });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/debts', authenticateToken, async (req, res) => {
  const { name, amount, dueDate, status } = req.body;
  const debt = new Debt({
    user: req.user._id,
    name,
    amount,
    dueDate,
    status
  });
  try {
    const savedDebt = await debt.save();
    res.status(201).json(savedDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/debts/:id', authenticateToken, async (req, res) => {
  try {
    await Debt.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Budgets ---
router.get('/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/budgets', authenticateToken, async (req, res) => {
  const { category, amount } = req.body;
  try {
    let budget = await Budget.findOne({ user: req.user._id, category });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = new Budget({
        user: req.user._id,
        category,
        amount
      });
      await budget.save();
    }
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/budgets/:category', authenticateToken, async (req, res) => {
  try {
    await Budget.findOneAndDelete({ user: req.user._id, category: req.params.category });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;