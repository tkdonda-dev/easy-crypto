// Detect current runtime platform
const isNode =
  typeof process !== 'undefined' &&
  !!process.versions &&
  !!process.versions.node;

const isBrowser =
  typeof window !== 'undefined' &&
  typeof window.crypto !== 'undefined' &&
  typeof window.crypto.subtle !== 'undefined';

// Best-effort React Native detection
const isReactNative =
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative';

module.exports = { isNode, isBrowser, isReactNative };
