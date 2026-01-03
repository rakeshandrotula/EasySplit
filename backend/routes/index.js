const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const groupController = require('../controllers/groupController');
const expenseController = require('../controllers/expenseController');

// Users
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUser);

// Groups
router.post('/groups', groupController.createGroup);
router.get('/groups/:id', groupController.getGroup);
router.post('/groups/:id/members', groupController.addMember);
router.get('/groups/:id/settlements', groupController.getSettlements);

// Expenses
router.post('/expenses', expenseController.createExpense);
router.get('/expenses', expenseController.getExpenses); // ?group_id=...
router.post('/parse-expense-ai', expenseController.parseExpenseAI);

module.exports = router;
