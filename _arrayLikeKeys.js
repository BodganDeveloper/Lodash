import baseTimes from './_baseTimes.js';
import isArguments from './isArguments.js';
import isBuffer from './isBuffer.js';
import isIndex from './_isIndex.js';
import isTypedArray from './isTypedArray.js';

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  const isArr = Array.isArray(value);
  const isArg = !isArr && isArguments(value);
  const isBuff = !isArr && !isArg && isBuffer(value);
  const isType = !isArr && !isArg && !isBuff && isTypedArray(value);
  const skipIndexes = isArr || isArg || isBuff || isType;
  const result = skipIndexes ? baseTimes(value.length, String) : [];
  const length = result.length;

  for (const key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           (key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) || // Skip index properties.
           isIndex(key, length))
        ))) {
      result.push(key);
    }
  }
  return result;
}

export default arrayLikeKeys;
