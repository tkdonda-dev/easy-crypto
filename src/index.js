/**
 * Easy Crypto - Main Entry Point
 */

const encrypt = require('./core/encrypt');
const decrypt = require('./core/decrypt');
const { hash, verifyHash } = require('./core/hash');
const generateKey = require('./core/generateKey');
const encryptObject = require('./core/encryptObject');
const decryptObject = require('./core/decryptObject');
const randomBytes = require('./core/randomBytes');

const { 
  validatePassword, 
  validateText, 
  validateEncryptedText, 
  validateHash 
} = require('./utils/validation');

const { 
  PACKAGE_VERSION, 
  DEP_TWEETNACL_VERSION,
  PBKDF2_ITERATIONS,
  SALT_LENGTH,
  NONCE_LENGTH,
  KEY_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} = require('./utils/constants');

/**
 * Main API
 */
const EasyCrypto = {
  // Core functions
  encrypt,
  decrypt,
  hash,
  verifyHash,
  generateKey,
  encryptObject,
  decryptObject,
  randomBytes,
  
  // Metadata
  getVersion: () => `easy-crypto v${PACKAGE_VERSION} (tweetnacl v${DEP_TWEETNACL_VERSION})`,
  version: PACKAGE_VERSION,
  
  // Validation helpers
  validate: {
    password: validatePassword,
    text: validateText,
    encryptedText: validateEncryptedText,
    hash: validateHash,
  },
  
  // Configuration info
  config: {
    version: PACKAGE_VERSION,
    pbkdf2Iterations: PBKDF2_ITERATIONS,
    saltLength: SALT_LENGTH,
    nonceLength: NONCE_LENGTH,
    keyLength: KEY_LENGTH,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
  },
};

module.exports = EasyCrypto;
module.exports.default = EasyCrypto;
