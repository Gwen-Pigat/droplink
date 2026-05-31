const { readDatabase } = require('../database/db');

/**
 * Middleware: Validate transfer payload upon creation
 */
function validateTransferCreation(req, res, next) {
  const { title, customSlug, startDate, endDate } = req.body;

  // Title validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Le nom du transfert est obligatoire.' });
  }

  // Expiration boundary check
  if (startDate && endDate) {
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "La date d'expiration doit être postérieure à la date d'activation." });
    }
  }

  // Custom Slug checking
  if (customSlug && customSlug.trim() !== '') {
    const sanitizedSlug = customSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (sanitizedSlug.length < 3) {
      return res.status(400).json({ error: 'Le lien personnalisé doit faire au moins 3 caractères (lettres, chiffres, tirets).' });
    }

    const db = readDatabase();
    if (db.transfers[sanitizedSlug]) {
      return res.status(400).json({ error: 'Ce lien personnalisé est déjà utilisé. Veuillez en choisir un autre.' });
    }
    
    // Save sanitized slug back to body
    req.body.customSlug = sanitizedSlug;
  }

  next();
}

/**
 * Helper: Validates start/end date constraints on active links
 * @param {object} transfer Transfer metadata
 * @returns {string|null} Returns state string ('pending', 'expired') if invalid, otherwise null
 */
function validateTransferDates(transfer) {
  const now = new Date();
  if (transfer.startDate && now < new Date(transfer.startDate)) {
    return 'pending';
  }
  if (transfer.endDate && now > new Date(transfer.endDate)) {
    return 'expired';
  }
  return null;
}

module.exports = {
  validateTransferCreation,
  validateTransferDates
};
