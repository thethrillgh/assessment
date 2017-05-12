'use strict';

var expect = require('expect.js');
var error = require('../../src/helpers/error');

describe('error', function () {
  it('should expose a function', function () {
    expect(error).to.be.a('function');
  });

  it('should return a `new Error`', function () {
    expect(error()).to.be.an(Error);
  });

  it('should create an error with the provided message', function () {
    expect(error('foo').message).to.be('foo');
  });

  it('should join with spaces multiple arguments', function () {
    expect(error('foo', 'bar', 'qux').message).to.be('foo bar qux');
  });

  it('should create an empty message when called without args', function () {
    expect(error().message).to.be('');
  });
});
