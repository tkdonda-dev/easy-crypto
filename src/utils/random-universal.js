// Universal secure random bytes
const { isNode, isBrowser } = require('./platform');

let nodeCrypto;
if (isNode) {
  nodeCrypto = require('crypto');
}

function randomBytes(length) {
  if (isNode) {
    return new Uint8Array(nodeCrypto.randomBytes(length));
  } else if (isBrowser) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    return arr;
  } else {
    throw new Error('randomBytes: Unknown runtime platform. Not supported.');
  }
}

module.exports = randomBytes;
