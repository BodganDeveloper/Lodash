#!/usr/bin/env node
;(function() {
  'use strict';

  /** The Node filesystem module */
  var fs = require('fs');

  /** Used to minify variables embedded in compiled strings */
  var compiledVars = [
    'accumulator',
    'args',
    'array',
    'arrayClass',
    'bind',
    'callback',
    'className',
    'collection',
    'concat',
    'ctor',
    'false',
    'funcClass',
    'hasOwnProperty',
    'identity',
    'index',
    'indexOf',
    'isArray',
    'isEmpty',
    'isFunc',
    'length',
    'object',
    'objectTypes',
    'noaccum',
    'prop',
    'property',
    'result',
    'skipProto',
    'slice',
    'source',
    'sourceIndex',
    'stringClass',
    'target',
    'thisArg',
    'toString',
    'true',
    'undefined',
    'value'
  ];

  /** Used to minify `compileIterator` option properties */
  var iteratorOptions = [
    'args',
    'array',
    'arrayBranch',
    'beforeLoop',
    'bottom',
    'exit',
    'firstArg',
    'hasExp',
    'hasDontEnumBug',
    'inLoop',
    'init',
    'iteratedObject',
    'loopExp',
    'object',
    'objectBranch',
    'shadowed',
    'top',
    'useHas'
  ];

  /** Used to minify variables and string values to a single character */
  var minNames = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /** Used protect the specified properties from getting minified */
  var propWhitelist = [
    '_',
    '_wrapped',
    'amd',
    'clearTimeout',
    'criteria',
    'escape',
    'evaluate',
    'interpolate',
    'isEqual',
    'isFinite',
    'opera',
    'setTimeout',
    'source',
    'templateSettings',
    'toArray',
    'value',
    'variable'
  ];

  /*--------------------------------------------------------------------------*/

  /**
   * Pre-process a given JavaScript `source`, preparing it for minification.
   *
   * @param {String} source The source to process.
   * @returns {String} Returns the processed source.
   */
  function preprocess(source) {
    // remove copyright to add later in post-compile.js
    source = source.replace(/\/\*![\s\S]+?\*\//, '');

    // correct JSDoc tags for Closure Compiler
    source = source.replace(/@(?:alias|category)\b[^\n]*/g, '');

    // add brackets to whitelisted properties so Closure Compiler won't mung them
    // http://code.google.com/closure/compiler/docs/api-tutorial3.html#export
    source = source.replace(RegExp('\\.(' + propWhitelist.join('|') + ')\\b', 'g'), "['$1']");

    // remove whitespace from string literals
    source = source.replace(/'(?:(?=(\\?))\1.)*?'/g, function(string) {
      return string.replace(/\[object |else if|function | in |return\s+[\w']|throw |typeof |use strict|var |'\\n'|\\\\n|\\n|\s+/g, function(match) {
        return match == false || match == '\\n' ? '' : match;
      });
    });

    // minify `_.sortBy` internal properties
    (function() {
      var properties = ['criteria', 'value'],
          snippet = (source.match(/( +)function sortBy\b[\s\S]+?\n\1}/) || [])[0],
          result = snippet;

      if (snippet) {
        // minify property strings
        properties.forEach(function(property, index) {
          result = result.replace(RegExp("'" + property + "'", 'g'), "'" + minNames[index] + "'");
        });
        // replace with modified snippet
        source = source.replace(snippet, result);
      }
    }());

    // minify all compilable snippets
    var snippets = source.match(
      RegExp([
        // match the `iterationTemplate`
        '( +)var iteratorTemplate\\b[\\s\\S]+?\\n\\1}',
        // match variables storing `createIterator` options
        '( +)var [a-zA-Z]+IteratorOptions\\b[\\s\\S]+?\\n\\2}',
        // match the the `createIterator` function
        '( +)function createIterator\\b[\\s\\S]+?\\n\\3}',
        // match methods created by `createIterator` calls
        'createIterator\\((?:{|[a-zA-Z]+)[\\s\\S]+?\\);\\n'
      ].join('|'), 'g')
    );

    // exit early if no compilable snippets
    if (!snippets) {
      return source;
    }

    snippets.forEach(function(snippet, index) {
      var isCreateIterator = /function createIterator\b/.test(snippet),
          isIteratorTemplate = /var iteratorTemplate\b/.test(snippet),
          result = snippet;

      if (isIteratorTemplate) {
        // minify delimiters
        result = result
          .replace(/<%=/g, '#')
          .replace(/<%/g, '@')
          .replace(/%>/g, '%');

        // minify delimiter regexps
        result = result
          .replace(/('evaluate':)[^,}]+/, '$1/@([^%]+)%/g')
          .replace(/('interpolate':)[^,}]+/, '$1/#([^%]+)%/g');
      }
      else {
        // add brackets to whitelisted properties so Closure Compiler won't mung them
        result = result.replace(RegExp('\\.(' + iteratorOptions.join('|') + ')\\b', 'g'), "['$1']");
      }

      if (isCreateIterator) {
        // add `true` and `false` arguments to be minified
        result = result
          .replace(/(Function\(\s*'[\s\S]+?)undefined/, '$1true,false,undefined')
          .replace(/factory\([^)]+/, '$&,true,false');

        // replace with modified snippet early and clip snippet so other arguments
        // aren't minified
        source = source.replace(snippet, result);
        snippet = result = result.replace(/factory\([\s\S]+$/, '');
      }

      // minify snippet variables / arguments
      compiledVars.forEach(function(variable, index) {
        // ensure properties in compiled strings are minified
        result = result.replace(RegExp('([^.]\\b|\\\\n)' + variable + '\\b(?!\' *[\\]:])', 'g'), '$1' + minNames[index]);

        // correct `typeof x == 'object'`
        if (variable == 'object') {
          result = result.replace(RegExp("(typeof [^']+')" + minNames[index] + "'", 'g'), "$1object'");
        }
        // correct external boolean literals
        if (variable == 'true' || variable == 'false') {
          result = result
            .replace(RegExp(': *' + minNames[index] + ',', 'g'), ':' + variable + ',')
            .replace(RegExp('\\b' + minNames[index] + ';', 'g'), variable + ';');
        }
      });

      // minify `createIterator` option property names
      iteratorOptions.forEach(function(property, index) {
        if (isIteratorTemplate) {
          // minify property names and accessors
          result = result.replace(RegExp('\\b' + property + '\\b', 'g'), minNames[index]);
        }
        else {
          if (property == 'array' || property == 'object') {
            // minify "array" and "object" sub property names
            result = result.replace(RegExp("'" + property + "'( *[\\]:])", 'g'), "'" + minNames[index] + "'$1");
          }
          else {
            // minify property name strings
            result = result.replace(RegExp("'" + property + "'", 'g'), "'" + minNames[index] + "'");
            // minify property names in regexps and accessors
            if (isCreateIterator) {
              result = result.replace(RegExp('([\\.|/])' + property + '\\b' , 'g'), '$1' + minNames[index]);
            }
          }
        }
      });

      // replace with modified snippet
      source = source.replace(snippet, result);
    });

    return source;
  }

  /*--------------------------------------------------------------------------*/

  // expose `preprocess`
  if (module != require.main) {
    module.exports = preprocess;
  }
  else {
    // read the JavaScript source file from the first argument if the script
    // was invoked directly (e.g. `node pre-compile.js source.js`) and write to
    // the same file
    (function() {
      var source = fs.readFileSync(process.argv[2], 'utf8');
      fs.writeFileSync(process.argv[2], preprocess(source), 'utf8');
    }());
  }
}());
