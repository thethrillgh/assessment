'use strict';

var args = require('./args');
var error = require('../helpers/error');
var isArray = Array.isArray;

var validTokens = function (fn, deps) {
  if (typeof fn !== 'function') {
    throw error('invalid injectable function');
  }

  if (!isArray(deps)) {
    throw error('invalid injectable dependecies');
  }

  return { fn: fn, deps: deps };
};

var inlineArrayParser = function (injectable) {
  var fn = injectable.pop();
  var deps = injectable;
  return validTokens(fn, deps);
};

var $injectParser = function (injectable) {
  var fn = injectable;
  var deps = fn.$inject;
  return validTokens(fn, deps);
};

var fnParamParser = function (injectable) {
  var fn = injectable;
  var deps = args(fn);
  return validTokens(fn, deps);
};

var parser = function (injectable) {
  if (isArray(injectable)) {
    return inlineArrayParser(injectable);
  }

  if (isArray(injectable.$inject)) {
    return $injectParser(injectable);
  }

  if (typeof injectable === 'function') {
    return fnParamParser(injectable);
  }

  throw error('unknown injectable type');
};

module.exports = parser;
