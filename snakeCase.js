import createCompounder from './.internal/createCompounder.js';

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @see upperCase, lowerCase, upperFirst, camelCase, kebabCase, startCase
 * @example
 *
 * snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
const snakeCase = createCompounder((result, word, index) =>
  result + (index ? '_' : '') + word.toLowerCase()
);

export default snakeCase;
