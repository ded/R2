var sinktest = require('sink-test')
  , sink = sinktest.sink
  , start = sinktest.start
  , r2 = require('../r2')
  , swap = r2.swap

sink('border', function(test, ok, before, after, assert) {
  test('should swap long-hand properties', function(done) {
    assert.equal(swap('p{border-left:1px;}'), 'p{border-right:1px;}', 'border-left: 1px => border-right: 1px')
    assert.equal(swap('p{border-right:1px;}'), 'p{border-left:1px;}', 'border-right: 1px => border-left: 1px')
    assert.equal(swap('p{border-right:1px solid #000;}'), 'p{border-left:1px solid #000;}', 'border-right: 1px solid #000 => border-left: 1px solid #000')
    done()
  })

  test('should swap style', function(done) {
    assert.equal(swap('p{border-style:solid;}'), 'p{border-style:solid;}', 'border-style: solid => border-style: solid')
    assert.equal(swap('p{border-style:none solid;}'), 'p{border-style:none solid;}', 'border-style: none solid => border-style: none solid')
    assert.equal(swap('p{border-style:none solid dashed;}'), 'p{border-style:none solid dashed;}', 'border-style: none solid dashed => border-style: none solid dashed')
    assert.equal(swap('p{border-style:none solid dashed double;}'), 'p{border-style:none double dashed solid;}', 'border-style: none solid dashed double => border: style none double dashed solid')
    done()
  })

  test('should swap color', function(done) {
    assert.equal(swap('p{border-color:#fff;}'), 'p{border-color:#fff;}', 'border-color: #fff => border-color: #fff')
    assert.equal(swap('p{border-color:#fff #000;}'), 'p{border-color:#fff #000;}', 'border-color: #fff #000 => border-color: #fff #000')
    assert.equal(swap('p{border-color:#000 #111 #222;}'), 'p{border-color:#000 #111 #222;}', 'border-color: #000 #111 #222 => border-color: #000 #111 #222')
    assert.equal(swap('p{border-color:#000 #111 #222 #333;}'), 'p{border-color:#000 #333 #222 #111;}', 'border-color: #000 #111 #222 #333 => border-color: #000 #333 #222 #111')
    done()
  })

  test('should swap border color', function(done) {
    assert.equal(swap('p{border-left-color:#fff;}'), 'p{border-right-color:#fff;}', 'border-left-color: #fff => border-right-color: #fff')
    assert.equal(swap('p{border-right-color:#fff;}'), 'p{border-left-color:#fff;}', 'border-right-color: #fff => border-left-color: #fff')
    done()
  })

  test('should swap width', function(done) {
    assert.equal(swap('p{border-width:0;}'), 'p{border-width:0;}', 'border-width: 0 => border-width: 0')
    assert.equal(swap('p{border-width:0 1px;}'), 'p{border-width:0 1px;}', 'border-width: 0 1px => border-width: 0 1px')
    assert.equal(swap('p{border-width:0 1px 2px;}'), 'p{border-width:0 1px 2px;}', 'border-width: 0 1px 2px => border-width: 0 1px 2px')
    assert.equal(swap('p{border-width:0 1px 2px 3px;}'), 'p{border-width:0 3px 2px 1px;}', 'border-width: 0 1px 2px 3px => border-width: 0 3px 2px 1px')
    done()
  })
})

sink('border-radius', function(test, ok, before, after, assert) {

  test('should swap border-radius', function(done) {
    // radius
    assert.equal(swap('p{border-radius:0;}'), 'p{border-radius:0;}', 'border-radius: 0 => border-radius: 0')
    assert.equal(swap('p{-moz-border-radius:0;}'), 'p{-moz-border-radius:0;}', '-moz-border-radius: 0 => -moz-border-radius: 0')
    assert.equal(swap('p{-webkit-border-radius:0;}'), 'p{-webkit-border-radius:0;}', '-webkit-border-radius: 0 => -webkit-border-radius: 0')

    // top-left-and-bottom-right top-right-and-bottom-left
    assert.equal(swap('p{border-radius:0 1px;}'), 'p{border-radius:1px 0;}', 'border-radius: 0 1px => border-radius: 1px 0')
    assert.equal(swap('p{-moz-border-radius:0 1px;}'), 'p{-moz-border-radius:1px 0;}', '-moz-border-radius: 0 1px => -moz-border-radius: 1px 0')
    assert.equal(swap('p{-webkit-border-radius:0 1px;}'), 'p{-webkit-border-radius:1px 0;}', '-webkit-border-radius: 0 1px => -webkit-border-radius: 1px 0')

    // top-left top-right-and-bottom-left bottom-right
    assert.equal(swap('p{border-radius:0 1px 2px;}'), 'p{border-radius:1px 0 1px 2px;}', 'border-radius: 0 1px 2px => border-radius: 1px 0 1px 2px')
    assert.equal(swap('p{-moz-border-radius:0 1px 2px;}'), 'p{-moz-border-radius:1px 0 1px 2px;}', '-moz-border-radius: 0 1px 2px => -moz-border-radius: 1px 0 1px 2px')
    assert.equal(swap('p{-webkit-border-radius:0 1px 2px;}'), 'p{-webkit-border-radius:1px 0 1px 2px;}', '-webkit-border-radius: 0 1px 2px => border-radius: 1px 0 1px 2px')

    // top-left top-right bottom-right bottom-left
    assert.equal(swap('p{border-radius:0 1px 2px 3px;}'), 'p{border-radius:1px 0 3px 2px;}', 'border-radius: 0 1px 2px 3px => border-radius: 1px 0 3px 2px')
    assert.equal(swap('p{-moz-border-radius:0 1px 2px 3px;}'), 'p{-moz-border-radius:1px 0 3px 2px;}', '-moz-border-radius: 0 1px 2px 3px => -moz-border-radius: 1px 0 3px 2px')
    assert.equal(swap('p{-webkit-border-radius:0 1px 2px 3px;}'), 'p{-webkit-border-radius:1px 0 3px 2px;}', '-webkit-border-radius: 0 1px 2px 3px => -webkit-border-radius: 1px 0 3px 2px')
    done()
  })

  test('should swap top-left', function(done) {
    assert.equal(swap('p{border-top-left-radius:5px;}'), 'p{border-top-right-radius:5px;}', 'border-top-left-radius:5px => border-top-right-radius: 5px')
    assert.equal(swap('p{-moz-border-radius-topleft:5px;}'), 'p{-moz-border-radius-topright:5px;}', '-moz-border-radius-topleft:5px => -moz-border-radius-topright: 5px')
    assert.equal(swap('p{-webkit-border-top-left-radius:5px;}'), 'p{-webkit-border-top-right-radius:5px;}', '-webkit-border-top-left-radius:5px => -webkit-border-top-right-radius: 5px')
    done()
  })

  test('should swap top-right', function(done) {
    assert.equal(swap('p{border-top-right-radius:5px;}'), 'p{border-top-left-radius:5px;}', 'border-top-right-radius:5px => border-top-left-radius: 5px')
    assert.equal(swap('p{-moz-border-radius-topright:5px;}'), 'p{-moz-border-radius-topleft:5px;}', '-moz-border-radius-topright:5px => -moz-border-radius-topleft: 5px')
    assert.equal(swap('p{-webkit-border-top-right-radius:5px;}'), 'p{-webkit-border-top-left-radius:5px;}', '-webkit-border-top-right-radius:5px => -webkit-border-top-left-radius: 5px')
    done()
  })

  test('should swap bottom-left', function(done) {
    assert.equal(swap('p{border-bottom-left-radius:5px;}'), 'p{border-bottom-right-radius:5px;}', 'border-bottom-left-radius:5px => border-bottom-right-radius: 5px')
    assert.equal(swap('p{-moz-border-radius-bottomleft:5px;}'), 'p{-moz-border-radius-bottomright:5px;}', '-moz-border-radius-bottomleft:5px => -moz-border-radius-bottomright: 5px')
    assert.equal(swap('p{-webkit-border-bottom-left-radius:5px;}'), 'p{-webkit-border-bottom-right-radius:5px;}', '-webkit-border-bottom-left-radius:5px => -webkit-border-bottom-right-radius: 5px')
    done()
  })

  test('should swap bottom-right', function(done) {
    assert.equal(swap('p{border-bottom-right-radius:5px;}'), 'p{border-bottom-left-radius:5px;}', 'border-bottom-right-radius:5px => border-bottom-left-radius: 5px')
    assert.equal(swap('p{-moz-border-radius-bottomright:5px;}'), 'p{-moz-border-radius-bottomleft:5px;}', '-moz-border-radius-bottomright:5px => -moz-border-radius-bottomleft: 5px')
    assert.equal(swap('p{-webkit-border-bottom-right-radius:5px;}'), 'p{-webkit-border-bottom-left-radius:5px;}', '-webkit-border-bottom-right-radius:5px => -webkit-border-bottom-left-radius: 5px')
    done()
  })
})

sink('padding', function(test, ok, before, after, assert) {
  test('should swap shorthand properties', function(done) {
    assert.equal(swap('p{padding:0;}'), 'p{padding:0;}', 'padding: 0 => padding: 0')
    assert.equal(swap('p{padding:0 1px;}'), 'p{padding:0 1px;}', 'padding: 0 1px => padding: 0 1px')
    assert.equal(swap('p{padding:0 1px 2px;}'), 'p{padding:0 1px 2px;}', 'padding: 0 1px 2px => padding: 0 1px 2px')
    assert.equal(swap('p{padding:0 1px 2px 3px;}'), 'p{padding:0 3px 2px 1px;}', 'padding: 0 1px 2px 3px => padding: 0 3px 2px 1px')
    done()
  })

  test('should swap longhand properties', function(done) {
    assert.equal(swap('p{padding-left:0;}'), 'p{padding-right:0;}', 'padding-right: 0 => padding-left: 0')
    assert.equal(swap('p{padding-right:0;}'), 'p{padding-left:0;}', 'padding-elft: 0 => padding-right: 0')
    done()
  })
})

sink('margin', function(test, ok, before, after, assert) {
  test('should swap shorthand properties', function(done) {
    assert.equal(swap('p{margin:0;}'), 'p{margin:0;}', 'margin: 0 => margin: 0')
    assert.equal(swap('p{margin:0 1px;}'), 'p{margin:0 1px;}', 'margin: 0 1px => margin: 0 1px')
    assert.equal(swap('p{margin:0 1px 2px;}'), 'p{margin:0 1px 2px;}', 'margin: 0 1px 2px => margin: 0 1px 2px')
    assert.equal(swap('p{margin:0 1px 2px 3px;}'), 'p{margin:0 3px 2px 1px;}', 'margin: 0 1px 2px 3px => margin: 0 3px 2px 1px')
    done()
  })

  test('should swap longhand properties', function(done) {
    assert.equal(swap('p{margin-left:0;}'), 'p{margin-right:0;}', 'margin-right: 0 => margin-left: 0')
    assert.equal(swap('p{margin-right:0;}'), 'p{margin-left:0;}', 'margin-elft: 0 => margin-right: 0')
    done()
  })
})

sink('float', function(test, ok, before, after, assert) {
  test('should swap float direction', function(done) {
    assert.equal(swap('p{float:right;}'), 'p{float:left;}', 'float: left => float: right')
    assert.equal(swap('p{float:left;}'), 'p{float:right;}', 'float: right => float: left')
    done()
  })
})

sink('clear', function(test, ok, before, after, assert) {
  test('should swap clear direction', function(done) {
    assert.equal(swap('p{clear:right;}'), 'p{clear:left;}', 'clear: left => clear: right')
    assert.equal(swap('p{clear:left;}'), 'p{clear:right;}', 'clear: right => clear: left')
    done()
  })
})

sink('text-align', function(test, ok, before, after, assert) {
  test('should swap text alignment', function(done) {
    assert.equal(swap('p{text-align:right;}'), 'p{text-align:left;}', 'text-align: left => text-align: right')
    assert.equal(swap('p{text-align:left;}'), 'p{text-align:right;}', 'text-align: right => text-align: left')
    done()
  })
})

sink('position', function(test, ok, before, after, assert) {
  test('should swap right/left', function(done) {
    assert.equal(swap('p{left:50%;}'), 'p{right:50%;}', 'left: 50% => right: 50%')
    assert.equal(swap('p{right:50%;}'), 'p{left:50%;}', 'right: 50% => left: 50%')
    done()
  })
})

sink('direction', function(test, ok, before, after, assert) {
  test('should swap direction', function(done) {
    assert.equal(swap('p{direction:rtl;}'), 'p{direction:ltr;}', 'direction: rtl => direction: ltr')
    assert.equal(swap('p{direction:ltr;}'), 'p{direction:rtl;}', 'direction: ltr => direction: rtl')
    assert.equal(swap('p{direction:foo;}'), 'p{direction:foo;}', 'direction: foo => direction: foo')
    done()
  })
})

sink('important', function (test, ok, b, a, assert) {
  test('should retain important declaration', function (done) {
    assert.equal(swap('p{float:left!important;}'), 'p{float:right!important;}', 'float:right!important => float:left!important')
    done()
  })
})

start()
