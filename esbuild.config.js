const esbuild = require('esbuild');
const serve = require('koa-static');
const Koa = require('koa');
const path = require('path');
const fse = require('fs-extra')
const app = new Koa();

// 启动编译好后自动刷新浏览器
const livereload = require('livereload');
const lrserver = livereload.createServer();
lrserver.watch(__dirname + "/dist");

// 使用静态服务
app.use(serve((path.join(__dirname + '/dist'))));

esbuild.build({
  // 入口
  entryPoints: ['src/index.ts'],
  // 启动sourcemap
  sourcemap: true,
  // 打包
  bundle: true,
  // 输出的目录
  outfile: 'dist/index.js',
  // 启动轮询的监听模式
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else {
        // 这里来自动打开浏览器并且更新浏览器
        console.log('\x1B[36m%s\x1B[39m', 'watch build succeeded')
      }
    },
  },
}).then(async res => {
  const fileName = path.join(__dirname + '/dist/index.html');
  // 创建文件，如果文件不存在直接创建，存在不做任何事情
  await fse.ensureFile(fileName);
  // 把下面内容写入dist中的index.html文件中
  await fse.writeFileSync(fileName, `
 <!DOCTYPE html>
 <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试esbuild</title>
    <link rel="stylesheet" href="./index.css">
  </head>
  <body>
    <h1>测试esbuild</h1>
    <div id="app">  APP </div>
  </body>
  <script type="module" src="./index.js"></script>
  <script>
    document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>')
  </script>
  </script>
 </html>
 `)
  // 启动一个koa静态资源服务
  app.listen(3000, () => {
    console.log(`> Local:    http://localhost:3000/`)
  })
})