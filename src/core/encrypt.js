/**
 * Universal Encryption module for easy-crypto
 */

const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const crypto = require('crypto');

const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  SALT_LENGTH,
  NONCE_LENGTH,
  KEY_LENGTH,
} = require('../utils/constants');

const { validatePassword, validateText } = require('../utils/validation');

function encrypt(text, password, options = { output: 'base64' }) {
  const pval = validatePassword(password);
  if (!pval.valid) throw new Error(pval.error);

  const tval = validateText(text);
  if (!tval.valid) throw new Error(tval.error);

  try {
    const salt = nacl.randomBytes(SALT_LENGTH);

    const keyBuffer = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      PBKDF2_DIGEST
    );

    const key = new Uint8Array(keyBuffer);

    const nonce = nacl.randomBytes(NONCE_LENGTH);

    const textBytes = util.decodeUTF8(text);

    const encryptedBytes = nacl.secretbox(textBytes, nonce, key);

    if (!encryptedBytes) {
      throw new Error('Encryption failed');
    }

    const combined = new Uint8Array(salt.length + nonce.length + encryptedBytes.length);
    combined.set(new Uint8Array(salt), 0);
    combined.set(new Uint8Array(nonce), salt.length);
    combined.set(new Uint8Array(encryptedBytes), salt.length + nonce.length);

    if (options.output === 'raw') {
      return combined;
    }
    return util.encodeBase64(combined);
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

module.exports = encrypt;
