# webpack进阶

- [webpack](https://webpack.js.org/)

## 1. day1

### 1.1 浏览器端的模块化

**问题**：模块多的情况没有工程化的概念，导致代码难以维护，webpack解决了这个问题，开发可以专注于业务代码，而不用关心模块化的问题

- 效率问题：js文件多了，请求次数变多，效率变低，node端可以请求本地文件比浏览器端请求服务器文件效率高
- 兼容问题：浏览器不支持commonJs模块化的情况,只支持es6模块化
- 工具问题：浏览器不支持npm下载第三方的包

**根本原因**：在浏览器端有`开发时态`和`运行时态`

- 开发时态：

```txt
1.模块划分越细越好
2.支持多种模块化规范
3.支持npm下载第三方包
4.不用考虑兼容性问题
...
```

- 运行时态：

```txt
1.文件越少越好
2.文件体积越小越好
3.所有浏览器都要兼容
4.执行效率
```

开发时态 ---> `构建工具` ----> 运行时态

### 1.2 常见构建工具

- grunt：基于任务的构建工具，配置多，学习成本高，社区活跃度低
- gulp：基于流的构建工具，配置少，学习成本低，社区活跃度低
- webpack：基于配置的构建工具，配置多，学习成本低，社区活跃度高

### 1.3 webpack核心概念

相关配置：

- entry：入口，指示webpack从哪个文件开始打包
- output：出口，指示webpack打包完文件输出到哪里，如何命名
- loader：加载器，webpack自身只理解js和json文件，其他文件需要通过loader加载后才能解析
- plugins：插件，扩展webpack的功能，让webpack具有更多的灵活性
- mode：模式，指示webpack使用相应模式的配置，默认值是production

### 1.4 webpack特点

- 服务于前端工程化，解决前端模块化问题，可以让开发人员专注于业务代码(开发时态)
- 简单易用，配置灵活，社区活跃，插件丰富，可扩展性强
- 基于nodejs，运行在服务器端（中间打包环境）
- 基于模块化，分析依赖关系，支持各种模块化规范，包括但不限于commonjs、es6、amd、cmd、umd，可以实现不同模块化规范的兼容

### 1.5 webpack安装

- 初始化项目

```bash
npm init -y
```

- 安装webpack

两个核心包：webpack、webpack-cli（开发依赖）

```bash
npm install webpack webpack-cli --save-dev
```

- 配置webpack

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
```

- 运行webpack

```bash
npx webpack --config webpack.config.js
```

- 配置package.json

```json
"scripts": {
  "build": "webpack --config webpack.config.js"
}
```

## 2. day2

## 3. day3
