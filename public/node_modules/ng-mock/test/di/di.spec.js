'use strict';

var expect = require('expect.js');
var di = require('../../src/di/di');

describe('di', function () {
  it('should expose a function', function () {
    expect(di).to.be.a('function');
  });

  it('should require an injectable param', function () {
    expect(di).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory injectable');
    });

    expect(di).withArgs(function () {}).to.not.throwException();
  });

  it('should call the injectable and return its returning value', function () {
    var injectable = function () {
      return 'secret';
    };

    expect(di(injectable)).to.be('secret');
  });

  it('should require all dependencies to be provided', function () {
    var injectable = function (foo) {
      return foo;
    };

    expect(di).withArgs(injectable).to.throwException(function (exception) {
      expect(exception.message).to.be('missing dependency: foo');
    });

    expect(di).withArgs(injectable, { foo: true }).to.not.throwException();
  });

  it('should inject dependencies using fn param names', function () {
    var injections = {
      foo: 'foo',
      bar: 'bar',
      qux: 'qux'
    };

    var injectable = function (qux, foo, bar) {
      expect(qux).to.be(injections.qux);
      expect(foo).to.be(injections.foo);
      expect(bar).to.be(injections.bar);
    };

    di(injectable, injections);
  });

  it('should inject dependencies to inlined array injectables', function () {
    var injections = {
      foo: 'foo',
      bar: 'bar',
      qux: 'qux'
    };

    var injectable = ['qux', 'foo', 'bar', function (a, b, c) {
      expect(a).to.be(injections.qux);
      expect(b).to.be(injections.foo);
      expect(c).to.be(injections.bar);
    }];

    di(injectable, injections);
  });

  it('should inject dependencies using $inject property', function () {
    var injections = {
      foo: 'foo',
      bar: 'bar',
      qux: 'qux'
    };

    var injectable = function (a, b, c) {
      expect(a).to.be(injections.qux);
      expect(b).to.be(injections.foo);
      expect(c).to.be(injections.bar);
    };

    injectable.$inject = ['qux', 'foo', 'bar'];
    di(injectable, injections);
  });

  describe('$injector', function () {
    it('should be injected using fn param name', function () {
      var injectable = function ($injector) {
        return $injector;
      };

      var $injector = di(injectable);
      expect($injector).to.be.an('object');
    });

    it('should be injected into inlined array injectables', function () {
      var injectable = ['$injector', function (a) {
        return a;
      }];

      var $injector = di(injectable);
      expect($injector).to.be.an('object');
    });

    it('should be injected using $inject property', function () {
      var injectable = function (a) {
        return a;
      };

      injectable.$inject = ['$injector'];
      var $injector = di(injectable);
      expect($injector).to.be.an('object');
    });

    it('should expose a `get` method', function () {
      var injectable = function ($injector) {
        return $injector;
      };

      var $injector = di(injectable);
      expect($injector.get).to.be.a('function');
    });

    describe('get', function () {
      it('should require a name param', function () {
        var injectable = function ($injector) {
          return $injector.get;
        };

        var get = di(injectable);

        expect(get).to.throwException(function (exception) {
          expect(exception.message).to.be('missing mandatory dependency name');
        });
      });

      it('should require a matching dependency', function () {
        var injectable = function ($injector) {
          return $injector.get;
        };

        var get = di(injectable);

        expect(get).withArgs('foo').to.throwException(function (exception) {
          expect(exception.message).to.be('missing dependency: foo');
        });

        get = di(injectable, { foo: true });
        expect(get).withArgs('foo').to.not.throwException();
      });

      it('should return the mathing dependency', function () {
        var injectable = function ($injector) {
          return $injector.get('right');
        };

        var right = di(injectable, {
          wrong: function () { return 'wrong'; },
          right: function () { return 'right'; }
        });

        expect(right()).to.be('right');
      });
    });
  });
});
