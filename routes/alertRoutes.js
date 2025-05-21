const express = require('express');
const Alert = require('../models/Alert');
const router = express.Router();

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('userId', 'name email')
      .populate('transactionId')
      .sort({ sentAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
