const express = require('express');
const path = require('path');
const router = express.Router();
const { ROOT_DIR } = require('../config');

// Serve share.html for clean link URLs
router.get('/link/:id', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'share.html'));
});

// Fallback to serving index.html for undefined frontend routes
router.get('*', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'index.html'));
});

module.exports = router;
