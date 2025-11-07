/**
 * Generate reusable encryption key from password
 */

const crypto = require('crypto');
const nacl = require('tweetnacl');
const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  KEY_LENGTH,
  SALT_LENGTH,
} = require('../utils/constants');
const { validatePassword } = require('../utils/validation');

function generateKey(password, salt) {
  const validation = validatePassword(password);
  if (!validation.valid) throw new Error(validation.error);

  if (!salt) {
    salt = nacl.randomBytes(SALT_LENGTH);
  } else {
    salt = new Uint8Array(salt);
  }

  const keyBuffer = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt),
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    PBKDF2_DIGEST
  );

  const key = new Uint8Array(keyBuffer);

  return { key, salt };
}

module.exports = generateKey;
