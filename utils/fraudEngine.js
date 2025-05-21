const redis = require('../config/redis');
const transaction = require('../models/Transaction');
const User = require('../models/User');

const FRAUD_AMOUNT_THRESHOLD = 200000;
const RAPID_TXN_THRESHOLD = 3;
const TXN_WINDOW_SECONDS = 60;

const detectFraud = async (transaction) => {
  const reasons = [];
  const userId = transaction.userId.toString();

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

  // Rule 3: Rapid transactions via Redis
  const now = Date.now();
  const txnKey = `user_txn_${userId}`;
  await redis.zadd(txnKey, now, now); 
  await redis.expire(txnKey, TXN_WINDOW_SECONDS); 

  const oneMinuteAgo = now - TXN_WINDOW_SECONDS * 1000;
  const recentTxnCount = await redis.zcount(txnKey, oneMinuteAgo, now);

  if (recentTxnCount > RAPID_TXN_THRESHOLD) {
    reasons.push(`Too many transactions in ${TXN_WINDOW_SECONDS}s: ${recentTxnCount}`);
  }

  return reasons;
};

module.exports = detectFraud;

async function evaluateTransaction(transaction) {
  // Future: call a Python API / load a model
  return {
    isFraud: false,
    score: 0.02 
  };
}

module.exports = evaluateTransaction;

