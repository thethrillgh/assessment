(function (expose) {
  'use strict';

  var registry = require('./registry.js');
  var di = require('./di/di');

  expose('angular', {
    reset: registry.reset,
    module: registry.module,
    di: di
  });
})(function expose (name, api) {
  module.exports = api;
  global[name] = api;
});
