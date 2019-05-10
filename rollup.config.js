import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';

export default {
    input: 'r2.js',
    output: {
      file: 'dist/r2.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      commonjs(),
      builtins()
    ]
  };