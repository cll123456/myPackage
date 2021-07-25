import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { terser } from "rollup-plugin-terser";
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm'
    },
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'index'
    },
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true
    }),
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      babelHelpers: 'runtime',      // 使plugin-transform-runtime生效
      // 解析 拓展名为ts的文件
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts'
      ],
      // 使用预设
      presets: [['@babel/preset-env', {
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": "3.15.2",
        // 目标浏览器
        "targets": {
          "edge": '17',
          "firefox": '60',
          "chrome": '67',
          "safari": '11.1',
          'ie': '10',
        },
      }]],
      plugins: [
        //  多次导入的文件，只导入一次
        ['@babel/plugin-transform-runtime']],
    }),
    terser()
  ]
};