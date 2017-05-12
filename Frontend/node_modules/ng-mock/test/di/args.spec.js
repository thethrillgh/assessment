'use strict';

var expect = require('expect.js');
var args = require('../../src/di/args');
var noop = function () {};

describe('args', function () {
  it('should expose a function', function () {
    expect(args).to.be.a('function');
  });

  it('should require a function', function () {
    expect(args).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory function');
    });

    expect(args).withArgs(true).to.throwException(function (exception) {
      expect(exception.message).to.be('invalid argument type');
    });

    expect(args).withArgs(function () {}).to.not.throwException();
  });

  it('should return an array', function () {
    expect(args(function () {})).to.be.an('array');
  });

  it('should return an empty array with functions without params', function () {
    expect(args(function () {}).length).to.be(0);
  });

  it('should return a list with the function param names', function () {
    var fn = function (foo, bar, qux) {
      noop(qux); // prevent linter warning
    };

    expect(args(fn)).to.eql(['foo', 'bar', 'qux']);
  });
});
