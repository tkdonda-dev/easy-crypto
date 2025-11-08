/**
 * Universal Encryption module for easy-crypto
 */

const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const pbkdf2 = require('../utils/pbkdf2');
const randomBytes = require('../utils/randomBytes');
const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  SALT_LENGTH,
  NONCE_LENGTH,
  KEY_LENGTH,
} = require('../utils/constants');
const { validatePassword, validateText } = require('../utils/validation');

/**
 * Async encrypt for any platform
 */
async function encrypt(text, password, options = { output: 'base64' }) {
  const pval = validatePassword(password);
  if (!pval.valid) throw new Error(pval.error);
  const tval = validateText(text);
  if (!tval.valid) throw new Error(tval.error);

  const salt = randomBytes(SALT_LENGTH);
  const key = await pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
  const nonce = randomBytes(NONCE_LENGTH);
  const textBytes = util.decodeUTF8(text);
  const encryptedBytes = nacl.secretbox(textBytes, nonce, key);

  const combined = new Uint8Array(salt.length + nonce.length + encryptedBytes.length);
  combined.set(salt, 0);
  combined.set(nonce, salt.length);
  combined.set(encryptedBytes, salt.length + nonce.length);

  // Always return Uint8Array if explicitly requested, else base64 string
  return options.output === 'raw' ? combined : util.encodeBase64(combined);
}

module.exports = encrypt;
