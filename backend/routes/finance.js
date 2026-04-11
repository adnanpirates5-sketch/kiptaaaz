const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

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
  const { name, amount, dueDate, status, type } = req.body;
  const debt = new Debt({
    user: req.user._id,
    name,
    amount,
    dueDate,
    status,
    type
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

router.patch('/debts/:id', authenticateToken, async (req, res) => {
  try {
    const updatedDebt = await Debt.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

// --- Savings Goals ---
router.get('/savings-goals', authenticateToken, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/savings-goals', authenticateToken, async (req, res) => {
  try {
    const { name, target, current, deadline } = req.body;
    
    if (!name || target === undefined) {
      return res.status(400).json({ message: 'Name and target are required' });
    }

    const goalData = {
      user: req.user._id,
      name,
      target: Number(target),
      current: Number(current || 0)
    };
    
    if (deadline) goalData.deadline = deadline;
    
    const goal = new SavingsGoal(goalData);
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error("Error saving goal:", err);
    res.status(400).json({ message: err.message });
  }
});

router.patch('/savings-goals/:id', authenticateToken, async (req, res) => {
  try {
    const updatedGoal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/savings-goals/:id', authenticateToken, async (req, res) => {
  try {
    await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Savings goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;