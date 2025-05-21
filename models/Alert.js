const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  reasons: [String],
  sentAt: { type: Date, default: Date.now },
  via: [String], // e.g., ['email', 'sms']
});

module.exports = mongoose.model('Alert', AlertSchema);
