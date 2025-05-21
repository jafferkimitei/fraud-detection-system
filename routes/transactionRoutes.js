const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const detectFraud = require('../utils/fraudEngine');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const Alert = require('../models/Alert');
const { body, validationResult } = require('express-validator');


const validateTransaction = [
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('location').notEmpty().withMessage('Location is required'),
  body('timestamp').isISO8601().withMessage('Timestamp must be valid ISO8601 format'),
];


router.post('/', validateTransaction, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const transactionData = req.body;
    const fraudReasons = await detectFraud(transactionData);
    let txn;

    if (fraudReasons.length > 0) {
      transactionData.status = 'flagged';
      transactionData.fraudReasons = fraudReasons;
    
      const txn = await Transaction.create(transactionData);
    
      // 📧 Send alert to admin
      const user = await User.findById(transactionData.userId);
    
      const emailBody = `
        🚨 Fraud Alert 🚨
    
        User: ${user.name} (${user.email})
        Amount: ${transactionData.amount}
        Reasons: ${fraudReasons.join(', ')}
    
        View in dashboard.
      `;
    
      await sendEmail({
        to: process.env.ALERT_EMAIL,
        subject: '⚠️ Fraudulent Transaction Detected',
        text: emailBody
      });
    
      // 🗃 Save alert log
      await Alert.create({
        userId: transactionData.userId,
        transactionId: txn._id,
        reasons: fraudReasons,
        via: ['email']
      });  
    }
    res.status(201).json(txn);
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const txns = await Transaction.find().populate('userId');
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛑 GET all flagged transactions
router.get('/flagged', async (req, res) => {
  try {
    const flagged = await Transaction.find({ status: 'flagged' }).populate('userId', 'name email');
    res.json(flagged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 GET transaction statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const flagged = await Transaction.countDocuments({ status: 'flagged' });
    const approved = await Transaction.countDocuments({ status: 'approved' });
    const declined = await Transaction.countDocuments({ status: 'declined' });

    const fraudRulesStats = await Transaction.aggregate([
      { $match: { status: 'flagged' } },
      { $unwind: "$fraudReasons" },
      { $group: { _id: "$fraudReasons", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalTransactions: total,
      flaggedTransactions: flagged,
      approvedTransactions: approved,
      declinedTransactions: declined,
      fraudRulesBreakdown: fraudRulesStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction trends over time
router.get('/transaction-trends', async (req, res) => {
  try {
    const transactions = await Transaction.find({}, 'timestamp');
    const dailyTrends = transactions.reduce((acc, txn) => {
      const date = new Date(txn.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    res.json(dailyTrends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);

module.exports = router;
