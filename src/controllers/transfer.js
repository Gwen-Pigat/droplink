const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { UPLOADS_DIR } = require('../config');
const { readDatabase, writeDatabase, hashPassword } = require('../database/db');
const { validateTransferDates } = require('../middlewares/validator');

/**
 * Controller: Handles transfer creation and file uploads mapping
 */
function createTransfer(req, res) {
  try {
    const { title, textContent, password, startDate, endDate, customSlug } = req.body;
    const db = readDatabase();

    // Assign final slug/ID
    const transferId = customSlug || uuidv4().substring(0, 8);

    // Map files
    const files = (req.files || []).map(file => ({
      id: uuidv4(),
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename
    }));

    const transfer = {
      id: transferId,
      title: title.trim(),
      textContent: textContent || '',
      passwordHash: password ? hashPassword(password) : null,
      hasPassword: !!password,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      files: files
    };

    db.transfers[transferId] = transfer;
    writeDatabase(db);

    res.status(201).json({
      success: true,
      transferId: transferId,
      url: `/link/${transferId}`
    });
  } catch (err) {
    console.error('Controller error in createTransfer:', err);
    res.status(500).json({ error: 'Une erreur serveur est survenue lors de l\'enregistrement.' });
  }
}

/**
 * Controller: Fetches transfer metadata (filters secure payload if locked or inactive)
 */
function getTransferMetadata(req, res) {
  const { id } = req.params;
  const db = readDatabase();
  const transfer = db.transfers[id];

  if (!transfer) {
    return res.status(404).json({ error: 'Transfert introuvable ou expiré.' });
  }

  // Verify dates
  const dateStatus = validateTransferDates(transfer);
  if (dateStatus === 'pending') {
    return res.json({
      status: 'pending',
      title: transfer.title,
      startDate: transfer.startDate,
      hasPassword: transfer.hasPassword
    });
  }
  if (dateStatus === 'expired') {
    return res.json({
      status: 'expired',
      title: transfer.title,
      endDate: transfer.endDate
    });
  }

  // Verify password lock state
  if (transfer.hasPassword) {
    return res.json({
      status: 'locked',
      id: transfer.id,
      title: transfer.title,
      hasPassword: true,
      filesCount: transfer.files.length,
      createdAt: transfer.createdAt,
      endDate: transfer.endDate
    });
  }

  // Public/Accessible payload
  res.json({
    status: 'unlocked',
    id: transfer.id,
    title: transfer.title,
    textContent: transfer.textContent,
    createdAt: transfer.createdAt,
    endDate: transfer.endDate,
    files: transfer.files.map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      mimetype: f.mimetype
    }))
  });
}

/**
 * Controller: Verifies passwords and returns full payload if successful
 */
function unlockTransfer(req, res) {
  const { id } = req.params;
  const { password } = req.body;
  const db = readDatabase();
  const transfer = db.transfers[id];

  if (!transfer) {
    return res.status(404).json({ error: 'Transfert introuvable.' });
  }

  // Validate dates
  const dateStatus = validateTransferDates(transfer);
  if (dateStatus === 'pending') {
    return res.status(403).json({ error: 'Ce transfert n\'est pas encore actif.' });
  }
  if (dateStatus === 'expired') {
    return res.status(403).json({ error: 'Ce transfert a expiré.' });
  }

  // Verify password
  if (transfer.hasPassword) {
    const incomingHash = hashPassword(password);
    if (incomingHash !== transfer.passwordHash) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
  }

  res.json({
    success: true,
    textContent: transfer.textContent,
    files: transfer.files.map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      mimetype: f.mimetype
    }))
  });
}

/**
 * Controller: Handles downloads of physical files
 */
function downloadFile(req, res) {
  const { id, fileId } = req.params;
  const { password } = req.query;
  const db = readDatabase();
  const transfer = db.transfers[id];

  if (!transfer) {
    return res.status(404).json({ error: 'Transfert introuvable.' });
  }

  // Verify dates
  const dateStatus = validateTransferDates(transfer);
  if (dateStatus === 'pending') {
    return res.status(403).send('Ce transfert n\'est pas encore actif.');
  }
  if (dateStatus === 'expired') {
    return res.status(403).send('Ce transfert a expiré.');
  }

  // Verify password lock
  if (transfer.hasPassword) {
    const incomingHash = hashPassword(password);
    if (incomingHash !== transfer.passwordHash) {
      return res.status(401).send('Accès refusé : mot de passe incorrect.');
    }
  }

  // Locate file
  const file = transfer.files.find(f => f.id === fileId);
  if (!file) {
    return res.status(404).send('Fichier introuvable.');
  }

  const filePath = path.join(UPLOADS_DIR, file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Fichier manquant sur le serveur.');
  }

  res.download(filePath, file.name);
}

module.exports = {
  createTransfer,
  getTransferMetadata,
  unlockTransfer,
  downloadFile
};
