'use strict';

var chain = require('./helpers/chain');
var error = require('./helpers/error');
var noop = function () {};

var registry = {};

var reset = function () {
  registry = {};
};

var getterSetter = function (module, category) {
  return function (key, value) {
    var entry = registry[module];
    if (!entry) { throw error('module', module, 'is not available'); }
    if (!key) { throw error('missing mandatory', category, 'name'); }

    if (!entry[category]) { entry[category] = {}; }
    var model = entry[category];

    if (typeof value !== 'undefined') {
      model[key] = value;
      return;
    }

    if (typeof model[key] === 'undefined') {
      throw error(category, 'not defined:', key);
    }

    return model[key];
  };
};

var moduleMock = function (name) {
  if (!name) { throw error('missing mandatory module name'); }
  if (!registry[name]) { registry[name] = {}; }

  return chain({
    provider: getterSetter(name, 'provider'),
    factory: getterSetter(name, 'factory'),
    service: getterSetter(name, 'service'),
    value: getterSetter(name, 'value'),
    constant: getterSetter(name, 'constant'),
    decorator: getterSetter(name, 'decorator'),
    animation: getterSetter(name, 'animation'),
    filter: getterSetter(name, 'filter'),
    controller: getterSetter(name, 'controller'),
    directive: getterSetter(name, 'directive'),
    component: getterSetter(name, 'component'),
    config: noop,
    run: noop,
    requires: [],
    name: name
  });
};

module.exports = {
  reset: reset,
  module: moduleMock
};
