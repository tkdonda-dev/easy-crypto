/**
 * Encrypt JavaScript objects as JSON
 */

const encrypt = require('./encrypt');
async function encryptObject(obj, password, options = { output: 'base64' }) {
  if (typeof obj !== 'object' || obj === null) throw new Error('First arg must be object');
  return await encrypt(JSON.stringify(obj), password, options);
}
module.exports = encryptObject;