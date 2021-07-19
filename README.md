# 引言
 > 在上一篇博客中，我简单的描述了 `rollup` [怎么使用](https://blog.csdn.net/qq_41499782/article/details/118725309?spm=1001.2014.3001.5501)，配置文件的使用。这一篇，来一起学习一下 rollup  怎么搭建开发服务，这里不包含任何的框架代码，我们需要 实现的是 ，我 在代码中修改任何地方，rollup可以自己监听到，并且给我给我更新浏览器就行。 这里的代码包括 css, 以及js等。
# 效果 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719092148677.gif#pic_center)
> 本需要实现的效果是，启动一个	`rollup`	开发服务，然后在界面上带有样式，控制台输出js的结果，当我们改变代码后（`js`,`css`）后，按 `ctrl + s` 保存代码后，自动热更新代码。 
# 目录说明

```typescript
my-rollup //项目名称
├─ build  // 打包文件夹
│  └─ rollup.config.dev.js // 开发环境配置文件
├─ dist  // 开发环境编译的结果目录
│  ├─ index.css // css的编译结果
│  ├─ index.html //入口文件
│  ├─ index.js // 对应的js
│  └─ index.js.map //  js map 方便在浏览器中定位代码错误的位置
├─ package-lock.json // 安装包的依赖树文件
├─ package.json // 安装的包
└─ src  // 源码目录
   ├─ add.js // 对外导出一个添加的方法
   ├─ util.js // 工具js,导出一个延时函数，一个promise
   ├─ index.css // 样式文件
   ├─ index.js  // 入口的js文件
   └─ reduce.js //对外导出一个减少的方法
```

#  依赖安装说明
> 这里对每一个依赖 进行简单的貌似和一些使用方式

## @rollup/plugin-babel 
> rollup的模块机制是`ES6 模板`，并不会`对es6`其他的语法进行编译。因此如果要使用`es6`的语法进行开发，还需要使用`babel`来帮助我们将代码编译成`es5`。对于这种需求，`rollup`提供了解决方案`rollup-plugin-babel`，该插件将`rollup和babel`进行了完美结合。 `Babel`是一个 `JavaScript 编译器`，准确说是一个`source-to-source`编译器，通常称为`“ transpiler”`。这意味着您向 `Babel` 提供一些 `JavaScript `代码，`Babel` 修改代码，并返回生成新代码。会把源代码分为两部分来处理：**语法syntax、api**。`语法syntax`比如`const`、`let`、`模版字符串`、`扩展运算符`等。 `api`比如`Array.findIndex(), promise`等`es6`以后的新函数。

### 使用方式

```javascript
import {babel} from '@rollup/plugin-babel'

module.exports = {
// 入口
input: 'xxxx',
....
// 使用插件 
plugins: [babel({
// 不转译，node_modules里面的代码
	 exclude: 'node_modules/**',
})]
}
```
## @babel/core
> `babel/core` 是`babel`的核心包，由于  `@rollup/plugin-babel` 这个库里面需要引用这个库，所以为我们需要进行安装。这里简单描述一下这个库的作用。
 
 首先这个库是一个代码的编译器，将代码进行转译。里面包含了三个阶段。
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719204430734.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNDk5Nzgy,size_16,color_FFFFFF,t_70)

- **解析代码成语法树**  ： `@babel/parser`  是 `@babel/parser`用于将代码进行语法分析，词法分析，然后生成一个语法树 `（ AST）`
- **对语法树进行代码替换**：`@babel/traverse` 是 `@babel/parser`用于将一个`AST`，并对其遍历，根据`preset`、`plugin`进行逻辑处理，进行**替换**、**删除**、**添加**节点等操作，
- **生成转译的代码** ：`@babel/generator`  是 `@babel/parser`用于把上一步操作好的`AST`生成代码。

>babel转码流程：input string -> @babel/parser parser -> AST -> transformer[s] -> AST -> @babel/generator -> output string。 
###  使用方式
>`@rollup/plugin-babel` 这个 插件帮我实现了代码转译，我们不需要做额外的操作，只需要安装库就好了。不需要做任何的配置哦!
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719202738590.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNDk5Nzgy,size_16,color_FFFFFF,t_70)
## @babel/preset-env
> 现如今不同的浏览器和平台`chrome`, `opera`, `edge`, `firefox`, `safari`, `ie`, `ios`, `android`, 等
不同的模块` "amd" `， `"umd"` ， `"systemjs"` ，` "commonjs"`,`esm `等 
这些es运行环境对`es6`,`es7`,`es8`支持不一，有的支持好，有的支持差，为了充分发挥新版es的特性，我们需要在特定的平台上执行特定的
转码规则，说白了就像是按需转码的意思

### 使用方式
> 使用方式大致有三种，第一种 ，建立 `.babelrc`文件，  第二种，在package.json中使用，第三种，在babel中进行配置。

这里只介绍在babel配置中使用。

```javascript
import {babel} from '@rollup/plugin-babel'

module.exports = {
// 入口
input: 'xxxx',
....
// 使用插件 
plugins: [babel({
 exclude: 'node_modules/**',
 //使用预设，按照我的目标来编译代码
 presets: [['@babel/preset-env', {
        "targets": {
          "edge": '17',
          "firefox": '60',
          "chrome": '67',
          "safari": '11.1'
        }
      }]],
})]
}
```

## @babel/plugin-transform-runtime 
>   对代码进行转译，然后不会重复引用导入相同的代码，一般和 `@babel/runtime-corejs3` 一起使用

### 使用方式

```javascript
{
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

## rollup
> 打包构建工具，主要用于构建代码库 。

###  使用方式 
查看上篇博客 [https://blog.csdn.net/qq_41499782/article/details/118725309](https://blog.csdn.net/qq_41499782/article/details/118725309?spm=1001.2014.3001.5501)


## rollup-plugin-serve
> 搭建rollup 开发服务器，类似  `webpack-dev-serve`，功能也差不多

### 使用方式

```javascript
 // 启动开发服务器
    serve({
      port: 5000,
      host: 'localhost',
      // 当遇到错误后重定向到哪个文件
      historyApiFallback: resolveFile('dist/index.html'),
      // 静态资源
      contentBase: [resolveFile('dist')],
      // 在开发服务中添加一些输出的一些信息
      onListening: function (server) {
        console.log('\x1B[33m%s\x1b[0m:', 'The rollup dev Serve is start!!!')
        const address = server.address()
        const host = address.address === '::' ? 'localhost' : address.address
        // by using a bound function, we can access options as `this`
        const protocol = this.https ? 'https' : 'http';
        console.log('\x1B[36m%s\x1B[0m', `Serve is listening in ${address.port}`);
        console.log('\x1B[35m%s\x1B[39m', `You can click   ${protocol}://${host}:${address.port}/   go to Browser`);
        console.log('\x1B[34m%s\x1B[39m', `You can click   ${protocol}://localhost:${address.port}/  go to Browser`);
      }
    }),
```
## @rollup/plugin-html
> 生成一个静态的html模板，这个和`weback-plugin-min--html`很像，是动态生成html的，会默认给你生成一个模板

### 使用方式

```javascript
  html({
      fileName: 'index.html',
      title: '测试rollup开发环境',
      }）
```

## rollup-plugin-livereload
> 启动热更新，这个热更新是自动刷新浏览器的哦，更改css或者js都会自动的刷新浏览器

### 使用方式

```javascript
// 开启热更新
    livereload(),
```

## rollup-plugin-css-only
> 这个是用于打包css的库 ，

### 使用方式

```javascript
 css({ output: 'index.css' }),
```
> 上面的这些库有的是插件，注意插件的运行顺序，从上到下，需要先使用 css,然后来解析 jss，这页面才能 更快出来哦！

```typescript
    "@rollup/plugin-babel": "^5.3.0",  
    "@babel/core": "^7.14.6", 
    "@babel/preset-env": "^7.14.7",
    "@babel/plugin-transform-runtime": "^7.14.5", 
    "rollup": "^2.53.1",
    "rollup-plugin-serve": "^1.1.0",
    "@rollup/plugin-html": "^0.2.3",
    "rollup-plugin-livereload": "^2.0.5",
    "rollup-plugin-css-only": "^3.1.0",
    
    
```

# `package.json` 脚本

> package.json 脚本变化的是，使用开发环境的配置文件，并且开启监听文件修改。

```javascript
"scripts": {
    "dev": "rollup -w -m -c ./build/rollup.config.dev.js"
```


# src 目录的内容 
##  index.js
> 这里为了做测试，加入了promise 和 class， async 和  await
```javascript
import { add, AsyncClass } from "./add";
import { reduce } from "./reduce";
import './index.css';

const arr1 = ['a', 'b', 'c'];
const arr2 = [4, 5, 6];

const result = [...arr1, ...arr2];


console.log(result);
const a = 1, b = 2;

const res = add(a, b);

const d = reduce(a, b);
console.log(res);

new AsyncClass().asyncAdd(10, 20).then(res => {
  console.log(res, '异步加结果')
 })
```

> 详细代码，请查看GitHub仓库 

