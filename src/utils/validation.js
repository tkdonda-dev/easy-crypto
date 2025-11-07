/**
 * Input validation utilities
 */

const {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_TEXT_LENGTH,
  MAX_TEXT_LENGTH,
} = require('./constants');

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password must be a non-empty string' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters` };
  }
  return { valid: true, error: null };
}

function validateText(text) {
  if (typeof text !== 'string') {
    return { valid: false, error: 'Text must be a string' };
  }
  if (text.length < MIN_TEXT_LENGTH) {
    return { valid: false, error: 'Text cannot be empty' };
  }
  const textBytes = Buffer.byteLength(text, 'utf8');
  if (textBytes > MAX_TEXT_LENGTH) {
    return { valid: false, error: `Text exceeds maximum size of ${MAX_TEXT_LENGTH} bytes` };
  }
  return { valid: true, error: null };
}

function validateEncryptedText(encryptedText) {
  if (!encryptedText || typeof encryptedText !== 'string') {
    return { valid: false, error: 'Encrypted text must be a non-empty string' };
  }
  if (encryptedText.length < 20) {
    return { valid: false, error: 'Encrypted text appears too short' };
  }
  // Basic Base64 validation
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encryptedText)) {
    return { valid: false, error: 'Encrypted text is not valid Base64' };
  }
  return { valid: true, error: null };
}

function validateHash(hash) {
  if (!hash || typeof hash !== 'string') {
    return { valid: false, error: 'Hash must be a non-empty string' };
  }
  if (hash.length < 20) {
    return { valid: false, error: 'Hash appears too short' };
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(hash)) {
    return { valid: false, error: 'Hash is not valid Base64' };
  }
  return { valid: true, error: null };
}

module.exports = {
  validatePassword,
  validateText,
  validateEncryptedText,
  validateHash,
};
