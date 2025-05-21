const evaluateTransaction = require('../utils/fraudEngine');
const result = await evaluateTransaction(transactionData);

if (result.isFraud) {
  return res.status(403).json({ error: 'Fraud detected' });
}
