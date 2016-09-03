/**
 * Flattens a 2d array.
 *
 * @param {[][]} array
 * @returns {[]}
 */
export const flatten = (array) => array.reduce((result, value) => result.concat(value), []);
