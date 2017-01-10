import toString from './toString.js';

/** Used to generate unique IDs. */
let idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * uniqueId('contact_');
 * // => 'contact_104'
 *
 * uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  const id = ++idCounter;
  return toString(prefix) + id;
}

export default uniqueId;
