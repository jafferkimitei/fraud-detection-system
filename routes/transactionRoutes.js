const express = require('express');
const Transaction = require('../models/Transaction');
const detectFraud = require('../utils/fraudEngine');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transactionData = req.body;
    const fraudReasons = await detectFraud(transactionData);

    transactionData.status = fraudReasons.length > 0 ? 'flagged' : 'approved';
    if (fraudReasons.length > 0) {
      transactionData.fraudReasons = fraudReasons;
    }

    const txn = await Transaction.create(transactionData);
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

module.exports = router;
