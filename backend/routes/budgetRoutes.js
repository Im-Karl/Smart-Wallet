const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBudgets, createBudget, getBudgetById, getDailyRecord, getDailyRecordHistory } = require('../controllers/budgetController');
const {addTransaction } = require('../controllers/transactionController');


router.get('/', protect, getBudgets);
router.post('/', protect, createBudget);
router.get('/:id', protect, getBudgetById);
router.get("/:id/history", getDailyRecordHistory);
router.get('/:budget_id/daily/:date',protect, getDailyRecord);
router.post('/:budget_id/transactions', protect, addTransaction);

module.exports = router;
