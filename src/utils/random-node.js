const crypto = require('crypto');
module.exports = function randomBytes(length) {
  return new Uint8Array(crypto.randomBytes(length));
};
