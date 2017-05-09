'use strict';

var expect = require('expect.js');
var registry = require('../src/registry');

describe('registry', function () {
  it('should expose an object', function () {
    expect(registry).to.be.an('object');
  });

  it('should expose a reset method', function () {
    expect(registry.reset).to.be.a('function');
  });

  it('should expose a module method', function () {
    expect(registry.module).to.be.a('function');
  });

  describe('reset', function () {
    it('should reset the internal registry', function () {
      var factory = registry.module('foo').factory;
      factory('bar', true);

      expect(factory).withArgs('bar').to.not.throwException();
      registry.reset();

      expect(factory).withArgs('bar').to.throwException(function (exception) {
        expect(exception.message).to.be('module foo is not available');
      });
    });
  });

  describe('module', function () {
    beforeEach(registry.reset);

    it('should require a name param', function () {
      expect(registry.module).to.throwException(function (exception) {
        expect(exception.message).to.be('missing mandatory module name');
      });

      expect(registry.module).withArgs('foo').to.not.throwException();
    });

    it('should return an object', function () {
      expect(registry.module('foo')).to.be.an('object');
    });

    /**
     * `angular.Module` api
     * <https://docs.angularjs.org/api/ng/type/angular.Module>
     */

    describe('`angular.Module` api', function () {
      it('should expose a `provider` method', function () {
        expect(registry.module('foo').provider).to.be.a('function');
      });

      it('should expose a `factory` method', function () {
        expect(registry.module('foo').factory).to.be.a('function');
      });

      it('should expose a `service` method', function () {
        expect(registry.module('foo').service).to.be.a('function');
      });

      it('should expose a `value` method', function () {
        expect(registry.module('foo').value).to.be.a('function');
      });

      it('should expose a `constant` method', function () {
        expect(registry.module('foo').constant).to.be.a('function');
      });

      it('should expose a `decorator` method', function () {
        expect(registry.module('foo').decorator).to.be.a('function');
      });

      it('should expose an `animation` method', function () {
        expect(registry.module('foo').animation).to.be.a('function');
      });

      it('should expose a `filter` method', function () {
        expect(registry.module('foo').filter).to.be.a('function');
      });

      it('should expose a `controller` method', function () {
        expect(registry.module('foo').controller).to.be.a('function');
      });

      it('should expose a `directive` method', function () {
        expect(registry.module('foo').directive).to.be.a('function');
      });

      it('should expose a `component` method', function () {
        expect(registry.module('foo').component).to.be.a('function');
      });

      it('should expose a `config` method', function () {
        expect(registry.module('foo').config).to.be.a('function');
      });

      it('should expose a `run` method', function () {
        expect(registry.module('foo').run).to.be.a('function');
      });

      it('should expose a `requires` empty array', function () {
        var module = registry.module('foo');
        expect(module.requires).to.be.an('array');
        expect(module.requires.length).to.be(0);
      });

      it('should expose a `name` string with the module name', function () {
        expect(registry.module('foo').name).to.be('foo');
      });

      describe('getter/setter methods', function () {
        it('should prevent collisions with each other', function () {
          var module = registry.module('foo');

          module
            .provider('bar', 'provider')
            .factory('bar', 'factory')
            .service('bar', 'service')
            .value('bar', 'value')
            .constant('bar', 'constant')
            .decorator('bar', 'decorator')
            .animation('bar', 'animation')
            .filter('bar', 'filter')
            .controller('bar', 'controller')
            .directive('bar', 'directive')
            .component('bar', 'component');

          expect(module.provider('bar')).to.be('provider');
          expect(module.factory('bar')).to.be('factory');
          expect(module.service('bar')).to.be('service');
          expect(module.value('bar')).to.be('value');
          expect(module.constant('bar')).to.be('constant');
          expect(module.decorator('bar')).to.be('decorator');
          expect(module.animation('bar')).to.be('animation');
          expect(module.filter('bar')).to.be('filter');
          expect(module.controller('bar')).to.be('controller');
          expect(module.directive('bar')).to.be('directive');
          expect(module.component('bar')).to.be('component');
        });

        /**
         * Since all methods from `registry.module` share the same
         * implementation, we can abstract the tests used with them
         */

        var testModuleMethod = function (name) {
          return function () {
            it('should require a name param', function () {
              var method = registry.module('foo')[name];
              method('bar', true);

              expect(method).to.throwException(function (exception) {
                expect(exception.message).to.be('missing mandatory ' + name + ' name');
              });

              expect(method).withArgs('bar').to.not.throwException();
            });

            it('should be a getter/setter', function () {
              var method = registry.module('foo')[name];
              method('bar', 'qux');
              expect(method('bar')).to.be('qux');
            });

            it('should require a set before a get', function () {
              var method = registry.module('foo')[name];

              expect(method).withArgs('bar')
              .to.throwException(function (exception) {
                expect(exception.message).to.be(name + ' not defined: bar');
              });

              method('bar', true);
              expect(method).withArgs('bar').to.not.throwException();
            });

            it('should prevent collisions with different names', function () {
              var method = registry.module('foo')[name];

              var num = 123;
              var str = 'abc';
              var fn = function () {};

              method('num', num);
              method('str', str);
              method('fn', fn);

              expect(method('num')).to.be(num);
              expect(method('str')).to.be(str);
              expect(method('fn')).to.be(fn);
            });

            it('should prevent collisions across modules', function () {
              var foo = registry.module('foo');
              var bar = registry.module('bar');

              foo[name]('qux', foo);
              bar[name]('qux', bar);

              expect(foo[name]('qux')).not.to.be(bar[name]('qux'));
              expect(foo[name]('qux')).to.be(foo);
              expect(bar[name]('qux')).to.be(bar);
            });

            it('should be chainable when used as a setter', function () {
              var module = registry.module('foo');
              expect(module[name]('bar', true)).to.be(module);
            });
          };
        };

        describe('provider', testModuleMethod('provider'));
        describe('factory', testModuleMethod('factory'));
        describe('service', testModuleMethod('service'));
        describe('value', testModuleMethod('value'));
        describe('constant', testModuleMethod('constant'));
        describe('decorator', testModuleMethod('decorator'));
        describe('animation', testModuleMethod('animation'));
        describe('filter', testModuleMethod('filter'));
        describe('controller', testModuleMethod('controller'));
        describe('directive', testModuleMethod('directive'));
        describe('component', testModuleMethod('component'));
      });

      describe('config', function () {
        it('should be a chainable noop method', function () {
          var module = registry.module('foo');
          expect(module.config()).to.be(module);
          expect(module.config('bar', function () {})).to.be(module);
          expect(module.config('bar')).to.be(module);
        });
      });

      describe('run', function () {
        it('should be a chainable noop method', function () {
          var module = registry.module('foo');
          expect(module.run()).to.be(module);
          expect(module.run('bar', function () {})).to.be(module);
          expect(module.run('bar')).to.be(module);
        });
      });
    });
  });
});
