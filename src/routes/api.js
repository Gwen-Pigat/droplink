const express = require('express');
const router = express.Router();
const { upload } = require('../config');
const { validateTransferCreation } = require('../middlewares/validator');
const {
  createTransfer,
  getTransferMetadata,
  unlockTransfer,
  downloadFile
} = require('../controllers/transfer');

// Route mapping
router.post('/', upload.array('files'), validateTransferCreation, createTransfer);
router.get('/:id', getTransferMetadata);
router.post('/:id/unlock', unlockTransfer);
router.get('/:id/files/:fileId', downloadFile);

module.exports = router;
