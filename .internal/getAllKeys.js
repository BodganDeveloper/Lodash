import getSymbols from './getSymbols.js'
import keys from '../keys.js'

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  const result = keys(object)
  return Array.isArray(object) ? result : arrayPush(result, getSymbols(object))
}

export default getAllKeys
