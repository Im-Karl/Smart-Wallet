const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {getCategoryStats, getMonthlyFlow} = require('../controllers/statController.js');

router.get('/categories', protect, getCategoryStats);

router.get('/monthly-flow', protect, getMonthlyFlow);

module.exports = router;