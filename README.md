# Easy Crypto Universal

> Universal encryption library with zero native dependencies for Node.js, browsers, React, React Native, and Expo.

[![npm version](https://img.shields.io/npm/v/@tkdonda/easy-crypto.svg)](https://www.npmjs.com/package/@tkdonda/easy-crypto)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## Features

- **Simple encryption/decryption** – One-line async API
- **Object encryption** – Encrypt any JavaScript object as JSON
- **Password hashing** – Secure async hashing for authentication
- **Key generation** – Derive reusable keys from passwords
- **Random bytes** – Cryptographically secure random generation
- **Universal** – Async: works on Node.js, Web, React, React Native, Expo
- **Zero dependencies** – Only 7KB TweetNaCl (pure JavaScript)
- **Public domain** – Unlicense (most permissive license)
- **Battle-tested** – Built on TweetNaCl (used by Signal, WireGuard)
- **Production-ready** – Full validation & error handling, ES6+ ready

---

## Installation

```
npm install @tkdonda/easy-crypto
```


---

## Quick Start

> **All methods are async! Use `await` (or `.then()`).**

```
const crypto = require('@tkdonda/easy-crypto');

(async () => {
// Encrypt
const encrypted = await crypto.encrypt('Secret message', 'password123');
console.log(encrypted);

// Decrypt
const decrypted = await crypto.decrypt(encrypted, 'password123');
console.log(decrypted); // 'Secret message'
})();
```


---

## API Reference

### Encryption & Decryption

#### `await encrypt(text, password, options?)`

Encrypts text with a password.

```
// Returns Base64 string
const encrypted = await crypto.encrypt('Hello World', 'myPassword');

// With options: return Uint8Array
const encryptedRaw = await crypto.encrypt('Hello', 'pw', { output: 'raw' }); // → Uint8Array
```


**Parameters:**
- `text` (string): Text to encrypt
- `password` (string): Encryption password (min 8 characters)
- `options` (object, optional): `{ output: 'base64' | 'raw' }` (default: `'base64'`)

**Returns:** `Promise<string>` (Base64) or `Promise<Uint8Array>` (raw)

---

#### `await decrypt(encryptedText, password, options?)`

Decrypts encrypted text.

```
const decrypted = await crypto.decrypt(encrypted, 'myPassword');

// Decrypt raw Uint8Array
const decryptedFromRaw = await crypto.decrypt(rawData, 'pw', { input: 'raw' });
```


**Parameters:**
- `encryptedText` (string | Uint8Array): Encrypted data
- `password` (string): Decryption password
- `options` (object, optional): `{ input: 'base64' | 'raw' }` (default: `'base64'`)

**Returns:** `Promise<string>` (decrypted original text)

**Throws:** Error if password is wrong or data is corrupted

---

### Object Encryption

#### `await encryptObject(obj, password, options?)`

Encrypts any JavaScript object (serializes to JSON).

```
const user = { id: 123, name: 'Alice', email: 'alice@example.com' };
const encrypted = await crypto.encryptObject(user, 'password');
```


**Parameters:** See `encrypt()`.
**Returns:** `Promise<string>` (Base64) or `Promise<Uint8Array>`

---

#### `await decryptObject(encrypted, password, options?)`

Decrypts and parses a JavaScript object.

```
const decrypted = await crypto.decryptObject(encrypted, 'password');
console.log(decrypted); // { id: 123, name: 'Alice', ... }
```


**Parameters:** See `decrypt()`.
**Returns:** `Promise<object>` (parsed JavaScript object)

---

### Password Hashing

#### `await hash(password)`

Hashes a password for secure storage.

```
const hashedPassword = await crypto.hash('userPassword123');
// Save hashedPassword in database
```


**Parameters:** `password` (string): Password to hash (min 8 characters)
**Returns:** `Promise<string>` (Base64 hash with embedded salt)

---

#### `await verifyHash(password, storedHash)`

Verifies a password against its hash.

```
// During login
const isValid = await crypto.verifyHash('userPassword123', storedHash);
if (isValid) {
// Login successful
}
```


**Parameters:**
- `password` (string): Password to verify
- `storedHash` (string): Hash from `hash()`

**Returns:** `Promise<boolean>`

---

### Key Generation

#### `await generateKey(password, salt?)`

Derives a reusable 32-byte key from a password.

```
const { key, salt } = await crypto.generateKey('masterPassword');
// Use key for multiple encryptions without re-hashing

// Re-generate same key later
const { key: sameKey } = await crypto.generateKey('masterPassword', salt);
```


**Parameters:**
- `password` (string): Password to derive key from
- `salt` (Uint8Array, optional): Salt (generates random if not provided)

**Returns:** `Promise<{ key: Uint8Array, salt: Uint8Array }>`

---

### Random Bytes

#### `randomBytes(length)`

Generates cryptographically secure random bytes.

```
const nonce = crypto.randomBytes(24);
const token = crypto.randomBytes(32);
const salt = crypto.randomBytes(16);
```


**Parameters:** `length` (number): Number of bytes to generate (1-65536)
**Returns:** `Uint8Array` (random bytes)

---

### Metadata

#### `getVersion()`

Returns version information.

```
console.log(crypto.getVersion());
// "easy-crypto v1.0.0 (tweetnacl v1.0.3)"
```


---

### Configuration

#### `config`  
Check all settings:

```
console.log(crypto.config.pbkdf2Iterations);
console.log(crypto.config.saltLength);
console.log(crypto.config.nonceLength);
console.log(crypto.config.keyLength);
console.log(crypto.config.minPasswordLength);
console.log(crypto.config.maxPasswordLength);
console.log(crypto.config.version);
console.log(crypto.config.depTweetnaclVersion);
```


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

```
// Registration - hash password before storing
const hashedPassword = await crypto.hash('userSecurePassword');
// Save hashedPassword to database

// Login - verify password
const isValid = await crypto.verifyHash('userSecurePassword', hashedPassword);
if (isValid) {
// Login successful
}
```


---

### Secure API Key Storage

```
/ Encrypt sensitive API keys before database storage
const apiKeys = {
stripe: 'sk_live_abc123',
aws: 'AKIAIOSFODNN7EXAMPLE',
github: 'ghp_1234567890'
};

const encrypted = await crypto.encryptObject(apiKeys, 'master-encryption-key');
// Store encrypted in database

// Later, decrypt when needed
const decrypted = await crypto.decryptObject(encrypted, 'master-encryption-key');
console.log(decrypted.stripe); // 'sk_live_abc123'
```


---

### End-to-End Message Encryption

```
// Sender
const encrypted = await crypto.encrypt('Confidential information', 'shared-secret');
// Send encrypted over network

// Receiver
const decrypted = await crypto.decrypt(encrypted, 'shared-secret');
console.log(decrypted); // 'Confidential information'
```


---

## Security

- **Algorithm:** XSalsa20-Poly1305 (authenticated encryption)
- **Key derivation:** PBKDF2 with 100,000 iterations (SHA-256)
- **Salt:** 16 bytes random per encryption/hash
- **Nonce:** 24 bytes random per encryption
- **Key size:** 256 bits (32 bytes)
- **Timing-safe:** Password verification immune to timing attacks

---

## License

**Unlicense** (Public Domain)

This is free and unencumbered software released into the public domain. See [UNLICENSE](UNLICENSE) file.

---

## Credits

Built on [TweetNaCl.js](https://tweetnacl.js.org/) — audited, fast, and trusted cryptography.

---

## More Examples

See [examples/node/basic.js](examples/node/basic.js) for comprehensive demonstrations of all features.
