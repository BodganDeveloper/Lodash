import arrayEachRight from './_arrayEachRight.js';
import baseEachRight from './_baseEachRight.js';
import isArray from './isArray.js';

/**
 * This method is like `forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see forEach
 * @example
 *
 * forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */
function forEachRight(collection, iteratee) {
  const func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, iteratee);
}

export default forEachRight;
