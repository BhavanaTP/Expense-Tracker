const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
