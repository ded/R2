if (typeof module !== 'undefined' && module.exports) {
  var sinktest = require('../src/sink')
    , sink = sinktest.sink
    , start = sinktest.start
}

sink('first pass', function (test, ok, before, after) {

  before(function () {
    console.log('BEFORE')
  })

  after(function () {
    console.log('AFTER')
  })

  test('should pass a test thing or two', 2, function () {
    ok(true, 'first thing')
    ok(true, 'second thing')
  })

  test('should pass even another set of tests a test', 3, function () {
    ok(1, 'third thing')
    ok(1, 'fourth thing')
    ok(1, 'fifth thing')
  })

})

sink('secondary set', function (t, k, b, a) {

  b(function () {
    console.log('secondary before')
  })

  a(function () {
    console.log('secondary after')
  })

  t('many talented people cannot count to three', 3, function () {
    k(1, 'one')
    k(2, 'two')
    k(3, 'three')
  })

})

//logkey is a server feature only
if (typeof module !== 'undefined' && module.exports) {

  sink('log key', function (test, ok, before, after) {

    test('should set a log key, effectively swallowing all logs not from sink', 1, function () {
      var log = console.log
        , count = 0
      console.log = function () {
        count++
      }
      sinktest.setLogKey('@fat::')
      console.log('1')
      console.log('2')
      console.log('3')
      console.log('@fat::huzzah')
      console.log('4')
      console.log('5')
      console.log = log
      sinktest.setLogKey('')
      ok(count == 1, 'only logs prefixe with log key make it to console')
    })

  })
}

sink('async complete() callback style', function (test, ok, before, after, assert) {
  test('should not need count', function (complete) {
    ok(typeof complete == 'function', 'test function argument is a callback')
    complete()
  })

  test('should not allow assert/ok-less test (SHOULD FAIL)', function (complete) {
    complete()
  })

  test('should work async (3 checks)', function (complete) {
    setTimeout(function () {
      ok(true, 'ok() at 500ms delay')
      ok(true, 'nothing to see here')
      assert(true, true, 'meaningless assert')
      complete()
    }, 500)
  })
})

sink('asserts', function (test, ok, before, after, assert) {

  test('should be able to assert stuff (SOULD FAIL)', 1, function () {
    assert(1, 6, 'should have same numbers')
  })

  test('should be able to assert stuff. this shows pass', 1, function () {
    assert(2, 2, 'should have same numbers')
  })

  var exports = {}
  assert.throws = function(fn) {
    assert.__negateNext = true
    return fn()
  }

// the following is copied straight from the CommonJS Unit-Testing Assertions module:
// https://github.com/commonjs/commonjs/blob/master/tests/unit-testing/1.0/program.js
// (commit) https://github.com/commonjs/commonjs/commit/8203f29d858d4d2adbd2bb911949fac7459ac264
/*************** START COMMONJS STUFF ********************/

// From Node.js test/mjsunit/test-assert.js
// Felix Geisendörfer (felixge), backported from NodeJS
// Karl Guertin (greyrest), backported from NodeJS
// Kris Kowal (kriskowal), conversion to CommonJS

// strangely meta, no?

function makeBlock(f) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function () {
      return f.apply(this, args)
    }
}

/* @rvagg: not supported
exports['test AssertionError instanceof Error'] = function () {
    assert.ok(new assert.AssertionError({}) instanceof Error);
};
*/

exports['test ok false'] = function () {
  assert['throws'](makeBlock(assert.ok, false), assert.AssertionError)
}

exports['test ok(true)'] = makeBlock(assert.ok, true)
exports['test ok("test")'] = makeBlock(assert.ok, "test")
exports['test equal true false'] = function () {
  assert['throws'](makeBlock(assert.equal, true, false), assert.AssertionError, 'equal')
}

exports['test equal null null'] = makeBlock(assert.equal, null, null)
exports['test equal undefined undefined'] = makeBlock(assert.equal, undefined, undefined)
exports['test equal null undefined'] = makeBlock(assert.equal, null, undefined)
exports['test equal 2 "2"'] = makeBlock(assert.equal, 2, "2")
exports['test equal "2" 2'] = makeBlock(assert.equal, "2", 2)
exports['test equal true true'] = makeBlock(assert.equal, true, true)
exports['test notEqual true false'] = makeBlock(assert.notEqual, true, false)
exports['test notEqual true true'] = function () {
  assert['throws'](makeBlock(assert.notEqual, true, true), assert.AssertionError, 'notEqual')
}
exports['test strictEqual 2 "2"'] = function () {
  assert['throws'](makeBlock(assert.strictEqual, 2, "2"), assert.AssertionError, 'strictEqual')
}
exports['test strictEqual null undefined'] = function () {
  assert['throws'](makeBlock(assert.strictEqual, null, undefined), assert.AssertionError, 'strictEqual')
}
exports['test notStrictEqual 2 "2"'] = makeBlock(assert.notStrictEqual, 2, "2")

//deepEquals

//7.2
exports['test 7.2 deepEqual date'] = makeBlock(assert.deepEqual, new Date(2000, 3, 14), new Date(2000, 3, 14))
exports['test 7.2 deepEqual date negative'] = function () {
  assert['throws'](makeBlock(assert.deepEqual, new Date(), new Date(2000,3,14)), assert.AssertionError, 'deepEqual date')
}

//7.3
exports['test 7.3 deepEqual 4 "4"'] = makeBlock(assert.deepEqual, 4, "4")
exports['test 7.3 deepEqual "4" 4'] = makeBlock(assert.deepEqual, "4", 4)
exports['test 7.3 deepEqual true 1'] = makeBlock(assert.deepEqual, true, 1)
exports['test 7.3 deepEqual 4 "5"'] = function () {
  assert['throws'](makeBlock(assert.deepEqual, 4, "5"))
}

//7.4
// having the same number of owned properties && the same set of keys
exports['test 7.4 deepEqual {a:4} {a:4}'] = makeBlock(assert.deepEqual, {a:4}, {a:4})
exports['test 7.4 deepEqual {a:4,b:"2"} {a:4,b:"2"}'] = makeBlock(assert.deepEqual, {a:4,b:"2"}, {a:4,b:"2"})
exports['test 7.4 deepEqual [4] ["4"]'] = makeBlock(assert.deepEqual, [4], ["4"])
exports['test 7.4 deepEqual {a:4} {a:4,b:true}'] = function () {
  assert['throws'](makeBlock(assert.deepEqual, {a:4}, {a:4,b:true}), assert.AssertionError)
}

exports['test deepEqual ["a"], {0:"a"}'] = makeBlock(assert.deepEqual, ["a"], {0:"a"})
// (although not necessarily the same order),
exports['test deepEqual {a:4,b:"1"} {b:"1",a:4}'] = makeBlock(assert.deepEqual, {a:4,b:"1"}, {b:"1",a:4})

exports['test deepEqual arrays with non-numeric properties'] = function () {
  var a1 = [1, 2, 3]
    , a2 = [1, 2, 3]
  a1.a = "test";
  a1.b = true;
  a2.b = true;
  a2.a = "test"
  // @rvagg Object.keys() not universal: assert['throws'](makeBlock(assert.deepEqual, Object.keys(a1), Object.keys(a2)), assert.AssertionError);
  makeBlock(assert.deepEqual, a1, a2)()
}

exports['test deepEqual identical prototype'] = function () {
    // having an identical prototype property
    var nbRoot = {
      toString: function(){return this.first+' '+this.last;}
    }
    var nameBuilder = function (first, last) {
      this.first = first
      this.last = last
      return this
    }
    nameBuilder.prototype = nbRoot
    var nameBuilder2 = function (first, last) {
      this.first = first
      this.last = last
      return this
    }
    nameBuilder2.prototype = nbRoot
    var nb1 = new nameBuilder('Ryan', 'Dahl')
      , nb2 = new nameBuilder2('Ryan', 'Dahl')

    assert.deepEqual(nb1, nb2)

    /* @rvagg: IMO this is garbage and conflicts with the '["a"], {0:"a"}' test above
    nameBuilder2.prototype = Object;
    nb2 = new nameBuilder2('Ryan','Dahl');
    assert['throws'](makeBlock(assert.deepEqual, nb1, nb2), assert.AssertionError);
    */
};

exports['test deepEqual "a" {}'] = function () {
  assert['throws'](makeBlock(assert.deepEqual, 'a', {}), assert.AssertionError)
}

exports['test deepEqual "" ""'] = function () {
  assert.deepEqual("", "")
}

exports['test deepEqual "" [""]'] = function () {
  assert['throws'](makeBlock(assert.deepEqual, '', ['']), assert.AssertionError)
}

exports['test deepEqual [""] [""]'] = function () {
  assert.deepEqual([""], [""])
}

/* @rvagg: not supported
exports['test throw AssertionError'] = function () {

    //Testing the throwing
    function thrower(errorConstructor){
        throw new errorConstructor('test');
    }
    var aethrow = makeBlock(thrower, assert.AssertionError);
    var aethrow = makeBlock(thrower, assert.AssertionError);
    //the basic calls work
    assert['throws'](makeBlock(thrower, assert.AssertionError), assert.AssertionError, 'message');
    assert['throws'](makeBlock(thrower, assert.AssertionError), assert.AssertionError);
    assert['throws'](makeBlock(thrower, assert.AssertionError));
    //if not passing an error, catch all.
    assert['throws'](makeBlock(thrower, TypeError));
    //when passing a type, only catch errors of the appropriate type
    var threw = false;
    try {
        assert['throws'](makeBlock(thrower, TypeError), assert.AssertionError);
    } catch (e) {
        threw = true;
        assert.ok(e instanceof TypeError, 'type');
    }
    assert.ok(threw, 'assert.throws with an explicit error is eating extra errors', assert.AssertionError);
    threw = false;

};
*/

/*************** END COMMONJS STUFF ********************/

  var t, c
  for (t in exports) {
    if (exports.hasOwnProperty(t)) {
      test('CommonJS Unit Testing/1.0: ' + t.replace(/^test /, ''), 1, exports[t])
    }
  }

  // additional custom assert types

  test('assert.typeOf()', 6, function () {
    assert.typeOf('a string', 'string', 'should be a string')
    assert.__negateNext = true
    assert.typeOf('a string', 'object', 'should not be an object')
    assert.typeOf({one:1}, 'object', 'should be an array')
    assert.typeOf(100, 'number', 'should be a number')
    assert.__negateNext = true
    assert.typeOf(100, 'string', 'should not be a string')
    assert.typeOf(1.1, 'number', 'should be a number')
  })

  test('assert.notTypeOf()', 6, function () {
    assert.__negateNext = true
    assert.notTypeOf('a string', 'string', 'should be a string')
    assert.notTypeOf('a string', 'object', 'should not be an object')
    assert.__negateNext = true
    assert.notTypeOf({one:1}, 'object', 'should be an array')
    assert.__negateNext = true
    assert.notTypeOf(100, 'number', 'should be a number')
    assert.notTypeOf(100, 'string', 'should not be a string')
    assert.__negateNext = true
    assert.notTypeOf(1.1, 'number', 'should be a number')
  })

  test('assert.isDefined()', 6, function () {
    assert.isDefined('', 'should be defined')
    assert.isDefined(1, 'should be defined')
    assert.isDefined({}, 'should be defined')
    assert.isDefined([], 'should be defined')
    assert.isDefined(null, 'should be defined')
    assert.__negateNext = true
    assert.isDefined(undefined, 'should not be defined')
  })

  test('assert.isUndefined()', 6, function () {
    assert.__negateNext = true
    assert.isUndefined('', 'should not be undefined')
    assert.__negateNext = true
    assert.isUndefined(1, 'should not be undefined')
    assert.__negateNext = true
    assert.isUndefined({}, 'should not be undefined')
    assert.__negateNext = true
    assert.isUndefined([], 'should not be undefined')
    assert.__negateNext = true
    assert.isUndefined(null, 'should not be undefined')
    assert.isUndefined(undefined, 'should be undefined')
  })

  test('assert.isNull()', 6, function () {
    assert.__negateNext = true
    assert.isNull('', 'should not be null')
    assert.__negateNext = true
    assert.isNull(1, 'should not be null')
    assert.__negateNext = true
    assert.isNull({}, 'should not be null')
    assert.__negateNext = true
    assert.isNull([], 'should not be null')
    assert.isNull(null, 'should be null')
    assert.__negateNext = true
    assert.isNull(undefined, 'should not be null')
  })

  test('assert.isNotNull()', 6, function () {
    assert.isNotNull('', 'should not be null')
    assert.isNotNull(1, 'should not be null')
    assert.isNotNull({}, 'should not be null')
    assert.isNotNull([], 'should not be null')
    assert.__negateNext = true
    assert.isNotNull(null, 'should be null')
    assert.isNotNull(undefined, 'should not be null')
  })

  test('assert.isObject()', 6, function () {
    assert.isObject({}, 'should be an object')
    assert.isObject([], 'should be an object')
    assert.__negateNext = true
    assert.isObject(1, 'should not be an object')
    assert.__negateNext = true
    assert.isObject('a string', 'should not be an object')
    assert.__negateNext = true
    assert.isObject(null, 'should not be an object')
    assert.__negateNext = true
    assert.isObject(undefined, 'should not be an object')
  })

  test('assert.isFunction()', 8, function () {
    assert.isFunction(function() {}, 'should be a function')
    assert.isFunction(assert, 'should be a function')
    assert.__negateNext = true
    assert.isFunction({}, 'should not be a function')
    assert.__negateNext = true
    assert.isFunction([], 'should not be a function')
    assert.__negateNext = true
    assert.isFunction(1, 'should not be a function')
    assert.__negateNext = true
    assert.isFunction('a string', 'should not be a function')
    assert.__negateNext = true
    assert.isFunction(null, 'should not be a function')
    assert.__negateNext = true
    assert.isFunction(undefined, 'should not be a function')
  })

  test('assert.isTrue()', 10, function () {
    assert.isTrue(true, 'should be true')
    assert.__negateNext = true
    assert.isTrue(false, 'should not be true')
    assert.__negateNext = true
    assert.isTrue(null, 'should not be true')
    assert.__negateNext = true
    assert.isTrue(undefined, 'should not be true')
    assert.__negateNext = true
    assert.isTrue('', 'should not be true')
    assert.__negateNext = true
    assert.isTrue('a string', 'should not be true')
    assert.__negateNext = true
    assert.isTrue(1, 'should not be true')
    assert.__negateNext = true
    assert.isTrue(0, 'should not be true')
    assert.__negateNext = true
    assert.isTrue({}, 'should not be true')
    assert.__negateNext = true
    assert.isTrue([], 'should not be true')
  })

  test('assert.isFalse()', 10, function () {
    assert.isFalse(false, 'should be false')
    assert.__negateNext = true
    assert.isFalse(true, 'should not be false')
    assert.__negateNext = true
    assert.isFalse(null, 'should not be false')
    assert.__negateNext = true
    assert.isFalse(undefined, 'should not be false')
    assert.__negateNext = true
    assert.isFalse('', 'should not be false')
    assert.__negateNext = true
    assert.isFalse('a string', 'should not be false')
    assert.__negateNext = true
    assert.isFalse(1, 'should not be false')
    assert.__negateNext = true
    assert.isFalse(0, 'should not be false')
    assert.__negateNext = true
    assert.isFalse({}, 'should not be false')
    assert.__negateNext = true
    assert.isFalse([], 'should not be false')
  })

  test('assert.isString()', 10, function () {
    assert.isString('', 'should be a string')
    assert.isString('a string', 'should be a string')
    assert.__negateNext = true
    assert.isString(false, 'should not be a string')
    assert.__negateNext = true
    assert.isString(true, 'should not be a string')
    assert.__negateNext = true
    assert.isString(null, 'should not be a string')
    assert.__negateNext = true
    assert.isString(undefined, 'should not be a string')
    assert.__negateNext = true
    assert.isString(1, 'should not be a string')
    assert.__negateNext = true
    assert.isString(0, 'should not be a string')
    assert.__negateNext = true
    assert.isString({}, 'should not be a string')
    assert.__negateNext = true
    assert.isString([], 'should not be a string')
  })

  test('assert.isBoolean()', 10, function () {
    assert.isBoolean(false, 'should be a boolean')
    assert.isBoolean(true, 'should be a boolean')
    assert.__negateNext = true
    assert.isBoolean('', 'should be a boolean')
    assert.__negateNext = true
    assert.isBoolean('a boolean', 'should not be a string')
    assert.__negateNext = true
    assert.isBoolean(null, 'should not be a boolean')
    assert.__negateNext = true
    assert.isBoolean(undefined, 'should not be a boolean')
    assert.__negateNext = true
    assert.isBoolean(1, 'should not be a boolean')
    assert.__negateNext = true
    assert.isBoolean(0, 'should not be a boolean')
    assert.__negateNext = true
    assert.isBoolean({}, 'should not be a boolean')
    assert.__negateNext = true
    assert.isBoolean([], 'should not be a boolean')
  })

  test('assert.isNumber()', 12, function () {
    assert.isNumber(1, 'should be a number')
    assert.isNumber(0, 'should be a number')
    assert.isNumber(-1.1, 'should be a number')
    assert.isNumber(10000.1010101, 'should be a number')
    assert.__negateNext = true
    assert.isNumber('', 'should be a number')
    assert.__negateNext = true
    assert.isNumber('a number', 'should not be a string')
    assert.__negateNext = true
    assert.isNumber(false, 'should not be a number')
    assert.__negateNext = true
    assert.isNumber(true, 'should not be a number')
    assert.__negateNext = true
    assert.isNumber(null, 'should not be a number')
    assert.__negateNext = true
    assert.isNumber(undefined, 'should not be a number')
    assert.__negateNext = true
    assert.isNumber({}, 'should not be a number')
    assert.__negateNext = true
    assert.isNumber([], 'should not be a number')
  })

  test('assert.isArray()', 12, function () {
    assert.isArray([], 'should be an array')
    assert.isArray([1,2,3], 'should be an array')
    assert.isArray(new Array(), 'should be an array')
    assert.__negateNext = true
    assert.isArray('', 'should not be an array')
    assert.__negateNext = true
    assert.isArray('an array', 'should not be an array')
    assert.__negateNext = true
    assert.isArray(false, 'should not be an array')
    assert.__negateNext = true
    assert.isArray(true, 'should not be an array')
    assert.__negateNext = true
    assert.isArray(null, 'should not be an array')
    assert.__negateNext = true
    assert.isArray(undefined, 'should not be an array')
    assert.__negateNext = true
    assert.isArray(1, 'should not be an array')
    assert.__negateNext = true
    assert.isArray(0, 'should not be an array')
    assert.__negateNext = true
    assert.isArray({}, 'should not be an array')
  })

  test('single argument custom assert', 2, function () {
    assert.add('isHairy', function(actual) { return 'big hairy monster' === actual })
    assert.isHairy('big hairy monster', 'should be a big hairy monster')
    assert.__negateNext = true
    assert.isHairy('this is not a big hairy monster', 'should not be a big hairy monster')
  })

  test('dual argument custom assert', 2, function () {
    assert.add('matchesRegex', function(actual, expected) { return expected.test(actual) })
    assert.matchesRegex('does this match?', / this /, 'should match the regex')
    assert.__negateNext = true
    assert.matchesRegex('does this match?', / NO MATCH FOR YOU /, 'should not match the regex')
  })
})

sink('timeout tests (takes 20 seconds)', function (test, ok, before, after, assert) {

  before(function () {
    sink.timeout = false
  })

  test('should pass a test thing or two', 1, function () {
    setTimeout(function () {
      ok(true, 'timeout successfully nulled!')
    }, 20000)
  })

})

start()
