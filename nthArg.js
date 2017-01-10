import baseNth from './.internal/baseNth.js';
import toInteger from './toInteger.js';

/**
 * Creates a function that gets the argument at index `n`. If `n` is negative,
 * the nth argument from the end is returned.
 *
 * @static
 * @since 4.0.0
 * @category Util
 * @param {number} [n=0] The index of the argument to return.
 * @returns {Function} Returns the new pass-thru function.
 * @example
 *
 * var func = nthArg(1);
 * func('a', 'b', 'c', 'd');
 * // => 'b'
 *
 * var func = nthArg(-2);
 * func('a', 'b', 'c', 'd');
 * // => 'c'
 */
function nthArg(n) {
  n = toInteger(n);
  return (...args) => baseNth(args, n);
}

export default nthArg;
