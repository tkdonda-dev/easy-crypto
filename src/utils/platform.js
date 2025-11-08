// Detect runtime platform
const isNode =
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node &&
  typeof window === 'undefined';

const isBrowser =
  typeof window !== 'undefined' &&
  !!window.crypto &&
  !!window.crypto.subtle;

const isReactNative =
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative';

module.exports = { isNode, isBrowser, isReactNative };
