const express = require('express');
const { addTransaction, getTransactions } = require('../controllers/transactionController');
const authenticate = require('../Middleware/authMiddleware'); // Import the authenticate middleware
const router = express.Router();

// Add a transaction (protected route)
router.post('/add', authenticate, addTransaction);

// Get all transactions for a user (protected route)
router.get('/:userId', authenticate, getTransactions);

module.exports = router;
