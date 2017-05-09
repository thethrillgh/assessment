'use strict';

var expect = require('expect.js');
var parser = require('../../src/di/parser');

describe('parser', function () {
  it('should expose a function', function () {
    expect(parser).to.be.a('function');
  });

  it('should parse function param names', function () {
    var injectable = function (foo, bar) {
      expect(foo()).to.be('foo');
      expect(bar()).to.be('bar');
      return foo() + bar();
    };

    var parsed = parser(injectable);

    expect(parsed).to.be.an('object');
    expect(parsed.fn).to.be.a('function');
    expect(parsed.deps).to.be.an('array');

    var deps = parsed.deps.map(function (dep) {
      return function () { return dep; };
    });

    expect(parsed.fn.apply(null, deps)).to.be('foobar');
  });

  it('should parse inline arrays', function () {
    var injectable = ['foo', 'bar', function (a, b) {
      expect(a()).to.be('foo');
      expect(b()).to.be('bar');
      return a() + b();
    }];

    var parsed = parser(injectable);

    expect(parsed).to.be.an('object');
    expect(parsed.fn).to.be.a('function');
    expect(parsed.deps).to.be.an('array');

    var deps = parsed.deps.map(function (dep) {
      return function () { return dep; };
    });

    expect(parsed.fn.apply(null, deps)).to.be('foobar');
  });

  it('should parse $inject properties', function () {
    var injectable = function (a, b) {
      expect(a()).to.be('foo');
      expect(b()).to.be('bar');
      return a() + b();
    };

    injectable.$inject = ['foo', 'bar'];
    var parsed = parser(injectable);

    expect(parsed).to.be.an('object');
    expect(parsed.fn).to.be.a('function');
    expect(parsed.deps).to.be.an('array');

    var deps = parsed.deps.map(function (dep) {
      return function () { return dep; };
    });

    expect(parsed.fn.apply(null, deps)).to.be('foobar');
  });

  it('should require a valid injectable function', function () {
    expect(parser).withArgs([]).to.throwException(function (exception) {
      expect(exception.message).to.be('invalid injectable function');
    });
  });

  it('should require a valid injectable type', function () {
    expect(parser).withArgs(true).to.throwException(function (exception) {
      expect(exception.message).to.be('unknown injectable type');
    });
  });
});

