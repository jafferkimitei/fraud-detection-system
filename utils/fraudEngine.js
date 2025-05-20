const Transaction = require('../models/Transaction');
const User = require('../models/User');

const FRAUD_AMOUNT_THRESHOLD = 200000;

const detectFraud = async (transaction) => {
  const reasons = [];

  const user = await User.findById(transaction.userId);
  if (!user) {
    reasons.push('User not found');
    return reasons;
  }

  // Rule 1: High amount
  if (transaction.amount > FRAUD_AMOUNT_THRESHOLD) {
    reasons.push(`High transaction amount: ${transaction.amount}`);
  }

  // Rule 2: Country mismatch
  if (transaction.location && user.country && transaction.location !== user.country) {
    reasons.push(`Geo mismatch: ${transaction.location} vs user ${user.country}`);
  }

  // Rule 3: Rapid transactions
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentTxns = await Transaction.find({
    userId: transaction.userId,
    timestamp: { $gte: oneMinuteAgo }
  });

  if (recentTxns.length >= 3) {
    reasons.push(`Multiple rapid transactions: ${recentTxns.length} in 1 min`);
  }

  return reasons;
};

module.exports = detectFraud;
