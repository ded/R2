/*!
  * Sink - Browser & Headless JavaScript Unit Tester
  * copyright Dustin Diaz 2012
  * https://github.com/ded/sink-test
  * License MIT
  */
!function(context) {
  var total = 0
    , logKey = ''
    , fail = false
    , modules = []
    , tests = []
    , item
    , setPasses = true
    , allPass = true
    , beforeMethods = []
    , afterMethods = []
    , currentSetName
    , isHeadless = (typeof module !== 'undefined' && module.exports)

  isHeadless ? (require('colors')) : String.prototype.__defineGetter__ && !function () {
      each(['red', 'green', 'magenta', 'rainbow', 'yellow'], function (color) {
        String.prototype.__defineGetter__(color, function () {
          return this.replace(/( )/, '$1') // stupid workaround to not log an object
        })
        String.prototype.__defineSetter__(color, function (v) {})
      })
    }()

  !isHeadless && window && !('console' in window) && !function () {
    context.console = {log: function () {}}
  }()

  function reset() {
    total = 0
    fail = false
    init()
  }

  function failure(li, check) {
    setPasses = false
    allPass = false
    if (!isHeadless) {
      check.innerHTML = '✗'
      li.className = 'fail'
    }
    reset()
  }

  function each(items, fn) {
    for (var i = 0; i < items.length; i++) fn(items[i])
  }

  function pass(li, check) {
    if (!isHeadless) {
      check.innerHTML = '✓'
      li.className = 'pass'
    }
    reset()
  }

  function before(fn) {
    fn ? beforeMethods.push(fn) : each(beforeMethods, function (f) {
      f()
    })
  }

  function after(fn) {
    fn ? afterMethods.push(fn) : each(afterMethods, function (f) {
      f()
    })
  }

  function bind(li) {
    li.onclick = function() {
      var ul = this.getElementsByTagName('ul')[0]
      ul.className = (ul.className) ? '' : 'show'
    }
  }

  function _test(name, expect, fn) {
    var li, check, start
      , checker = function () {
          if (sink.timeout && (+new Date - start > sink.timeout)) {
            failure(li, check)
            after()
          } else {
            if (fail) {
              failure(li, check)
              after()
            } else if (!total) {
              after()
              pass(li, check)
            } else {
              setTimeout(arguments.callee, 10)
            }
          }
        }
      , complete = function () {
          if (total == -1)
            ok(false, 'No expectations!')
          total = 0
        }

    before()

    if (typeof expect == 'function') {
      fn = expect
      total = -1
    } else {
      total = expect
    }

    if (!isHeadless) {
      li = document.createElement('li')
      li.innerHTML = name + ' ... <span>o</span><ul></ul>'
      item = li.getElementsByTagName('ul')[0]
      bind(li)
      check = li.getElementsByTagName('span')[0]
      document.getElementById('tests').appendChild(li)
    } else {
      console.log(logKey + (name + '...').yellow)
    }

    start = +new Date
    fn.apply(null, total == -1 ? [ complete ] : [])

    setTimeout(checker, 10)
  }

  function test(name, expect, fn) {
    tests.push({
      name: name,
      expect: expect,
      fn: fn
    })
  }

  function init() {
    if (tests.length) {
      var o = tests.shift()
      _test(o.name, o.expect, o.fn)
    } else {
      setPasses = true
      start()
    }
  }

  function same(actual, expected) {
    return actual === expected
  }

  var toPrintableString = typeof JSON !== 'undefined' && JSON.stringify ? function(o) {
    if (o instanceof RegExp) return o.toString()
    return JSON.stringify(o)
  } : function(o) { return Object.prototype.toString.call(o) }

  function assert(actual, expected, msg, type, fn) {
    if (typeof type === 'undefined') type = 'same'
    var b = (fn || same)(actual, expected)
      , actualStr = toPrintableString(actual)
      , expectedStr = toPrintableString(expected)
      , typeStr = 'assert.' + type
    if (assert.__negateNext) { // a hack to help with testing assert negatives
      b = !b
      typeStr = '!' + typeStr
      delete assert.__negateNext
    }
    if (isHeadless) {
      var message = b ? '' :
        '\n\t[' + typeStr + ']\n\tactual: ' + actualStr +
        (fn && fn.length === 1 ? '' : '\n\texpected: ' + expectedStr)
      if (b) console.log(logKey + msg + (message + ' ✓').green)
      else console.log(logKey + msg + (message + ' ✗').red)
    } else {
      var li = document.createElement('li')
        , message =
            '<b>[' + typeStr + ']</b><b>actual: ' + actualStr +
            (fn && fn.length === 1 ? '' : '</b><b>expected: ' + expectedStr + '</b>')
      li.className = b ? 'pass' : 'fail'
      li.innerHTML = (msg || '') + ' ' + message + ' ' + '<em class="marker">' + (b ? '✓' : '✗') + '</em>'
      item.appendChild(li)
    }

    if (b) total--
    else fail = true
  }

  function ok(b, message) {
    if (isHeadless) {
      if (b) console.log(logKey + (message + ' ✓').green)
      else console.log(logKey + (message + ' ✗').red)
    } else {
      var li = document.createElement('li')
      li.className = b ? 'pass' : 'fail'
      li.innerHTML = message + ' ' + (b ? '✓' : '✗')
      item.appendChild(li)
    }

    if (b) total--
    else fail = true
  }

  function sink(name, fn) {
    modules.push({
        name: name
      , fn: fn
    })
  }

  function nextGroup(name, fn) {
    beforeMethods = []
    afterMethods = []
    var mod = ('MODULE: ' + name)
    if (isHeadless) {
      console.log(logKey + mod.magenta)
    } else {
      var li = document.createElement('li')
      li.innerHTML = mod
      document.getElementById('tests').appendChild(li)
      li.className = 'mod'
    }
    fn(test, ok, before, after, assert)
    currentSetName = name
    init()
  }

  function start() {
    var current = modules.shift()
    current ? nextGroup(current.name, current.fn) : !function () {
      var message = [
            'Congratulations! All tests have passed!'
          , 'There were some errors! The suite has failed.'
        ]
        , exit = allPass ? 0 : 1
        , color = allPass ? 'rainbow' : 'red'
        , status = allPass ? 'sink-pass' : 'sink-failure'
      message = message[exit].toUpperCase()
      if (isHeadless) {
        console.log(logKey + message[color])
        process.exit(exit)
      }
      else {
        document.getElementById('tests').className = status + ' sink-done'
      }
    }()
  }

  function setLogKey (key) {
    var log = console.log
    logKey = key || '$__sinkTest::'
    console.log = function (msg) {
      if (~(''+msg).indexOf(logKey)) {
        log(msg.replace(logKey, ''))
      }
    }
  }

  if (isHeadless) {
    exports.sink = sink
    exports.start = start
    exports.sink.timeout = 10000
    exports.setLogKey = setLogKey
  } else {
    context.sink = sink
    context.start = start
    context.sink.timeout = 10000
  }

  //------------------- ASSERTIONS ----------------------//

  // The following code is heavily inspired by BusterJS assertions by @cjno and @augustl
  // These assertions are mostly compatible with CommonJS Unit-Testing/1.0.

  var element = typeof document !== 'undefined' && document.createElement('p')

  assert.add = function (type, fn) {
    assert[type] = function(actual, expected, msg) {
      if (fn.length === 1) {
        msg = expected
        expected = undefined
      }
      return assert(actual, expected, msg, type, fn)
    }
  }

  function isElement(o) {
    if (!o || !element || !o.nodeType || o.nodeType !== 1) return false
    try {
      o.appendChild(p)
      o.removeChild(p)
    } catch (ex) { return false }
    return true
  }

  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  }

  function isDate(o) {
    return typeof o.getTime == "function" && o.getTime() == o.valueOf()
  }

  function keys(o) {
    var k = []
    for (var p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p))
        k.push(p)
    }
    return k
  }

  // yuk, an approximation of a CommonJS deepEqual method, not recursive-safe
  function equal(actual, expected) {
    if (actual === expected) return true
    if (actual == null || expected == null)
      return actual == expected
    if (isElement(actual) || isElement(expected)) return false
    if (isDate(actual) || isDate(expected))
      return isDate(actual) && isDate(expected) && actual.getTime() === expected.getTime();
    if (actual instanceof RegExp && expected instanceof RegExp)
      return actual.toString() !== expected.toString()
    if ((typeof actual !== 'object' || typeof expected !== 'object') &&
        !isArray(actual) && !isArray(expected))
      return actual == expected // coerce
    if (typeof actual !== typeof expected) return false
    var actualKeys = keys(actual)
      , expectedKeys = keys(expected)
    if (actualKeys.length !== expectedKeys.length) return false
    var key, i = 0
    for (; i < expectedKeys.length; i++) {
      key = expectedKeys[i]
      if (!Object.prototype.hasOwnProperty.call(actual, key) || !equal(actual[key], expected[key]))
        return false
    }
    return true
  }

  assert.add('ok', function(actual) { return actual }, true)
  assert.add('same', same)
  assert.add('strictEqual', same)
  assert.add('notStrictEqual', function(actual, expected) {
    return !same(actual, expected)
  })
  assert.add('notSame', function(actual, expected) {
    return !same(actual, expected)
  })
  assert.add('equal', equal)
  assert.add('deepEqual', equal)
  assert.add('notEqual', function(actual, expected) {
    return !equal(actual, expected)
  })
  assert.add('typeOf', function(actual, expected) {
    return typeof actual === expected
  })
  assert.add('notTypeOf', function(actual, expected) {
    return typeof actual !== expected
  })
  assert.add('isDefined', function(actual) {
    return typeof actual !== 'undefined'
  })
  assert.add('isUndefined', function(actual) {
    return typeof actual === 'undefined'
  })
  assert.add('isNull', function(actual) {
    return actual === null
  })
  assert.add('isNotNull', function(actual) {
    return actual !== null
  })
  assert.add('isObject', function(actual) {
    return typeof actual === 'object' && !!actual
  })
  assert.add('isFunction', function(actual) {
    return typeof actual === 'function'
  })
  assert.add('isTrue', function(actual) {
    return actual === true
  })
  assert.add('isFalse', function(actual) {
    return actual === false
  })
  assert.add('isString', function(actual) {
    return typeof actual === 'string'
  })
  assert.add('isBoolean', function(actual) {
    return typeof actual === 'boolean'
  })
  assert.add('isNumber', function(actual) {
    return typeof actual === 'number' && !isNaN(actual)
  })
  assert.add('isArray', isArray)
  assert.add('isElement', isElement)

}(this)
