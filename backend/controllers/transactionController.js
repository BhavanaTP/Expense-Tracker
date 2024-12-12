const mongoose = require('mongoose');
const Transaction = require('../models/transaction');

// Add Transaction
exports.addTransaction = async (req, res) => {
  const { text, amount, userId } = req.body;
  console.log("Received userId:", userId);
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId. Must be a valid ObjectId.' });
  }

  try {
    const transaction = new Transaction({ text, amount, userId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Add Transaction Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
  const { userId } = req.params;

  console.log("Received userId:", userId); // Debugging log

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId. Must be a valid ObjectId.' });
  }

  try {
    const transactions = await Transaction.find({ userId });
    console.log("Transactions fetched:", transactions); // Debugging log
    res.json(transactions);
  } catch (err) {
    console.error('Get Transactions Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
