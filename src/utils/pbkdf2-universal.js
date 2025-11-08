// Universal PBKDF2 for async key derivation on all platforms
const { isNode, isBrowser } = require('./platform');

// For browser API param normalization
function webHashName(digest) {
  // 'sha256' or 'SHA-256' => 'SHA-256'
  return digest.toUpperCase().replace('-', '');
}

let nodeCrypto;
if (isNode) {
  nodeCrypto = require('crypto');
}

/**
 * Derive key using PBKDF2 (Node: Buffer; Browser: ArrayBuffer)
 * Always returns a Promise<Uint8Array>
 */
async function pbkdf2(password, salt, iterations, keylen, digest) {
  if (isNode) {
    // Node.js: Sync call (wrapped in promise for API)
    const buf = nodeCrypto.pbkdf2Sync(password, Buffer.from(salt), iterations, keylen, digest);
    return new Uint8Array(buf);
  } else if (isBrowser) {
    // Browser: WebCrypto API
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      typeof password === 'string'
        ? new TextEncoder().encode(password)
        : password,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derived = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(salt),
        iterations,
        hash: webHashName(digest),
      },
      keyMaterial,
      keylen * 8
    );
    return new Uint8Array(derived);
  } else {
    throw new Error('pbkdf2: Unknown runtime platform. Not supported.');
  }
}

module.exports = pbkdf2;
