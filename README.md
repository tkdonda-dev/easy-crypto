# Easy Crypto Universal

> Universal encryption library with zero native dependencies for Node.js, browsers, React, React Native, and Expo.

[![npm version](https://img.shields.io/npm/v/@tkdonda/easy-crypto.svg)](https://www.npmjs.com/package/@tkdonda/easy-crypto)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## Features

- **Simple encryption/decryption** - One-line API with password-based encryption
- **Object encryption** - Encrypt any JavaScript object as JSON
- **Password hashing** - Secure bcrypt-style hashing for authentication
- **Key generation** - Derive reusable keys from passwords
- **Random bytes** - Cryptographically secure random generation
- **Universal** - Works on Node.js, Web, React, React Native, Expo
- **Zero dependencies** - Only 7KB TweetNaCl (pure JavaScript)
- **Public domain** - Unlicense (most permissive license)
- **Battle-tested** - Built on TweetNaCl (used by Signal, WireGuard)
- **Production-ready** - Complete error handling and validation

## Installation

npm install @tkdonda/easy-crypto


## Quick Start

<pre> ```js
const crypto = require('@tkdonda/easy-crypto');

// Encrypt
const encrypted = crypto.encrypt('Secret message', 'password123');
console.log(encrypted);

// Decrypt
const decrypted = crypto.decrypt(encrypted, 'password123');
console.log(decrypted); // 'Secret message'
``` </pre>


## API Reference

### Encryption & Decryption

#### `encrypt(text, password, options?)`

Encrypts text with a password.

// Basic usage (returns Base64 string)
const encrypted = crypto.encrypt('Hello World', 'myPassword');

// With options
const encryptedRaw = crypto.encrypt('Hello', 'pw', { output: 'raw' }); // Returns Uint8Array


**Parameters:**
- `text` (string) - Text to encrypt
- `password` (string) - Encryption password (min 8 characters)
- `options` (object, optional) - `{ output: 'base64' | 'raw' }`

**Returns:** `string` (Base64) or `Uint8Array` (raw)

---

#### `decrypt(encryptedText, password, options?)`

Decrypts encrypted text.

const decrypted = crypto.decrypt(encrypted, 'myPassword');

// Decrypt raw Uint8Array
const decryptedFromRaw = crypto.decrypt(rawData, 'pw', { input: 'raw' });


**Parameters:**
- `encryptedText` (string | Uint8Array) - Encrypted data
- `password` (string) - Decryption password
- `options` (object, optional) - `{ input: 'base64' | 'raw' }`

**Returns:** `string` (decrypted original text)

**Throws:** Error if password is wrong or data is corrupted

---

### Object Encryption

#### `encryptObject(obj, password, options?)`

Encrypts any JavaScript object (serializes to JSON).

const user = { id: 123, name: 'Alice', email: 'alice@example.com' };
const encrypted = crypto.encryptObject(user, 'password');


**Parameters:**
- `obj` (object) - JavaScript object to encrypt
- `password` (string) - Encryption password
- `options` (object, optional) - Same as `encrypt()`

**Returns:** `string` (Base64) or `Uint8Array`

---

#### `decryptObject(encrypted, password, options?)`

Decrypts and parses a JavaScript object.

const decrypted = crypto.decryptObject(encrypted, 'password');
console.log(decrypted); // { id: 123, name: 'Alice', ... }


**Parameters:**
- `encrypted` (string | Uint8Array) - Encrypted data
- `password` (string) - Decryption password
- `options` (object, optional) - Same as `decrypt()`

**Returns:** `object` (parsed JavaScript object)

---

### Password Hashing

#### `hash(password)`

Hashes a password for secure storage (e.g., in database).

const hashedPassword = crypto.hash('userPassword123');
// Store hashedPassword in database


**Parameters:**
- `password` (string) - Password to hash (min 8 characters)

**Returns:** `string` (Base64 hash with embedded salt)

---

#### `verifyHash(password, storedHash)`

Verifies a password against its hash.

// During login
const isValid = crypto.verifyHash('userPassword123', storedHash);
if (isValid) {
// Login successful
} else {
// Invalid password
}


**Parameters:**
- `password` (string) - Password to verify
- `storedHash` (string) - Hash from `hash()`

**Returns:** `boolean` (true if password matches)

---

### Key Generation

#### `generateKey(password, salt?)`

Derives a reusable 32-byte key from a password.

const { key, salt } = crypto.generateKey('masterPassword');
// Use key for multiple encryptions without re-hashing

// Re-generate same key later
const { key: sameKey } = crypto.generateKey('masterPassword', salt);


**Parameters:**
- `password` (string) - Password to derive key from
- `salt` (Uint8Array, optional) - Salt (generates random if not provided)

**Returns:** `{ key: Uint8Array, salt: Uint8Array }`

---

### Random Bytes

#### `randomBytes(length)`

Generates cryptographically secure random bytes.

const nonce = crypto.randomBytes(24);
const token = crypto.randomBytes(32);
const salt = crypto.randomBytes(16);


**Parameters:**
- `length` (number) - Number of bytes to generate (1-65536)

**Returns:** `Uint8Array` (random bytes)

---

### Metadata

#### `getVersion()`

Returns version information.

console.log(crypto.getVersion());
// "easy-crypto v1.0.0 (tweetnacl v1.0.3)"


---

## Platform Compatibility

| Platform           | Status | Minimum Version |
|--------------------|--------|-----------------|
| Node.js            | ✅     | 18.0.0          |
| Web Browser        | ✅     | ES6+            |
| React              | ✅     | 16.0.0          |
| React Native       | ✅     | 0.70.0          |
| React Native Expo  | ✅     | 45.0.0          |
| Electron           | ✅     | 12.0.0          |

---

## Real-World Examples

### User Authentication (Login System)

// Registration - hash password before storing
const userPassword = 'userSecurePassword';
const hashedPassword = crypto.hash(userPassword);
// Save hashedPassword to database

// Login - verify password
const loginPassword = 'userSecurePassword';
const isValid = crypto.verifyHash(loginPassword, hashedPassword);
if (isValid) {
// Login successful
}


### Secure API Key Storage

// Encrypt sensitive API keys before database storage
const apiKeys = {
stripe: 'sk_live_abc123',
aws: 'AKIAIOSFODNN7EXAMPLE',
github: 'ghp_1234567890'
};

const encrypted = crypto.encryptObject(apiKeys, 'master-encryption-key');
// Store encrypted in database

// Later, decrypt when needed
const decrypted = crypto.decryptObject(encrypted, 'master-encryption-key');
console.log(decrypted.stripe); // 'sk_live_abc123'


### End-to-End Message Encryption

// Sender
const message = 'Confidential information';
const encrypted = crypto.encrypt(message, 'shared-secret');
// Send encrypted over network

// Receiver
const decrypted = crypto.decrypt(encrypted, 'shared-secret');
console.log(decrypted); // 'Confidential information'


---

## Security

- **Algorithm:** XSalsa20-Poly1305 (authenticated encryption)
- **Key derivation:** PBKDF2 with 100,000 iterations (SHA-256)
- **Salt:** 16 bytes random per encryption/hash
- **Nonce:** 24 bytes random per encryption
- **Key size:** 256 bits (32 bytes)
- **No length limits:** Handles any password/text length safely
- **Timing-safe:** Password verification immune to timing attacks

---

## License

**Unlicense** (Public Domain)

This is free and unencumbered software released into the public domain. See [UNLICENSE](UNLICENSE) file.

---

## Credits

Built on [TweetNaCl.js](https://tweetnacl.js.org/) - audited, fast, and trusted cryptography library.

---

## More Examples

See [examples/node/basic.js](examples/node/basic.js) for comprehensive demonstrations of all features.

