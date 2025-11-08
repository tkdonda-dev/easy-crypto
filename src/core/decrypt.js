/**
 * Decryption module for easy-crypto
 */

const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const pbkdf2 = require('../utils/pbkdf2-universal');
const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  SALT_LENGTH,
  NONCE_LENGTH,
  KEY_LENGTH,
} = require('../utils/constants');
const { validatePassword, validateEncryptedText } = require('../utils/validation');

async function decrypt(encrypted, password, options = { input: 'base64' }) {
  const pval = validatePassword(password);
  if (!pval.valid) throw new Error(pval.error);
  const tval = options.input === 'base64' ? validateEncryptedText(encrypted) : { valid: true };
  if (!tval.valid) throw new Error(tval.error);

  let combined;
  if (options.input === 'base64') {
    combined = util.decodeBase64(encrypted);
  } else {
    combined = new Uint8Array(encrypted);
  }

  if (combined.length < SALT_LENGTH + NONCE_LENGTH + 1) {
    throw new Error('Encrypted data too short');
  }
  const salt = new Uint8Array(combined.slice(0, SALT_LENGTH));
  const nonce = new Uint8Array(combined.slice(SALT_LENGTH, SALT_LENGTH + NONCE_LENGTH));
  const ciphertext = new Uint8Array(combined.slice(SALT_LENGTH + NONCE_LENGTH));
  const key = await pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);

  const decryptedBytes = nacl.secretbox.open(ciphertext, nonce, key);
  if (!decryptedBytes) throw new Error('Decryption failed - wrong password or corrupted data');
  return util.encodeUTF8(decryptedBytes);
}

module.exports = decrypt;
