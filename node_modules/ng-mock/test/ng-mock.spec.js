'use strict';

var expect = require('expect.js');
var ngMock = require('../src/ng-mock');
var registry = require('../src/registry');
var di = require('../src/di/di');

describe('ngMock', function () {
  it('should be exposed as both node module and "angular" global', function () {
    expect(ngMock).to.be(global.angular);
  });

  it('should expose an object', function () {
    expect(ngMock).to.be.an('object');
  });

  it('should expose a reset method', function () {
    expect(ngMock.reset).to.be.a('function');
    expect(ngMock.reset).to.be(registry.reset);
  });

  it('should expose a module method', function () {
    expect(ngMock.module).to.be.a('function');
    expect(ngMock.module).to.be(registry.module);
  });

  it('should expose a di method', function () {
    expect(ngMock.di).to.be.a('function');
    expect(ngMock.di).to.be(di);
  });
});
