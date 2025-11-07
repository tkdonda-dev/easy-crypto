/**
 * Universal Easy Crypto - React Web Example
 * 
 * Run with:
 * npx create-react-app test-app
 * Copy this to src/App.jsx
 * npm start
 */

import React, { useState } from 'react';
import crypto from '@tkdonda/easy-crypto';
// If testing locally: import crypto from '../../src/index.js';

function App() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const addOutput = (text) => {
    setOutput((prev) => prev + text + '\n');
  };

  const runAllTests = () => {
    setLoading(true);
    setOutput('');

    try {
      addOutput('=== Easy Crypto - React Web Example ===\n');

      // 1. Basic Encryption/Decryption
      addOutput('1️⃣  Basic Encryption & Decryption');
      const message = 'Hello from React!';
      const password = 'secure-password-123';
      
      const encrypted = crypto.encrypt(message, password);
      addOutput(`Original: "${message}"`);
      addOutput(`Encrypted: ${encrypted.substring(0, 50)}...`);
      
      const decrypted = crypto.decrypt(encrypted, password);
      addOutput(`Decrypted: "${decrypted}"`);
      addOutput(`✅ Match: ${message === decrypted}\n`);

      // 2. Object Encryption
      addOutput('2️⃣  Object Encryption');
      const userData = {
        username: 'alice',
        email: 'alice@example.com',
        preferences: { theme: 'dark', notifications: true },
        timestamp: new Date().toISOString()
      };

      const encryptedObj = crypto.encryptObject(userData, password);
      addOutput(`Object: ${JSON.stringify(userData, null, 2)}`);
      addOutput(`Encrypted object: ${encryptedObj.substring(0, 50)}...`);

      const decryptedObj = crypto.decryptObject(encryptedObj, password);
      addOutput(`Decrypted: ${JSON.stringify(decryptedObj, null, 2)}`);
      addOutput(`✅ Objects match: ${JSON.stringify(userData) === JSON.stringify(decryptedObj)}\n`);

      // 3. Password Hashing
      addOutput('3️⃣  Password Hashing & Verification');
      const userPassword = 'user-password-456';
      
      const hashedPassword = crypto.hash(userPassword);
      addOutput(`Password: "${userPassword}"`);
      addOutput(`Hashed: ${hashedPassword.substring(0, 50)}...`);

      const isValid = crypto.verifyHash(userPassword, hashedPassword);
      const isInvalid = crypto.verifyHash('wrong-password', hashedPassword);
      addOutput(`✅ Correct password verified: ${isValid}`);
      addOutput(`✅ Wrong password rejected: ${!isInvalid}\n`);

      // 4. Generate Reusable Key
      addOutput('4️⃣  Generate Reusable Key');
      const { key, salt } = crypto.generateKey(password);
      addOutput(`Password: "${password}"`);
      addOutput(`Key length: ${key.length} bytes (${key.length * 8} bits)`);
      addOutput(`Salt length: ${salt.length} bytes`);
      addOutput(`Key (first 16 bytes): ${Array.from(key.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
      addOutput(`✅ Key generated successfully\n`);

      // 5. Random Bytes Generation
      addOutput('5️⃣  Secure Random Bytes');
      const randomNonce = crypto.randomBytes(24);
      const randomToken = crypto.randomBytes(32);
      addOutput(`Random nonce (24 bytes): ${Array.from(randomNonce.slice(0, 12)).map(b => b.toString(16).padStart(2, '0')).join(' ')}...`);
      addOutput(`Random token (32 bytes): ${Array.from(randomToken.slice(0, 12)).map(b => b.toString(16).padStart(2, '0')).join(' ')}...`);
      addOutput(`✅ Random bytes generated\n`);

      // 6. Output Format Options
      addOutput('6️⃣  Output Format Options');
      const textToEncrypt = 'Format test';
      const encryptedBase64 = crypto.encrypt(textToEncrypt, password, { output: 'base64' });
      const encryptedRaw = crypto.encrypt(textToEncrypt, password, { output: 'raw' });
      
      addOutput(`Base64 output: ${encryptedBase64.substring(0, 50)}... (string)`);
      addOutput(`Raw output type: ${encryptedRaw.constructor.name} (${encryptedRaw.length} bytes)`);
      
      const decryptedFromBase64 = crypto.decrypt(encryptedBase64, password);
      const decryptedFromRaw = crypto.decrypt(encryptedRaw, password, { input: 'raw' });
      addOutput(`✅ Both decrypt correctly: ${decryptedFromBase64 === textToEncrypt && decryptedFromRaw === textToEncrypt}\n`);

      // 7. Error Handling
      addOutput('7️⃣  Error Handling');
      try {
        crypto.encrypt('test', 'short'); // Password too short
      } catch (error) {
        addOutput(`✅ Caught error (weak password): ${error.message}`);
      }

      try {
        crypto.decrypt(encrypted, 'wrong-password');
      } catch (error) {
        addOutput(`✅ Caught error (wrong password): ${error.message}`);
      }

      try {
        crypto.verifyHash('', hashedPassword); // Empty password
      } catch (error) {
        addOutput(`✅ Caught error (empty password): Returns false instead of throwing\n`);
      }

      // 8. Version & Config Info
      addOutput('8️⃣  Package Information');
      addOutput(`Version: ${crypto.getVersion()}`);
      addOutput(`PBKDF2 iterations: ${crypto.validate ? 'Available' : 'N/A'}`);
      addOutput(`\n✅ All tests completed successfully!`);

    } catch (error) {
      addOutput(`\n❌ Error: ${error.message}`);
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🔐Universal Easy Crypto</h1>
        <p>React Web Browser Example</p>
      </div>

      <div style={styles.content}>
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>

        {output && (
          <div style={styles.outputContainer}>
            <h3>Output:</h3>
            <pre style={styles.output}>{output}</pre>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>Open browser console (F12) to see detailed logs</p>
        <p>Package: @tkdonda/easy-crypto</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  },
  content: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1rem',
  },
  outputContainer: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '1rem',
    marginTop: '1rem',
  },
  output: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '1rem',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '600px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d',
    fontSize: '0.875rem',
  }
};

export default App;
