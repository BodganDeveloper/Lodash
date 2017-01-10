import isSymbol from './isSymbol.js';

/**
 * The base implementation of methods like `max` and `min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  let result;
  let index = -1;
  const length = array.length;

  while (++index < length) {
    let computed;
    const value = array[index];
    const current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      computed = current;
      result = value;
    }
  }
  return result;
}

export default baseExtremum;
