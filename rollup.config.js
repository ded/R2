import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'builtin-modules'

export default {
    input: 'r2.js',
    output: {
      file: 'dist/r2.js',
      format: 'cjs'
    },
    external: builtins,
    plugins: [
      resolve(),
      commonjs()
    ]
  };