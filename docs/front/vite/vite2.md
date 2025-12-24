# vite相对于webpack的优势

## 一、vite简介

[官方文档](https://vitejs.cn/vite3-cn/guide/why.html)

### 现实问题

在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

时过境迁，我们见证了诸如 webpack、Rollup 和 Parcel 等工具的变迁，它们极大地改善了前端开发者的开发体验。

然而，当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。基于 JavaScript 开发的工具就会开始遇到性能瓶颈：通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用模块热替换（HMR），文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。

## 二、webpack遇到的问题

### 起因

项目越来越大，构建工具（webpack）需要处理是js代码越来越多，遇到性能瓶颈

### 结果

构建工具每次需要很长时间去编译打包（启动开发服务器或HMR过程中）

### webpack能否优化上述问题？

***由于webpack支持多模块开发，故在编译的过程中需要对每个引入的文件进行处理转换，所以说无法优化，原因如下：***

* **webpack支持多模块开发**

```js
// index.js
// commonjs 
const lodash = require('lodash')
// esm
import Vue from 'Vue'
```

* **转换如下**

```js
// webpack编译后的
const loadsh = webpack_require('lodash')
const Vue = webpack_rwquire('Vue')
```

* **补充：webpack编译原理**

AST语法分析的工具，分析文件中有哪些导入和导出的操作，然后转换为自己的一套规则

```js
(function(modules){
    function webpack_require(){}
    //入口文件index.js(webpack.config.js中配置的entry属性)
    modules[entry](webpack_rquire)
    // ...
})({
    './index.js': (wepack_rquire) => {
        const loadsh = webpack_require('lodash')
        const Vue = webpack_rwquire('Vue')
    }
})
```

### webpack会被vite取缔吗？

 ***不会***

* webpack支持**多模块**，所有它不止可以在浏览器上运行，有一定的**兼容性**，而且生态也很大
* vite是基于ESM的，侧重于浏览器开发体验，兼容性差

## 三、两者的设计模式区别

### webpack

* 将所有文件打包后再放服务器上运行

### vite

* 先启动服务器找到入口文件（entry），然后当用到的文件进行加载，不会把所有的文件都解析完
