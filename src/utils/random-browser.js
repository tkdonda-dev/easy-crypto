module.exports = function randomBytes(length) {
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  return arr;
};
