const { isNode, isBrowser } = require('./platform');

// Use eval to hide from bundlers (Webpack, Vite, CRA)
function getNodeCrypto() {
  // eslint-disable-next-line
  return eval('require("crypto")');
}

/**
 * Universal async PBKDF2-SHA256.
 * - Node.js: uses crypto.pbkdf2Sync (returns Uint8Array)
 * - Browser: uses window.crypto.subtle (async, returns Uint8Array)
 */
async function pbkdf2(password, salt, iterations, keylen, digest) {
  if (isNode) {
    const nodeCrypto = getNodeCrypto();
    const buf = nodeCrypto.pbkdf2Sync(password, Buffer.from(salt), iterations, keylen, digest);
    return new Uint8Array(buf);
  } else if (isBrowser) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      typeof password === 'string' ? encoder.encode(password) : password,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derived = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(salt),
        iterations,
        hash: digest.toUpperCase().replace('-', ''), // 'sha256' → 'SHA256'
      },
      keyMaterial,
      keylen * 8
    );
    return new Uint8Array(derived);
  }
  throw new Error('pbkdf2-universal: Unsupported platform');
}

module.exports = pbkdf2;
