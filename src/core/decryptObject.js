/**
 * Decrypt and parse JSON objects
 */

const decrypt = require('./decrypt');
async function decryptObject(encrypted, password, options = { input: 'base64' }) {
  const decrypted = await decrypt(encrypted, password, options);
  return JSON.parse(decrypted);
}
module.exports = decryptObject;