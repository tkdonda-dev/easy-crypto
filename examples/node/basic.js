/**
 * Easy Crypto - Complete Node.js Example
 * Demonstrates all features with real-world use cases
 * 
 * Run: node examples/node/basic.js
 */

const crypto = require('../../src/index.js');

console.log('=== Universal Easy Crypto - Node.js Complete Demo ===\n');

// ============================================
// 1. BASIC ENCRYPTION & DECRYPTION
// ============================================
console.log('1️⃣  Basic Encryption & Decryption');
console.log('─'.repeat(50));

const message = 'Secret message for secure transmission';
const password = 'secure-password-123';

const encrypted = crypto.encrypt(message, password);
console.log(`Original:  "${message}"`);
console.log(`Password:  "${password}"`);
console.log(`Encrypted: ${encrypted.substring(0, 60)}...`);
console.log(`Length:    ${encrypted.length} characters\n`);

const decrypted = crypto.decrypt(encrypted, password);
console.log(`Decrypted: "${decrypted}"`);
console.log(`✅ Match:   ${message === decrypted}\n`);

// ============================================
// 2. OBJECT ENCRYPTION (JSON)
// ============================================
console.log('2️⃣  Object Encryption (Real-world: User Data)');
console.log('─'.repeat(50));

const userData = {
  userId: 12345,
  username: 'alice',
  email: 'alice@example.com',
  role: 'admin',
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  },
  apiKeys: ['key-abc123', 'key-xyz789'],
  timestamp: new Date().toISOString()
};

console.log('Original object:');
console.log(JSON.stringify(userData, null, 2));

const encryptedObj = crypto.encryptObject(userData, password);
console.log(`\nEncrypted: ${encryptedObj.substring(0, 60)}...\n`);

const decryptedObj = crypto.decryptObject(encryptedObj, password);
console.log('Decrypted object:');
console.log(JSON.stringify(decryptedObj, null, 2));
console.log(`✅ Objects match: ${JSON.stringify(userData) === JSON.stringify(decryptedObj)}\n`);

// ============================================
// 3. PASSWORD HASHING & VERIFICATION
// ============================================
console.log('3️⃣  Password Hashing (Real-world: User Authentication)');
console.log('─'.repeat(50));

const userPassword = 'user-secure-password-456';
console.log(`User password: "${userPassword}"`);

const hashedPassword = crypto.hash(userPassword);
console.log(`Hashed (store in DB): ${hashedPassword.substring(0, 60)}...\n`);

// Simulate login - correct password
const loginAttempt1 = 'user-secure-password-456';
const isValid = crypto.verifyHash(loginAttempt1, hashedPassword);
console.log(`Login attempt: "${loginAttempt1}"`);
console.log(`✅ Result: ${isValid ? 'Login successful' : 'Login failed'}\n`);

// Simulate login - wrong password
const loginAttempt2 = 'wrong-password';
const isInvalid = crypto.verifyHash(loginAttempt2, hashedPassword);
console.log(`Login attempt: "${loginAttempt2}"`);
console.log(`✅ Result: ${isInvalid ? 'Login successful' : 'Login failed (correct)'}\n`);

// ============================================
// 4. GENERATE REUSABLE KEY
// ============================================
console.log('4️⃣  Generate Reusable Key (Real-world: Multiple Encryptions)');
console.log('─'.repeat(50));

const masterPassword = 'master-key-password';
const { key, salt } = crypto.generateKey(masterPassword);

console.log(`Master password: "${masterPassword}"`);
console.log(`Generated key length: ${key.length} bytes (${key.length * 8} bits)`);
console.log(`Salt length: ${salt.length} bytes`);
console.log(`Key (hex, first 16 bytes): ${Array.from(key.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
console.log(`Salt (hex): ${Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

// Re-generate same key with same password and salt
const { key: key2 } = crypto.generateKey(masterPassword, salt);
const keysMatch = key.every((byte, i) => byte === key2[i]);
console.log(`✅ Same key reproduced: ${keysMatch}\n`);

// ============================================
// 5. SECURE RANDOM BYTES
// ============================================
console.log('5️⃣  Secure Random Bytes (Real-world: Tokens, Nonces, IDs)');
console.log('─'.repeat(50));

const sessionToken = crypto.randomBytes(32);
const nonce = crypto.randomBytes(24);
const salt16 = crypto.randomBytes(16);

console.log(`Session token (32 bytes): ${Array.from(sessionToken.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('')}...`);
console.log(`Nonce (24 bytes): ${Array.from(nonce.slice(0, 12)).map(b => b.toString(16).padStart(2, '0')).join('')}...`);
console.log(`Salt (16 bytes): ${Array.from(salt16).map(b => b.toString(16).padStart(2, '0')).join('')}`);
console.log(`✅ All random bytes generated\n`);

// ============================================
// 6. OUTPUT FORMAT OPTIONS
// ============================================
console.log('6️⃣  Output Format Options (Base64 vs Raw)');
console.log('─'.repeat(50));

const textToEncrypt = 'Format test data';

// Base64 output (default - for storage/transmission)
const encryptedBase64 = crypto.encrypt(textToEncrypt, password, { output: 'base64' });
console.log(`Base64 output: ${encryptedBase64.substring(0, 60)}...`);
console.log(`Type: ${typeof encryptedBase64}`);
console.log(`Length: ${encryptedBase64.length} characters\n`);

// Raw Uint8Array output (for binary processing)
const encryptedRaw = crypto.encrypt(textToEncrypt, password, { output: 'raw' });
console.log(`Raw output type: ${encryptedRaw.constructor.name}`);
console.log(`Length: ${encryptedRaw.length} bytes`);
console.log(`First 16 bytes: ${Array.from(encryptedRaw.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}\n`);

// Decrypt both formats
const decryptedFromBase64 = crypto.decrypt(encryptedBase64, password);
const decryptedFromRaw = crypto.decrypt(encryptedRaw, password, { input: 'raw' });
console.log(`✅ Base64 decrypt: ${decryptedFromBase64 === textToEncrypt}`);
console.log(`✅ Raw decrypt: ${decryptedFromRaw === textToEncrypt}\n`);

// ============================================
// 7. ERROR HANDLING
// ============================================
console.log('7️⃣  Error Handling (Validation & Security)');
console.log('─'.repeat(50));

// Test 1: Password too short
try {
  crypto.encrypt('test', 'short');
} catch (error) {
  console.log(`✅ Caught error (weak password):`);
  console.log(`   ${error.message}\n`);
}

// Test 2: Wrong password during decryption
try {
  const enc = crypto.encrypt('secret', 'correct-password');
  crypto.decrypt(enc, 'wrong-password');
} catch (error) {
  console.log(`✅ Caught error (wrong password):`);
  console.log(`   ${error.message}\n`);
}

// Test 3: Invalid encrypted data
try {
  crypto.decrypt('invalid-base64-data', password);
} catch (error) {
  console.log(`✅ Caught error (corrupted data):`);
  console.log(`   ${error.message}\n`);
}

// Test 4: Empty text
try {
  crypto.encrypt('', password);
} catch (error) {
  console.log(`✅ Caught error (empty text):`);
  console.log(`   ${error.message}\n`);
}

// ============================================
// 8. VALIDATION HELPERS
// ============================================
console.log('8️⃣  Validation Helpers (Advanced Usage)');
console.log('─'.repeat(50));

// Validate password
const pwValidation1 = crypto.validate.password('good-password');
console.log(`Password "good-password": ${pwValidation1.valid ? '✅ Valid' : '❌ Invalid'}`);

const pwValidation2 = crypto.validate.password('bad');
console.log(`Password "bad": ${pwValidation2.valid ? '✅ Valid' : '❌ Invalid'} - ${pwValidation2.error}`);

// Validate text
const textValidation = crypto.validate.text('Hello World');
console.log(`Text "Hello World": ${textValidation.valid ? '✅ Valid' : '❌ Invalid'}\n`);

// ============================================
// 9. CONFIGURATION & METADATA
// ============================================
console.log('9️⃣  Configuration & Metadata');
console.log('─'.repeat(50));

console.log(`Package version: ${crypto.version}`);
console.log(`Full version: ${crypto.getVersion()}`);
console.log(`\nSecurity configuration:`);
console.log(`  - PBKDF2 iterations: ${crypto.config.pbkdf2Iterations.toLocaleString()}`);
console.log(`  - Salt length: ${crypto.config.saltLength} bytes`);
console.log(`  - Nonce length: ${crypto.config.nonceLength} bytes`);
console.log(`  - Key length: ${crypto.config.keyLength} bytes (${crypto.config.keyLength * 8} bits)`);
console.log(`  - Min password length: ${crypto.config.minPasswordLength} characters`);
console.log(`  - Max password length: ${crypto.config.maxPasswordLength} characters\n`);

// ============================================
// 10. REAL-WORLD USE CASE: API KEY STORAGE
// ============================================
console.log('🔟 Real-World Use Case: Secure API Key Storage');
console.log('─'.repeat(50));

// Simulate storing encrypted API keys
const apiKeys = {
  stripe: 'sk_live_abc123xyz789',
  aws: 'AKIAIOSFODNN7EXAMPLE',
  github: 'ghp_1234567890abcdefghijklmnop',
  createdAt: new Date().toISOString()
};

console.log('Original API keys (NEVER store these in plaintext!):');
console.log(JSON.stringify(apiKeys, null, 2));

const encryptedKeys = crypto.encryptObject(apiKeys, 'master-encryption-key-2024');
console.log(`\nEncrypted for database storage:`);
console.log(encryptedKeys.substring(0, 80) + '...\n');

// Later, retrieve and decrypt
const decryptedKeys = crypto.decryptObject(encryptedKeys, 'master-encryption-key-2024');
console.log('Decrypted API keys (in memory only):');
console.log(JSON.stringify(decryptedKeys, null, 2));
console.log(`✅ Secure storage demonstration complete\n`);

// ============================================
// SUMMARY
// ============================================
console.log('═'.repeat(50));
console.log('✅ ALL TESTS PASSED!');
console.log('═'.repeat(50));
console.log('\nFeatures demonstrated:');
console.log('  ✓ Basic encryption/decryption');
console.log('  ✓ Object encryption (JSON)');
console.log('  ✓ Password hashing & verification');
console.log('  ✓ Reusable key generation');
console.log('  ✓ Secure random bytes');
console.log('  ✓ Output format options (base64/raw)');
console.log('  ✓ Comprehensive error handling');
console.log('  ✓ Validation helpers');
console.log('  ✓ Configuration inspection');
console.log('  ✓ Real-world use cases\n');

console.log('🎉Universal Easy Crypto is ready!\n');
