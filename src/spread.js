/**
 * Like function.prototype.apply, except with arguments flipped to allow more semantic syntax for some use cases.
 *
 * @param {*[]} args
 * @param {function(...*)} fn
 * @returns {*}
 */
export default (args, fn) => {
  const values = args || [];

  if (!Array.isArray(values)) {
    throw new TypeError('args must be an array.');
  }

  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function.');
  }

  return fn(...values);
};
