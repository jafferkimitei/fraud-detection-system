const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get overall fraud stats
router.get('/fraud-stats', async (req, res) => {
  try {
    const totalTxns = await Transaction.countDocuments();
    const totalFlagged = await Transaction.countDocuments({ status: 'flagged' });
    const totalApproved = await Transaction.countDocuments({ status: 'approved' });
    const totalDeclined = await Transaction.countDocuments({ status: 'declined' });
    const fraudRate = ((totalFlagged / totalTxns) * 100).toFixed(2);
    const stats = {
      totalTxns,
      totalFlagged,
      totalApproved,
      totalDeclined,
      fraudRate
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);
// Get fraud reasons for flagged transactions
router.get('/fraud-reasons', async (req, res) => {
  try {
    const flaggedTxns = await Transaction.find({ status: 'flagged' }, 'fraudReasons');
    const fraudReasons = flaggedTxns.reduce((acc, txn) => {
      txn.fraudReasons.forEach(reason => {
        acc[reason] = (acc[reason] || 0) + 1;
      });
      return acc;
    }, {});
    res.json(fraudReasons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);
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

