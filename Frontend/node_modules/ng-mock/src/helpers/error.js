'use strict';

var error = function () {
  var msg = [].join.call(arguments, ' ');
  return new Error(msg);
};

module.exports = error;
