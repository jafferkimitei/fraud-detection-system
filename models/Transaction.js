const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  location: String,
  device: String,
  ip: String,
  status: { type: String, enum: ['approved', 'declined', 'flagged'], default: 'approved' },
  fraudReasons: [String],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
