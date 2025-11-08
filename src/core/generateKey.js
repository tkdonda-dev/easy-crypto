/**
 * Generate reusable encryption key from password
 */

const pbkdf2 = require('../utils/pbkdf2-universal');
const randomBytes = require('../utils/random-universal');
const {
  PBKDF2_ITERATIONS,
  PBKDF2_DIGEST,
  KEY_LENGTH,
  SALT_LENGTH,
} = require('../utils/constants');
const { validatePassword } = require('../utils/validation');

async function generateKey(password, salt) {
  const validation = validatePassword(password);
  if (!validation.valid) throw new Error(validation.error);
  if (!salt) {
    salt = randomBytes(SALT_LENGTH);
  } else {
    salt = new Uint8Array(salt);
  }
  const key = await pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
  return { key, salt };
}
module.exports = generateKey;
