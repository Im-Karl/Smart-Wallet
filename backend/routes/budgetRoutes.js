const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const transactionController = require('../controllers/transactionController');
// const authMiddleware = require('../middleware/authMiddleware'); // Cần cho xác thực

// router.use(authMiddleware); // Áp dụng xác thực cho tất cả routes

// POST /api/budgets (Bước 4)
router.post('/', budgetController.createBudget); 

// POST /api/budgets/:budget_id/transactions (Bước 5)
router.post('/:budget_id/transactions', transactionController.addTransaction);

module.exports = router;