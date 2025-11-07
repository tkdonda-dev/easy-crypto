/**
 * Encrypt JavaScript objects as JSON
 */

const encrypt = require('./encrypt');

/**
 * Encrypts a JS object by serializing to JSON first
 * 
 * @param {Object} obj - JavaScript object to encrypt
 * @param {string} password - Encryption password
 * @param {Object} options - Encryption options { output: 'base64'|'raw' }
 * @returns {string|Uint8Array} Encrypted data
 */
function encryptObject(obj, password, options = { output: 'base64' }) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('First argument must be an object');
  }
  
  const jsonString = JSON.stringify(obj);
  
  return encrypt(jsonString, password, options);
}

module.exports = encryptObject;
