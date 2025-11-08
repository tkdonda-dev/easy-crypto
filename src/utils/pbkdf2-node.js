const crypto = require('crypto');
module.exports = function pbkdf2(password, salt, iterations, keylen, digest) {
  const buf = crypto.pbkdf2Sync(password, Buffer.from(salt), iterations, keylen, digest);
  return Promise.resolve(new Uint8Array(buf));
};
