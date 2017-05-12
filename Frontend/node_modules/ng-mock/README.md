ng-mock
=======

Angular unit testing made easy

[![Build Status](https://travis-ci.org/pfraces/ng-mock.svg?branch=master)](https://travis-ci.org/pfraces/ng-mock)
[![Test Coverage](https://codeclimate.com/github/pfraces/ng-mock/badges/coverage.svg)](https://codeclimate.com/github/pfraces/ng-mock/coverage)
[![Code Climate](https://codeclimate.com/github/pfraces/ng-mock/badges/gpa.svg)](https://codeclimate.com/github/pfraces/ng-mock)
[![Dependency Status](https://gemnasium.com/badges/github.com/pfraces/ng-mock.svg)](https://gemnasium.com/github.com/pfraces/ng-mock)

### Featuring

  * run unit tests under nodejs
  * no DOM mocks required
  * angular.js not needed

Usage
-----

Suppose you have a `log` service like the following you want to test

**log.js**

```js
angular.module('log', [])

.factory('logCache', function () {
  return [];
})

.factory('log', function (logCache) {
  var log = function (msg) {
    logCache.push(msg);
  };

  return log;
});
```

Let's write our unit tests using `ng-mock`

_([mocha][2] and [expect.js][3] used in the example)_

**log.spec.js**

Load `ng-mock` and the module to be tested

**`ng-mock` should be loaded first since it exposes the `angular` global
used by the tested module**

```js
var ngMock = require('ng-mock');
require('log.js');
```

The tests ...

```js
describe('log', function () {
  var logModule = ngMock.module('log');

  it('should expose a log service', function () {
    expect(logModule.factory('log')).to.be.a('function');
  });

  describe('log', function () {
    var cache = [];
    var log = logModule.factory('log')(cache);

    it('should be a function', function () {
      expect(log).to.be.a('function');
    });

    it('should add messages', function () {
      var msg = 'foo';
      log(msg);
      expect(cache[0]).to.be(msg);
    });
  });
});
```

### How does it work?

**ng-mock** mocks angular's module system so your scripts can use the mocked
version to register its factories and directives and your unit tests can load
them the same way **since all methods provided by `module` are getter/setters**

### Use the DI helper for seamless mock injection

Angular lets you declare providers dependencies in 3 different ways:

_from: [angular DI](https://docs.angularjs.org/guide/di)_

  * Using the inline array annotation
  * Using the $inject property annotation
  * Implicitly from the function parameter names

```js
var module = angular.module('foo', []);

// inline array annotation
module.factory('bar', ['qux', function (qux) { ... }]);

// $inject property annotation
var bar = function (qux) { ... };
bar.$inject = ['qux'];
module.factory('bar', bar);

// function parameter names
module.factory('bar', function (qux) { ... });
```

Also, the injection can be done using `$injector.get`

```js
angular.module('foo')
.factory('bar', function ($injector) {
  var qux = $injector.get('qux');
});
```

Which in turn can also be injected with the 3 annotation methods described above

```js
angular.module('foo')
.factory('bar', ['$injector', function ($injector) {
  var qux = $injector.get('qux');
}]);
```

Since **ng-mock**'s `module` implementation returns basically a collection of
getter/setters, having to deal with this assortment of annotation interfaces can
be cumbersome

**Ugly unit tests without using the DI helper**

```js
describe('bar', function () {
  // get the `bar` factory function
  var barFactory = ngMock.module('foo').factory('bar');

  // suppose we have used inline array annotation style:
  // the function to be tested is the last array item
  var bar = barFactory[barFactory.length - 1];

  // dependencies we want to mock
  var mocks = {
    qux: function quxMock () { ... }
  };

  // suppose we have used `$injector.get`:
  // we need to provide a mock for it

  var get = function (dependency) {
    return mocks[dependency];
  };

  var $injector = { get: get };
  var bar = barFactory($injector);

  // we are ready to write the unit tests
  it('should be a function', function () {
    expect(bar).to.be.a('function');
  });
});
```

**Shiny unit tests using the DI helper**

```js
describe('bar', function () {
  // get the bar factory function
  var barFactory = ngMock.module('foo').factory('bar');

  // `di` injects the dependencies for us
  var bar = ngMock.di(barFactory, {
    qux: function quxMock () { ... }
  });

  // we are ready to write the unit tests
  it('should be a function', function () {
    expect(bar).to.be.a('function');
  });
});
```

Install
-------

    npm install --save-dev ng-mock

API
---

### `reset()`

Resets the internal module registry

This is used in our unit test to start with a clean registry `beforeEach` test

### `module(name)`

Returns an [angular.Module][1]-compatible API

### `di(injectable, injections)`

DI helper

References
----------

  * [angular.Module API][1]

[1]: https://docs.angularjs.org/api/ng/type/angular.Module
[2]: https://mochajs.org/
[3]: https://github.com/Automattic/expect.js
