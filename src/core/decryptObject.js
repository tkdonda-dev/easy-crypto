/**
 * Decrypt and parse JSON objects
 */

const decrypt = require('./decrypt');

/**
 * Decrypts and parses a JSON object
 * 
 * @param {string|Uint8Array} encrypted - Encrypted data from encryptObject()
 * @param {string} password - Decryption password
 * @param {Object} options - Decryption options { input: 'base64'|'raw' }
 * @returns {Object} Decrypted and parsed JavaScript object
 */
function decryptObject(encrypted, password, options = { input: 'base64' }) {
  const decryptedString = decrypt(encrypted, password, options);
  
  try {
    return JSON.parse(decryptedString);
  } catch (error) {
    throw new Error(`Failed to parse decrypted JSON: ${error.message}`);
  }
}

module.exports = decryptObject;
