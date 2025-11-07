/**
 * Password hashing module
 */

const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const crypto = require('crypto');

const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  SALT_LENGTH,
  KEY_LENGTH,
} = require('../utils/constants');

const { validatePassword } = require('../utils/validation');

/**
 * Hash a password for secure storage
 */
function hash(password) {
  const validation = validatePassword(password);
  if (!validation.valid) {
    throw new Error(`Invalid password: ${validation.error}`);
  }

  try {
    // Generate random salt (Uint8Array)
    const salt = nacl.randomBytes(SALT_LENGTH);

    // Derive hash
    const hashedBuffer = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      PBKDF2_DIGEST
    );

    // Convert to Uint8Array
    const hashedBytes = new Uint8Array(hashedBuffer);

    // Combine salt + hash
    const combined = new Uint8Array(salt.length + hashedBytes.length);
    combined.set(new Uint8Array(salt), 0);
    combined.set(hashedBytes, salt.length);

    // Return as Base64
    return util.encodeBase64(combined);
  } catch (error) {
    throw new Error(`Hashing failed: ${error.message}`);
  }
}

/**
 * Verify password against hash
 */
function verifyHash(password, storedHash) {
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return false;
  }

  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }

  try {
    // Decode hash
    const combined = util.decodeBase64(storedHash);

    // Extract salt and hash as Uint8Array
    const salt = new Uint8Array(combined.slice(0, SALT_LENGTH));
    const storedHashBytes = new Uint8Array(combined.slice(SALT_LENGTH));

    // Re-hash password
    const newHashBuffer = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      PBKDF2_DIGEST
    );

    // Compare with timing-safe
    try {
      return crypto.timingSafeEqual(
        Buffer.from(storedHashBytes),
        newHashBuffer
      );
    } catch (err) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

module.exports = {
  hash,
  verifyHash,
};
