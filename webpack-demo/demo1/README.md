# wetback 的使用（一）：起步

### 1.基本安装

首先我们创建一个目录，初始化 npm，然后 [在本地安装 webpack](https://webpack.docschina.org/guides/installation#local-installation)，接着安装 [`webpack-cli`](https://github.com/webpack/webpack-cli)（此工具用于在命令行中运行 webpack）：

```bash
mkdir demo1
cd demo1
npm init -y
npm install webpack webpack-cli --save-dev
```



### 2.基本配置

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
import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());
```

**安装 `lodash` 来处理 数组**

```bash
npm install --save lodash 
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



### 3.loader（加载images/css/sass预编译器等）

**loader** 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 [模块](https://webpack.docschina.org/concepts/modules)，以供应用程序使用，以及被添加到依赖图中

**安装 `css-loader` 来处理 CSS**

```bash
npm install --save-dev style-loader css-loader
```

**src/style.css**

```css
.hello {
  color: red;
  font-size: 24px;
}
```

**src/index.js修改引入**

```
 import _ from 'lodash';
+import './style.css';

 function component() {
   const element = document.createElement('div');

   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+  element.classList.add('hello');

   return element;
 }

 document.body.appendChild(component());
```

**配置资源加载模块**

```
module.exports = {
 ...
  module: {
    rules: [ // 转换规则
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
  ...
}

```

**加载 images 图像**

在 webpack 5 中，可以使用内置的 [Asset Modules](https://webpack.docschina.org/guides/asset-modules/)，我们可以轻松地将这些内容混入我们的系统中：

```
module.exports = {
 ...
  module: {
    rules: [ //
      ...
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  }
  ...
}

```

**src/index.js**

```diff
 ...
 import Icon from './icon.png';

 function component() {
 ...
  // 将图像添加到我们已经存在的 div 中。
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);
  ...
 }
 ...
```

**其他font，JSON 可参考：https://webpack.docschina.org/guides/asset-management**



### 4.插件（plugin）

**loader** 用于转换某些类型的模块，而**插件（plugin）**则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

首先安装插件，并且调整 `webpack.config.js` 文件：

```bash
npm install --save-dev html-webpack-plugin
```

如果你想要了解 `HtmlWebpackPlugin` 插件提供的全部的功能和选项，你就应该阅读 [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) 仓库中的源码

**webpack.config.js**

```diff
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, //构建前清理 /dist 
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
  module: {
    rules: [ // 转换规则
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  }
}
```

**备注**：webpack4.x 自动清空打包目录 是使用插件 [clean-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclean-webpack-plugin) 来实现

**src/print.js**

```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```

并且在 `src/index.js` 文件中使用这个函数：

**src/index.js**

```diff
import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import printMe from './print.js';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

  element.classList.add('hello');

  // 将图像添加到我们已经存在的 div 中。
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());

```

**插件（plugins）**的基本概念：https://webpack.docschina.org/concepts/#plugins

### 5.开发环境

**webpack 的 mode 提供三个值：none、development（开发模式）、production（生产模式，默认）。**

为什么需要不同环境？不要问，问了就是不知道~

本地开发和部署线上，肯定是有不同的需求

**本地环境：**

- 需要更快的构建速度
- 需要打印 debug 信息
- 需要 live reload 或 hot reload 功能
- 需要 sourcemap 方便定位问题
- ...

**生产环境：**

- 需要更小的包体积，代码压缩+tree-shaking
- 需要进行代码分割
- 需要压缩图片体积
- 资源优化等
- ...

​	以上我们将 *生产环境* 和 *开发环境* 做了细微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个 "common(通用)" 配置。为了将这些配置合并在一起，我们将使用一个名为 [`webpack-merge`](https://github.com/survivejs/webpack-merge) 的工具。此工具会引用 "common" 配置，因此我们不必再在环境特定(environment-specific)的配置中编写重复代码。

首先安装插件，并且调整 `webpack.config.js` 文件：

```
npm install --save-dev webpack-merge
```

**project**

```diff
  webpack-demo
  |- package.json
  |- package-lock.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

**webpack.common.js**

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [ // 转换规则
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  }
};
```

**webpack.dev.js**

```diff
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    compress: true,
    port: 9000,
  },
});

```

**webpack.prod.js**

```diff
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
});
```

`webpack.common.js`对应的使我们公共配置，

在 `webpack.dev.js` 中，我们将 `mode` 设置为 `development`，并且为此环境添加了推荐的 `devtool`（强大的 source map）和 `devServer` 配置。

`webpack.prod.js` 中，我们将 `mode` 设置为 `production`，其中会引入之前在 [tree shaking](https://webpack.docschina.org/guides/tree-shaking) 指南中介绍过的 `TerserPlugin`。

具体参考：https://webpack.docschina.org/guides/production/

### 使用 webpack-dev-server

`webpack-dev-server` 为你提供了一个基本的 web server，并且具有 live reloading(实时重新加载) 功能。设置如下：

```
npm install --save-dev webpack-dev-server
```

关于`webpack-dev-server`其他更多配置，请查看 [配置文档](https://webpack.docschina.org/configuration/dev-server)。

**package.json**

```diff
 {
   ...
   "scripts": {
   	...
	"start": "webpack serve --open --config webpack.dev.js",
	 "build": "webpack --config webpack.prod.js"
	 ...
   },
   ...
 }
```

现在，在命令行中运行 `npm start`，

webpack多个环境配置可参考：https://juejin.cn/post/6969480065025310727#heading-9
