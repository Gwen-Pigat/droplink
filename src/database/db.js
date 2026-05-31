const fs = require('fs');
const crypto = require('crypto');
const { DB_FILE } = require('../config');

/**
 * Reads metadata database synchronously
 * @returns {object} Database contents
 */
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON database, resetting:', error);
    return { transfers: {} };
  }
}

/**
 * Writes metadata database synchronously
 * @param {object} db Database content to write
 */
function writeDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing JSON database:', error);
  }
}

/**
 * Creates cryptographically secure SHA-256 hash of password
 * @param {string} password Raw text password
 * @returns {string|null} Hashed digest or null
 */
function hashPassword(password) {
  if (!password) return null;
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {
  readDatabase,
  writeDatabase,
  hashPassword
};
