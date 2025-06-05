# webpack

官方文档： <https://webpack.docschina.org/concepts/>

## 1. webpack是什么

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 bundle。

## 2. webpack的安装

```bash
npm install webpack webpack-cli --save-dev
```

## 3. webpack的配置

webpack的配置文件是`webpack.config.js`，可以在其中配置入口文件、输出文件、加载器、插件等。

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

## 4. webpack的加载器

webpack的加载器用于处理非JavaScript文件，例如CSS、图片等。常用的加载器有：

- `css-loader`：处理CSS文件
- `style-loader`：将CSS文件注入到HTML文件中
- `file-loader`：处理图片文件
- `babel-loader`：处理ES6+语法

## 5. webpack的插件

webpack的插件用于扩展webpack的功能，例如：

- `HtmlWebpackPlugin`：自动生成HTML文件，并将打包后的JavaScript文件注入到HTML文件中
- `CleanWebpackPlugin`：在每次构建之前清理/dist文件夹
- `MiniCssExtractPlugin`：将CSS文件提取到单独的文件中

## 6. webpack的优化

webpack的优化包括代码分割、压缩、Tree Shaking等。

- 代码分割：将代码分割成多个文件，按需加载，减少首次加载时间
- 压缩：压缩JavaScript、CSS、图片等文件，减少文件大小
- Tree Shaking：去除未使用的代码，减少文件大小
- CDN加速：将静态资源部署到CDN，提高加载速度
- 提取公共代码：将公共代码提取到单独的文件中，减少重复加载
- 区分环境：根据不同的环境（开发、生产）配置不同的webpack配置文件
- 使用DllPlugin和DllReferencePlugin预编译第三方库：将第三方库预编译成单独的文件，减少构建时间
- 使用HappyPack并行处理文件：使用多线程并行处理文件，提高构建速度
- 使用HardSourceWebpackPlugin缓存构建结果：使用缓存技术，提高构建速度
- 使用webpack-bundle-analyzer分析打包结果：找出瓶颈，优化打包结果

### 6.1 webpack的构建速度优化

webpack的构建速度优化包括：

- 使用`DllPlugin`和`DllReferencePlugin`预编译第三方库
- 使用`HappyPack`并行处理文件
- 使用`HardSourceWebpackPlugin`缓存构建结果
- 使用`webpack-bundle-analyzer`分析打包结果，找出瓶颈

### 6.2 webpack的构建结果分析

webpack的构建结果分析可以使用`webpack-bundle-analyzer`插件，它可以将打包结果以可视化的方式展示出来，帮助开发者找出瓶颈。

### 6.4 webpack的打包速度优化

webpack的打包速度优化可以通过以下方式实现：

- 使用`thread-loader`并行处理文件
- 使用`cache-loader`缓存构建结果
- 使用`babel-loader`的`cacheDirectory`选项缓存编译结果
- 使用`IgnorePlugin`忽略不需要打包的文件
- 使用`externals`将第三方库从打包结果中排除

### 6.5 webpack的构建结果缓存

webpack的构建结果缓存可以通过以下方式实现：

- 使用`cache-loader`缓存构建结果
- 使用`babel-loader`的`cacheDirectory`选项缓存编译结果
- 使用`HardSourceWebpackPlugin`缓存构建结果

## 7. webpack的跨域问题

webpack的跨域问题可以通过`webpack-dev-server`的`proxy`选项来解决。

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 8. 工作原理

webpack的工作原理是递归地构建依赖关系图，然后将这些模块打包成一个或多个bundle。在构建过程中，webpack会使用加载器处理非JavaScript文件，使用插件扩展webpack的功能。

### 8.1 基本概念

- Entry：入口文件，webpack会从入口文件开始构建依赖关系图
- Output：输出文件，webpack会将打包后的结果输出到指定的文件中
- Loader：加载器，用于处理非JavaScript文件
- Plugin：插件，用于扩展webpack的功能
- Bundle：打包后的结果，webpack会将依赖关系图中的模块打包成一个或多个bundle
- Dependency Graph：依赖关系图，webpack会递归地构建依赖关系图，然后将这些模块打包成一个或多个bundle

### 8.2 工作流程

- 初始化参数：webpack会读取配置文件，初始化参数
- 开始编译：webpack会从入口文件开始构建依赖关系图
- 模块转换：webpack会使用加载器处理非JavaScript文件
- 完成模块转换：webpack会将依赖关系图中的模块打包成一个或多个bundle
- 输出文件：webpack会将打包后的结果输出到指定的文件中

### 8.3 编写loader

- 编写一个函数，接收源文件作为参数
- 在函数中处理源文件，返回处理后的结果
- 在webpack配置文件中配置加载器，指定加载器的位置和参数

```javascript
// my-loader.js
function myLoader(source) {
  // 处理源文件，功能：将hello替换为world
  const result = source.replace(/hello/g, 'world');
  return result;
}

module.exports = myLoader;
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.my$/,
        use: [
          {
            loader: path.resolve(__dirname, 'my-loader.js'),
            options: {
              // 加载器的参数
            }
          }
        ]
      }
    ]
  }
};
```

### 8.4 编写plugin

- 编写一个类，实现`apply`方法
- 在`apply`方法中注册事件，监听webpack的构建过程
- 在事件处理函数中执行相应的操作

```javascript
// my-plugin.js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在emit事件中执行相应的操作
      // 功能是：向打包结果中添加一个文件，文件名为my-file.txt，文件内容为Hello, world!，文件大小为13，单位为字节
      compilation.assets['my-file.txt'] = {
        source: () => 'Hello, world!',
        size: () => 13
      }
    });
  }
}

module.exports = MyPlugin;
```

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new MyPlugin()
  ]
};
```
