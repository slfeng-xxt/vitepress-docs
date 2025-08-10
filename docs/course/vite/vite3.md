# vite脚手架和vite的区别及依赖预构建

## 一、用create-vite搭建一个vite项目

```js
npm create vite@latest
yarn create vite
pnpm create vite
```

执行上述命令后有哪些操作：

* 全局安装一个create-vite(vite脚手架)
* 直接运行这个create-vite/bin 目录下的一个执行配置

## 二、create-vite与vite的关系

### create-vite内置了vite

### 类似的使用之前的vue-cli会内置webpack

## 三、用房子类比理解两者关系

* 房子

```txt
- 毛坯房：自己装修，买家具修水电
- 精装修：拎包入住（开发商帮配置好了）
```

* 项目

```txt
* 自己搭建创建文件夹，下载vite/vue/less/babel...开发依赖
* **cli搭建（开发商）**
    * vue-cli/create-react-appp提供了精装修的模板（vite/vue/less/babel...都下载好了，配置预设好了）
    * create-vite也一样提供了配置好的模版
```

## 四、vite新建项目初体验

### 开箱即用(out of box),不需要做任何额外的配置就可以使用vite来帮你处理构建工作

:::tip
在默认情况下，我们使用esm去导入资源的时候，要么绝对路径，要么相对路径**
:::

* 使用esm的import导入模块的时候，经常会引入node_modules中的模块
* **无vite的情况**：当自己新建的项目（毛坯房）时，浏览器访问页面导入的资源需要es来搜索，但是es官方没有提供node_modules的默认搜索。这是因为浏览器需要http加载资源，如果node_modules中引入的资源还有依赖，那么浏览器就会继续发送请求资源，影响浏览器的使用性能。**（具体说明看Vite的依赖预构建）**
* **有vite的使用**可以解决上述问题，vite启动的服务可以在服务端就处理好资源（浏览器识别的代码）

安装vite

```js
yarn add vite
```

// 配置启动脚本

```js
// package.json
"script": {
    "dev": "vite"
}
```

## 五、vite的依赖预构建

### 5.1 开发环境

Vite 将会使用 esbuild 预构建依赖。（esbuild是对js语法进行处理的一个库）

#### 5.1.1 导入三方库lodash

 vite 在处理的过程中如果看到有非绝对路径或相对路径的引用，则会尝试开启路径补全；
 寻找依赖的过程是自当前目录依次向上查找的过程，直到根目录或找到对应目录为止
如下所示

```js
// lodash中可能也import了其他的包
import _ from 'lodash'
```

经过vite处理后

```js
// 浏览器资源加载中的写法
import _ from '/node_modules/.vite/deps/lodash.js?v=ebe557916'
```

#### 5.1.2 yarn dev

每次依赖预构建时，重新构建的相对路径都是正确的

#### 5.1.3 vite考虑的问题

有的包是common.js规范导出（module.exports）,引入的包无法约束，所有就有了**依赖预构建**

*依赖预构建的过程如下说明：*

1. 首先vite会找到对应的依赖，
2. 然后调用esbuild将其他规范的代码转换为esm规范的代码，
3. 然后放到当前目录下的node_modules/.vite/deps，同时对esm规范对各个模块进行统一集成

*依赖预构建解决了3个问题*

1. 不同的第三方包会有不同的导出格式（也就是vite没办法约束人家的地方）
2. 对路径的处理，路径补全可以直接到node_modules/.vite/deps下补全
3. 网络多包传输的性能问题**（四、vite新建项目初体验中无vite构建的项目遇到的问题）**

*总结：*
有了依赖预构建后，无论多少额外的export和Import,vite都会尽可能的将他们集成最后只生成一个或几个模块，减少网络传输中包的数量

### 5.2 生产环境

vite会全权交给rollup的库去完成生产包的构建（兼容很多场景很多模块）

### 5.3 vite.config.js

// 网络多包传输的性能问题的验证，不进行依赖预构建，浏览器会递加载其下的依赖

```js
export default {
    optimizeDeps: {
        exclude: ['lodash-es'], // 当前遇到lodash-es这个依赖的时候不进行依赖预构建
    }
}
```
