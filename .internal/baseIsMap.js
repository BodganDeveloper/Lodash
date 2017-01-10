import getTag from './.internal/getTag.js';
import isObjectLike from './isObjectLike.js';

/** `Object#toString` result references. */
const mapTag = '[object Map]';

/**
 * The base implementation of `isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

export default baseIsMap;
