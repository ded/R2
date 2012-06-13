Sink Test
---------

An Asynchronous JavaScript Unit Testing Framework designed to run headless, or in the browser.

Sink test is used to test JavaScript that is run asynchronously whereby you can specify the number of expectations and Sink will tell you if they each pass successfully or call an optional `complete()` callback to indicate test completion.

How to write a Sink test
------------------------

``` js
test('should have foo', 2, function() {
  $.ajax('/foo', function(resp) {
    ok(resp.stat == '200')
    assert(resp.text, 'success', 'should have success')
  })
})

// alternatively:

test('should have foo', function(complete) {
  $.ajax('/foo', function(resp) {
    ok(resp.stat == '200')
    assert(resp.text, 'success', 'should have success')
    complete()
  })
})
```

Loading a suite of tests
------------------------

The above example illustrates the basic syntax of a single test, however loading your tests is done via the *sink* module which exports the test and ok methods. See the example below:

``` js
sink('my module', function(test, ok, before, after, assert) {
  before(function () {
    // run this before every test
  })

  after(function () {
    // run this after every test
  })

  test('should have foo', 2, function () {
    ok(true, 'this is basically true')
    ok(1 == 1, 'also true for you math majors')
  })
})

sink('another module', function (t, o, b, a) {
  test('a failure', 1, function () {
    ok(1 == 2, 'should fail')
  })
})

start() // start all test modules
```

Browser support
---------------

Any browser that supports JavaScript as well as Headless via command line with Node. (see below)

``` js
// tests.js
var sink = require('sink')
var start = sink.start
sink = sink.sink

sink('some module', function (test, ok) {
  // write tests
})

sink('another module', function (test, ok) {
  // write tests
})

start()
```

in your terminal

    $ node path/to/my/tests.js


Advanced assertion support
--------------------------

Sink Test follows most of the assert module specified in the [CommonJS Unit-Testing/1.0 assert module](http://wiki.commonjs.org/wiki/Unit_Testing/1.0) and gives you additional convenience assertions plus an API to define your own assertions.

Basic assert calls perform a strict equals:

``` js
assert(actual, expected, message); // performs: actual === expected
```

The `assert` method is extended, giving you aliases for the above:

``` js
assert.same(actual, expected, message);
assert.strictEqual(actual, expected, message);
// and the inverse:
assert.notSame(actual, expected, message);
assert.notStrictEqual(actual, expected, message);
```

And also an alias for the simple boolean `ok` method:

``` js
assert.ok(value, message)
```

A non-strict deep equals is available via:

``` js
assert.equals(actual, expected, message);
assert.deepEqual(actual, expected, message);
// and the inverse:
assert.notEqual(actual, expected, message);
```

And many additional assertions to make your tests clear and obvious:

``` js
assert.typeOf(value, type, message); // performs a "typeof value == type"
assert.notTypeOf(value, type, message);
assert.isDefined(value, message);
assert.isUndefined(value, message);
assert.isNull(value, message);
assert.isNotNull(value, message);
assert.isObject(value, message);
assert.isFunction(value, message);
assert.isString(value, message);
assert.isNumber(value, message);
assert.isTrue(value, message);
assert.isFalse(value, message);
assert.isBoolean(value, message);
assert.isArray(value, message);
assert.isElement(value, message); // is the value a DOM element
```

The *message* parameter on all assertions is optional.

### Custom assertions

When you have a complex condition to assert, you can define a custom assertion for it with the `assert.add()` method.

Simply provide your assertion name and the handler function. Handler functions can take one or two arguments:

``` js
// single-argument form:
assert.add('isUpperCaseString', function (value) {
  return typeof value == 'string' && value.toUpperCase() === value;
});
// use it:
assert.isUpperCaseString('this will fail', 'should be an upper-case string'); // →  fail
assert.isUpperCaseString('THIS WILL PASS', 'should be an upper-case string'); // →  pass

// dual-argument form:
assert.add('matchesRegex', function (actual, regex) {
  return typeof actual == 'string' && regex.test(actual);
});
// use it:
assert.matchesRegex('this will pass', / [wil]+ /, 'should match my " [wil]+ " regex');
```


Happy testing!
