'use strict';

var error = require('../helpers/error');

var removeSpaces = function (str) {
  return str.replace(/ /g, '');
};

var argsDefinition = function (str) {
  return removeSpaces(str.split(/[()]/)[1]);
};

var args = function (fn) {
  if (!fn) { throw error('missing mandatory function'); }

  if (typeof fn !== 'function') {
    throw error('invalid argument type');
  }

  var argsStr = argsDefinition(fn.toString());
  if (!argsStr.length) { return []; }
  return argsStr.split(',');
};

module.exports = args;
