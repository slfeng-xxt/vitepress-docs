# webpack

官方文档： <https://webpack.docschina.org/concepts/>

## 1. webpack是什么

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。

当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 bundle。

### 1.1 核心定位

webpack是前端工程化的集大成者，用于搭建完整的前端工程体系。

### 1.2 运行环境

基于Node.js运行环境，**主要功能**是对项目资源进行打包处理。

### 1.3 工作流程

- 入口分析: 以指定模块（如src/main.js）为起点
- 依赖收集: 自动分析所有模块依赖关系(`src/*.*`)
- 资源处理: 对CSS、图片、音频等各类资源进行合并压缩
- 输出结果: 生成优化后的最终打包文件（`dist`）

```txt
开发阶段：专注于在src目录中编写源代码，使用现代语法和模块化
构建阶段：通过webpack将源代码转换为生产环境可用的优化版本
部署阶段：只需部署dist目录中的内容到服务器即可
```

### 1.4 构建工具的作用

#### 1.4.1 问题解决者

暴露并解决前端开发中长期被忽视的问题（如模块依赖、资源优化等）

#### 1.4.2 开发提效

- 提供开发服务器（Dev Server）
- 支持文件缓存和热更新
- 自动处理路径别名和文件后缀

#### 1.4.3 质量保障

- 生成source map便于调试: source-map
- 自动处理CSS兼容性（厂商前缀）：auto-prefixer/ postcss
- 支持CSS Modules等现代方案: css-loader
- 支持ES6+语法转译: babel-loader

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

## 9. 需要了解的内容

- public目录：public目录中的所有文件（除页面模板外）会被原封不动地复制到打包结果中。
- 开发服务器：webpack-dev-server，解决传统开发流程中"修改代码->手动打包->运行查看"的繁琐过程，提供更高效的开发体验。在开发阶段使用，通过npm run serve命令启动，实现代码修改后自动刷新页面的功能。
- 文件缓存：哈希值，解决浏览器缓存导致代码更新不生效的问题
- 资源路径：资源模块在源代码中的路径（如./src/a.png）和打包后的路径（如./dist/assets/f3ad7.png）完全不同，需要通过loader处理资源路径，使其在打包后仍然有效。
- 别名：alias，解决路径层级过深的问题，通过配置别名，可以简化路径书写。
- js兼容性：babel-loader，解决浏览器兼容性问题，通过配置babel-loader，可以将ES6+代码转换为ES5代码，使其在浏览器中运行。
- css兼容性：postcss-loader，解决浏览器兼容性问题，通过配置postcss-loader，可以将CSS代码转换为兼容性更好的代码。
- css预处理器：less-loader、sass-loader，解决CSS编写效率问题，通过配置less-loader、sass-loader，可以使用less、sass等预处理器编写CSS代码，提高编写效率。
- css模块化：css-loader，解决CSS命名冲突问题，通过配置css-loader，可以将CSS代码中的类名、选择器等转换为局部作用域，避免命名冲突。文件名以.module.css结尾。
- 打包压缩：TerserWebpackPlugin，解决打包结果体积过大的问题，通过配置TerserWebpackPlugin，可以压缩JavaScript代码，减小打包结果体积。
