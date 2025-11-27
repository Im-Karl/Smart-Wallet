const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBudget } = require('../controllers/budgetController');
const {addTransaction } = require('../controllers/transactionController');

router.post('/', protect, createBudget);
router.post('/:budget_id/transactions', protect, addTransaction);

module.exports = router;
