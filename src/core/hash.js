/**
 * Password hashing module
 */

const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const pbkdf2 = require('../utils/pbkdf2-universal');
const randomBytes = require('../utils/random-universal');
const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  SALT_LENGTH,
  KEY_LENGTH,
} = require('../utils/constants');
const { validatePassword } = require('../utils/validation');

async function hash(password) {
  const validation = validatePassword(password);
  if (!validation.valid) throw new Error(`Invalid password: ${validation.error}`);
  const salt = randomBytes(SALT_LENGTH);
  const hashedBytes = await pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);

  const combined = new Uint8Array(salt.length + hashedBytes.length);
  combined.set(salt, 0);
  combined.set(hashedBytes, salt.length);
  return util.encodeBase64(combined);
}

async function verifyHash(password, storedHash) {
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) return false;
  if (!storedHash || typeof storedHash !== 'string') return false;
  try {
    const combined = util.decodeBase64(storedHash);
    const salt = new Uint8Array(combined.slice(0, SALT_LENGTH));
    const storedHashBytes = new Uint8Array(combined.slice(SALT_LENGTH));
    const newHashBytes = await pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
    if (storedHashBytes.length !== newHashBytes.length) return false;
    for (let i=0; i<storedHashBytes.length; ++i) {
      if (storedHashBytes[i] !== newHashBytes[i]) return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { hash, verifyHash };
