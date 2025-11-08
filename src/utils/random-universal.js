const { isNode, isBrowser } = require('./platform');

function getNodeCrypto() {
  // eslint-disable-next-line
  return eval('require("crypto")');
}

/**
 * Universal secure random bytes:
 * - Node.js: uses crypto.randomBytes
 * - Browser: uses window.crypto.getRandomValues
 */
function randomBytes(length) {
  if (isNode) {
    const nodeCrypto = getNodeCrypto();
    return new Uint8Array(nodeCrypto.randomBytes(length));
  } else if (isBrowser) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    return arr;
  }
  throw new Error('random-universal: Unsupported platform');
}

module.exports = randomBytes;
