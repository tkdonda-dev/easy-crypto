/**
 * Secure random bytes generation
 */

const nacl = require('tweetnacl');

/**
 * Generate secure random bytes
 * @param {number} length - Number of bytes (1-65536)
 * @returns {Uint8Array} Random bytes
 */
function randomBytes(length) {
  if (!Number.isFinite(length) || length < 1 || length > 65536) {
    throw new Error('Length must be between 1 and 65536');
  }
  return nacl.randomBytes(length);
}

module.exports = randomBytes;
