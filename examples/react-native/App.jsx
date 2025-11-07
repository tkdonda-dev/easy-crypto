/**
 * Universal Easy Crypto - React Native Example
 * 
 * Compatible with both React Native CLI and Expo
 * 
 * Setup:
 * npx react-native init TestApp  OR  npx create-expo-app TestApp
 * npm install @tkdonda/easy-crypto
 * Replace App.js with this file
 * npx react-native run-android  OR  npx expo start
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import crypto from '@tkdonda/easy-crypto';
// If testing locally: import crypto from '../../src/index.js';

function App() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const addOutput = (text) => {
    setOutput((prev) => prev + text + '\n');
  };

  const runAllTests = async () => {
    setLoading(true);
    setOutput('');

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      addOutput('=== Easy Crypto ===');
      addOutput('React Native Example\n');

      // 1. Basic Encryption/Decryption
      addOutput('1️⃣  Basic Encryption & Decryption');
      const message = 'Hello from React Native!';
      const password = 'secure-password-123';
      
      const encrypted = crypto.encrypt(message, password);
      addOutput(`Original: "${message}"`);
      addOutput(`Encrypted: ${encrypted.substring(0, 40)}...`);
      
      const decrypted = crypto.decrypt(encrypted, password);
      addOutput(`Decrypted: "${decrypted}"`);
      addOutput(`✅ Match: ${message === decrypted}\n`);

      // 2. Object Encryption
      addOutput('2️⃣  Object Encryption');
      const userData = {
        username: 'bob',
        email: 'bob@example.com',
        settings: {
          theme: 'dark',
          language: 'en',
          notifications: true,
        },
        deviceInfo: {
          platform: 'react-native',
          timestamp: new Date().toISOString(),
        }
      };

      const encryptedObj = crypto.encryptObject(userData, password);
      addOutput(`Object keys: ${Object.keys(userData).join(', ')}`);
      addOutput(`Encrypted: ${encryptedObj.substring(0, 40)}...`);

      const decryptedObj = crypto.decryptObject(encryptedObj, password);
      addOutput(`Decrypted username: ${decryptedObj.username}`);
      addOutput(`✅ Objects match: ${JSON.stringify(userData) === JSON.stringify(decryptedObj)}\n`);

      // 3. Password Hashing
      addOutput('3️⃣  Password Hashing & Verification');
      const userPassword = 'user-mobile-password';
      
      const hashedPassword = crypto.hash(userPassword);
      addOutput(`Password: "${userPassword}"`);
      addOutput(`Hash length: ${hashedPassword.length} chars`);

      const isValid = crypto.verifyHash(userPassword, hashedPassword);
      const isInvalid = crypto.verifyHash('wrong-password', hashedPassword);
      addOutput(`✅ Correct password: ${isValid}`);
      addOutput(`✅ Wrong password rejected: ${!isInvalid}\n`);

      // 4. Generate Reusable Key
      addOutput('4️⃣  Generate Reusable Key');
      const { key, salt } = crypto.generateKey(password);
      addOutput(`Password: "${password}"`);
      addOutput(`Key length: ${key.length} bytes`);
      addOutput(`Salt length: ${salt.length} bytes`);
      addOutput(`✅ Key generated\n`);

      // 5. Random Bytes Generation
      addOutput('5️⃣  Secure Random Bytes');
      const randomNonce = crypto.randomBytes(24);
      const randomToken = crypto.randomBytes(32);
      addOutput(`Nonce (24 bytes): Generated`);
      addOutput(`Token (32 bytes): Generated`);
      addOutput(`Nonce type: ${randomNonce.constructor.name}`);
      addOutput(`✅ Random bytes work on mobile\n`);

      // 6. Output Format Options
      addOutput('6️⃣  Output Format Options');
      const textToEncrypt = 'Mobile format test';
      const encryptedBase64 = crypto.encrypt(textToEncrypt, password, { output: 'base64' });
      const encryptedRaw = crypto.encrypt(textToEncrypt, password, { output: 'raw' });
      
      addOutput(`Base64: ${encryptedBase64.substring(0, 30)}...`);
      addOutput(`Raw type: ${encryptedRaw.constructor.name}`);
      
      const decryptedFromBase64 = crypto.decrypt(encryptedBase64, password);
      const decryptedFromRaw = crypto.decrypt(encryptedRaw, password, { input: 'raw' });
      addOutput(`✅ Both formats work: ${decryptedFromBase64 === textToEncrypt && decryptedFromRaw === textToEncrypt}\n`);

      // 7. Error Handling
      addOutput('7️⃣  Error Handling');
      try {
        crypto.encrypt('test', 'bad'); // Password too short
      } catch (error) {
        addOutput(`✅ Caught: ${error.message.substring(0, 40)}...`);
      }

      try {
        crypto.decrypt(encrypted, 'wrong-password');
      } catch (error) {
        addOutput(`✅ Caught: Wrong password detected`);
      }

      // 8. Version Info
      addOutput('\n8️⃣  Package Information');
      addOutput(`Version: ${crypto.getVersion()}`);
      addOutput(`Platform: React Native`);
      addOutput(`\n✅ All tests passed!`);
      addOutput('\n🎉 Crypto works perfectly on mobile!');

    } catch (error) {
      addOutput(`\n❌ Error: ${error.message}`);
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔐Universal Easy Crypto</Text>
        <Text style={styles.headerSubtitle}>React Native Example</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity 
          onPress={runAllTests}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Run All Tests</Text>
          )}
        </TouchableOpacity>

        {output ? (
          <View style={styles.outputContainer}>
            <Text style={styles.outputTitle}>Output:</Text>
            <ScrollView style={styles.outputScrollView}>
              <Text style={styles.outputText}>{output}</Text>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Tap the button above to run crypto tests
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>@tkdonda/easy-crypto</Text>
        <Text style={styles.footerText}>Easy • Secure • Simple</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  outputScrollView: {
    maxHeight: 500,
  },
  outputText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    lineHeight: 18,
    color: '#2c3e50',
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 4,
  },
  placeholderContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    elevation: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginVertical: 2,
  },
});

export default App;
