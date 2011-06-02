/*!
  * R2 - a CSS LTR ∞ RTL converter
  * Copyright Dustin Diaz 2011
  * https://github.com/ded/r2
  * License MIT
  */

var fs = require('fs'),
    sqwish = require('sqwish');

function quad(v, m) {
  // 1px 2px 3px 4px => 1px 4px 3px 2px
  if ((m = v.trim().split(/\s+/)) && m.length == 4) {
    return [m[0], m[3], m[2], m[1]].join(' ')
  }
  return v
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
  'left': 'right',
  'right': 'left'
}

var valueMap = {
  'padding': quad,
  'margin': quad,
  'text-align': rtltr,
  'float': rtltr
}

function r2(css) {

  css = sqwish.minify(css);

  var result = css.match(/([^{]+\{[^}]+\})+?/g).map(function (rule) {

    // break rule into selector|declaration parts
    var parts = rule.match(/([^{]+)\{([^}]+)/),
        selector = parts[1],
        declarations = parts[2];

    return selector + '{' + declarations.split(';').map(function (decl) {
      var m = decl.match(/([^:]+):([^;]+)$/),
          prop = m[1],
          val = m[2];
          console.log(prop, val);
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