# webpack5 的使用（一）：起步

### 基本安装

首先我们创建一个目录，初始化 npm，然后 [在本地安装 webpack](https://webpack.docschina.org/guides/installation#local-installation)，接着安装 [`webpack-cli`](https://github.com/webpack/webpack-cli)（此工具用于在命令行中运行 webpack）：

```bash
mkdir demo1
cd demo1
npm init -y
npm install webpack webpack-cli --save-dev
```

### 基本配置

**project**项目目录及文件内容

```diff
  demo1
  |- package.json
  |- package-lock.json
+ |- /dist
+   |- index.html
  |- /src
    |- index.js
```

**src/index.js**

```diff
console.log('这是一个入口文件')
function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());
```

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.17.20"></script>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

**webpack.config.js 配置文件**

```html
const path = require('path') module.exports = { entry: './src/index.js', output:
{ filename: 'main.js', path: path.resolve(__dirname, 'dist'), }, }
```

**在 package.json 文件里的 script 添加一条 build 构建命令，如下：**

```diff
{
  ...
  "scripts": {
    "build": "webpack --config webpack.config.js",
    ...
  },
  ...
}

```

**运行命令 npm run build，我们可以发现根目录多了一个 dist 目录，里面有一个 main.js 文件**
