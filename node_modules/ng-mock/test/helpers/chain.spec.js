'use strict';

var expect = require('expect.js');
var chain = require('../../src/helpers/chain');

describe('chain', function () {
  it('should expose a function', function () {
    expect(chain).to.be.a('function');
  });

  it('should return an object', function () {
    expect(chain()).to.be.an('object');
  });

  it('should return a list of functions matching the ones provided', function () {
    var api = {
      foo: function () {},
      bar: function () {}
    };

    expect(chain(api).foo).to.be.a('function');
    expect(chain(api).foo).not.to.be(api.foo);

    expect(chain(api).bar).to.be.a('function');
    expect(chain(api).bar).not.to.be(api.bar);
  });

  it('should copy by reference non-function properties', function () {
    var api = {
      foo: true,
      bar: {},
      qux: function () {}
    };

    expect(chain(api).foo).to.be(api.foo);
    expect(chain(api).bar).to.be(api.bar);
    expect(chain(api).qux).not.to.be(api.qux);
  });

  describe('chained methods', function () {
    it('should return the value returned by the wrapped function', function () {
      var secret = 'secret';

      var api = {
        foo: function () { return secret; }
      };

      expect(chain(api).foo()).to.be(secret);
    });

    it('should replace `undefined` return values with the chain', function () {
      var api = {
        foo: function () {}
      };

      var chained = chain(api);
      expect(chained.foo()).to.be(chained);
    });
  });
});
