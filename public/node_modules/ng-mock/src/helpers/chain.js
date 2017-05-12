'use strict';

var iterateObject = function (object, fn) {
  var attr = '';
  for (attr in object) { fn(object[attr], attr); }
};

var chain = function (api) {
  var chained = {};

  iterateObject(api, function (prop, name) {
    chained[name] = typeof prop !== 'function' ? prop : function () {
      var value = prop.apply(null, arguments);
      if (typeof value !== 'undefined') { return value; }
      return chained;
    };
  });

  return chained;
};

module.exports = chain;
