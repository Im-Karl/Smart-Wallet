const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBudgets, createBudget, getDailyRecord } = require('../controllers/budgetController');
const {addTransaction } = require('../controllers/transactionController');


router.get('/', protect, getBudgets);
router.post('/', protect, createBudget);
router.get('/:budget_id/daily/:date',protect, getDailyRecord);
router.post('/:budget_id/transactions', protect, addTransaction);

module.exports = router;
