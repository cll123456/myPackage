
>  前面讲过了，rollup如何打包开发环境。现在肯定是打包成生产环境了。本次需要实现的功能是把库打包成生产环境。由于本次代码是基于前两次的基础上的，如果有问题的还请移步前两节。 [（实战 rollup 第一节入门）](https://blog.csdn.net/qq_41499782/article/details/118725309?spm=1001.2014.3001.5501)
>  [（rollup 实战第二节 搭建开发环境）](https://blog.csdn.net/qq_41499782/article/details/118880312?spm=1001.2014.3001.5501)

# 打包生`umd, cjs, esm`的文件
> - vue 源码打包的分为以下几种(`umd, cjs, esm`)![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c614e0d253cf47dfa58de38be2b987f1~tplv-k3u1fbpfcp-watermark.image)
>- react 源码打包也是上面的三种（`umd, cjs, esm`）![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94adad68619e4b9590b15ad0caa50603~tplv-k3u1fbpfcp-watermark.image)
> - 所有的学习都是从模仿开始，那咋们也来配置一下，打包成这三种类型的js.
# 打包简单代码
既然要使用rollup, 那肯定是需要安装rollup这个打包工具的，如果已经全局安装的请忽略，个人是局部安装的， `npm install rollup -D`, 然后在`package.json`中的`script`中加入 打包的命令 `"build": "rollup -c ./build/rollup.config.js"`,然后在根目录下面建立 `build`文件夹
## 配置文件
这里的配置文件其实很简单，既然`rollup`的`output`属性配置的是一个对象，那么我配置成一个**数组**，里面包含多个输出对象，那不就有了。

在`build`目录下面，建立一个名称叫做 `rollup.build.js`的文件，然后放入以下代码：

```js
export default {
  input: 'src/index.js', // 打包的内容，自己随便写一些简单的代码
  output: [
    {
      file: 'dist/cjs/index.js', // 打包成commonjs
      format: 'cjs'
    },
    {
      file: 'dist/esm/index.js', // 打包成esmodule
      format: 'esm'
    },
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'index' // umd 规范，一定要有一个名字，不然打包报错
    },
  ]
};
```

## 效果
> 执行 `npm run build` ，然后在`src`同层目录下面就会生成一个`dist`文件夹，内容如下:

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38c990bf82844afcac97d0aabd86c2cf~tplv-k3u1fbpfcp-watermark.image)
## 测试效果
>  对于如何测试本地的包，我在上篇文章说明了，请移步  [npm 如何测试自己本地的包](https://blog.csdn.net/qq_41499782/article/details/118999221?spm=1001.2014.3001.5501)，这里就看效果就行，这个代码也是上一次测试本地链接里面的代码。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b8beb568aaa47d7ae576d86d6aba56d~tplv-k3u1fbpfcp-watermark.image)
# 打包`现代`代码
> `现代`代码就是在原有的基础上，加了es6以后的 `promise, async, await, 生成器，类`等，这些代码需要进行代码转译的。

转译`es`的代码，大家都知道需要使用`babel`。但是`rollup`在转译代码方面官方做了一个插进，叫做 `@rollup/plugin-babel`,转译现代化代码。需要安装一下包。 `npm install @rollup/plugin-babel @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/runtime-corejs3 @rollup/plugin-babel  -D`, 对于这些包的具体使用以及作用，[请查看](https://blog.csdn.net/qq_41499782/article/details/118880312?spm=1001.2014.3001.5501)

接下来在`rollup.config.js` 加上插件属性,配置文件添加以下代码：

```js
import babel from '@rollup/plugin-babel'; // 导入babel
{
...
// 使用插件
plugins: [
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      babelHelpers: 'runtime',      // 使plugin-transform-runtime生效
      // 使用预设
      presets: [['@babel/preset-env', {
        "modules": false,
        "useBuiltIns": "usage",
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
    })
  ]
  }
```
带着愉快的心情来打包代码，`npm run build`
**结果如下：**

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0dc05ebd0ab4684b0fc4a465ec22deb~tplv-k3u1fbpfcp-watermark.image)

这一张报错信息告诉我们两个问题，
## QUS1 缺少依赖 `core-js`
> 人家都告诉咋们怎么弄了，直接安装包就好。  `npm install --save core-js@3`
然后在 `"useBuiltIns": "usage",`下面加入以下配置（由于本人安装的版本是`3.15.2`，所以我的值就是**3.15.2**,各位同学请结合实际情况来配置）

       
```js
 "corejs": "3.15.2",
```
## QUS2 有一堆的转译包找不到
> 看到这个问题，最好的方法就是去看那些打包好的文件。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6c6026974fc45d2bcbe528464a6d238~tplv-k3u1fbpfcp-watermark.image)

> 我打包好的文件，那些转译的包都没有引入进来，怎么使用也是报错。


### 解决办法
> 安装以下两个包: `npm install @rollup/plugin-node-resolve @rollup/plugin-commonjs`
- `@rollup/plugin-node-resolve`: 让`rollup`可以找到`node`环境的其他依赖
- `@rollup/plugin-commonjs` : 将`commonJS`代码转译成  `esmodule`的代码

然后修改配置文件：

```js
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
{
...
plugins:[
    nodeResolve(),
    commonjs(),
]
}
```

那咋们继续来打包。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10e35f535c924c82a55dee1c74ce1eb8~tplv-k3u1fbpfcp-watermark.image)
> 在这里肯定有的人要说话了，为啥一点点代码，打包后却增加了这么多代码，因为本人在代码里面 使用了 `类，promise, async, await`, 并且还要兼容`ie10`， 作为一个包，肯定是能满足越多的人越好,一般的包都会支持这些的。

## 测试
> 这里的测试，咋们直接建立`html`文件，然后在外部使用 `dev环境来测试`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f4f050353704a569011604c6614f5ba~tplv-k3u1fbpfcp-watermark.image)

**ie10中查看效果**

![ie-rollup-build.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6a99159916241188193f8b3553e6813~tplv-k3u1fbpfcp-watermark.image)

> 恭喜你，同学，也恭喜我自己，到了这一步。一些基本的库的打包方式就已经好了。如何发布到npm,  请查看其他的博客。我这还没有完呢

# 加入ts 
> 许多包都是用ts来写的，有关ts的相关请[查看我的专栏](https://blog.csdn.net/qq_41499782/category_10721363.html?spm=1001.2014.3001.5482)，这里不做过多的解释。
要使用ts来开发代码，咋们必须要安装ts才行，所以安装以下库：`npm install typescript rollup-plugin-typescript2 tslib`
- `typescript`: ts的代码库
- `rollup-plugin-typescript2` ： 这个库比官方的那个`@rollup/plugin-typescript`的下载量多好几倍，肯定选它
- `tslib`:`rollup-plugin-typescript2`一起使用的库。 这是`TypeScript`的运行时库，包含所有`TypeScript`帮助函数 。类似 babel-core 与 babel的关系。

**修改配置文件**
配置文件做以下修改：

```js
import typescript from 'rollup-plugin-typescript2';
{
...
plugins:[
     typescript({
     // 使用tsconfig.json的配置文件
      tsconfig: "tsconfig.json",
      // 默认声明文件放到一个文件夹中
      useTsconfigDeclarationDir: true
    }),
    ...
]
}
```
## 配置`tsconfig.json`
> 在 `src`同级目录下面添加`tsconfig.json`,内容根据自己实际的情况添加，我这里给一个案例 ，如下：


```js
{
  "compilerOptions": {
   // ts编译的目标文件，我这里编译成es6， 然后交给babel
    "target": "ES2017",
    // 使用最新的语法 
    "module": "esnext",
    // 库使用dom， dom可迭代
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    // 模块解析策略是node
    "moduleResolution": "node",
    // 开启es与其他模块的交互
    "esModuleInterop": true,
    // 开启严格模式
    "strict": true,
    //  开启声明文件的输出
    "declaration": true,
    // 允许导入json模块
    "resolveJsonModule": true,
    // 跳过库的检查
    "skipLibCheck": true,
    "noUnusedLocals": true,
    // 开启声明文件输出目录
    "declarationDir": "./dist/types/"
  },
  // 只编译src目录下面的文件
  "include": [
    "./src"
  ]
}

```

配置完后 ，我们来打包。`npm run build`:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4e7fffc72204cf1ae3f861c4d64ce84~tplv-k3u1fbpfcp-watermark.image)
>通过这张图，我们发现一个问题，**代码比变少了**，是`es6`的代码。这个代码肯定是不能在`ie`上使用的。那就是`babel`没有生效了？

**解决办法**
> 我们的`ts`转移后又没有输出，`babel`默认是不会对`.t`s文件后缀名进行转译的，所以我们需要加一个添加转译名。


```js
{
...
puligins:[
    babel({
        // 解析 拓展名为ts的文件
      extensions: [
        '.ts'
      ],
    })
]
}
```
>这样打包就行了。是不是很简单，但是你看到的简单，往往在写代码的时候需要写好几遍。测试的效果就不看了，和上面是一样的。

# 压缩代码
> 我们会发现，目前打出的包是没有对代码进行压缩的，上面的方式代码的可读性还是比较强的，所以接下来对代码就行压缩

`npm install rollup-plugin-terser -D` 然后在最好使用这个插件就行。

## 效果

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c57026813944b4a650e90902614227~tplv-k3u1fbpfcp-watermark.image)

> 详细代码，请查看[https://github.com/cll123456/myPackage/tree/rollup-three-build](https://github.com/cll123456/myPackage/tree/rollup-three-build)
