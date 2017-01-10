import isArrayLike from './isArrayLike.js';
import keys from './keys.js';

/**
 * Creates a `find` or `findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return (collection, predicate, fromIndex) => {
    let iteratee;
    const iterable = Object(collection);
    if (!isArrayLike(collection)) {
      collection = keys(collection);
      predicate = key => iteratee(iterable[key], key, iterable);
    }
    const index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

export default createFind;
