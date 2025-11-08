module.exports = async function pbkdf2(password, salt, iterations, keylen, digest) {
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
};
