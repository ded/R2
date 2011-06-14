/*!
  * R2 - a CSS LTR ∞ RTL converter
  * Copyright Dustin Diaz 2011
  * https://github.com/ded/r2
  * License MIT
  */

var fs = require('fs');

function quad(v, m) {
  // 1px 2px 3px 4px => 1px 4px 3px 2px
  if ((m = v.trim().split(/\s+/)) && m.length == 4) {
    return [m[0], m[3], m[2], m[1]].join(' ')
  }
  return v
}

function direction(v) {
  return v == 'ltr' ? 'rtl' : v == 'rtl' ? 'ltr' : v
}

function rtltr(v) {
  if (v == 'left') return 'right'
  if (v == 'right') return 'left'
  return v
}

var propertyMap = {
  'margin-left': 'margin-right',
  'margin-right': 'margin-left',

  'padding-left': 'padding-right',
  'padding-right': 'padding-left',

  'border-left': 'border-right',
  'border-right': 'border-left',

  'border-left-width': 'border-right-width',
  'border-right-width': 'border-left-width',

  'border-radius-bottomleft': 'border-radius-bottomright',
  'border-radius-bottomright': 'border-radius-bottomleft',
  '-moz-border-radius-bottomright': '-moz-border-radius-bottomleft',
  '-moz-border-radius-bottomleft': '-moz-border-radius-bottomright',

  'left': 'right',
  'right': 'left'
}

var valueMap = {
  'padding': quad,
  'margin': quad,
  'text-align': rtltr,
  'float': rtltr,
  'direction': direction
}

function r2(css) {

  css = css.trim() // give it a solid trimming to start

  // comments
  .replace(/\/\*[\s\S]+?\*\//g, '')

  // line breaks and carriage returns
  .replace(/[\n\r]/g, '')

  // space between selectors, declarations, properties and values
  .replace(/\s*([:;,{}])\s*/g, '$1')

  // replace multiple spaces with single spaces
  .replace(/\s+/g, ' ')

  var result = css.match(/([^{]+\{[^}]+\})+?/g).map(function (rule) {

    // break rule into selector|declaration parts
    var parts = rule.match(/([^{]+)\{([^}]+)/),
        selector = parts[1],
        declarations = parts[2];

    return selector + '{' + declarations.split(/;(?!base64)/).map(function (decl) {
      if (!decl) return ''
      var m = decl.match(/([^:]+):(.+)$/);
      if (!m) {
        return ''
      }
      prop = m[1],
      val = m[2];
      prop = propertyMap[prop] || prop;
      val = valueMap[prop] ? valueMap[prop](val) : val;
      return prop + ':' + val + ';'
    }).join('') + '}';

  });

  return result.join('');
}



module.exports.exec = function (args) {
  var out;
  var read = args[0];
  var out = args[1];
  console.log('Swapping ' + read + ' to ' + out + '...');
  var data = fs.readFileSync(read, 'utf8');
  fs.writeFileSync(out, r2(data), 'utf8');
};
module.exports.swap = function (css) {
  return r2(css);
};