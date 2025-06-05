# Vue2 源码解析

- 版本： 2.7.16
- 地址： <https://github.com/vuejs/vue/tree/v2.7.16>

## 1. 目录结构

vue 2.7.16 版本的目录解析说明

```js
├── benchmarks/             # 性能测试
├── compiler-sfc/           # 单文件组件解析
├── dist/                   # 构建后文件的输出目录
├── examples/               # 示例
├── packages/               # 其他独立包
├── scripts/                # 构建相关
├── src/
    ├── compiler/           # 编译器
    ├── core/               # 核心代码
    ├── platforms/          # 不同平台的支持
    ├── shared/             # 共享代码
    ├── types/              # TypeScript 类型定义
    ├── v3/                 # Vue 3 相关代码
├── test/                   #  测试代码
├── types/                  # TypeScript 类型定义
```

## 2. 类型管理

Flow和TypeScript是两种不同的类型检查工具，Vue 2 使用了 Flow 来进行类型检查，而 Vue 3 则使用了 TypeScript。

- Flow 是一个 JavaScript 的类型检查工具，它可以在不修改代码的情况下，对代码进行类型检查，从而发现潜在的错误。[官方文档](https://flow.org/en/docs/types/)
- TypeScript 是一个 JavaScript 的超集，它添加了类型系统和其他一些特性，可以让开发者更方便地进行类型检查和代码提示。

## 3. 构建工具

Vue 2 使用了 Rollup 作为构建工具，Rollup 是一个 JavaScript 模块打包器，可以将多个模块打包成一个或多个文件。Vue 2 的构建过程包括以下几个步骤：

1. 使用 Rollup 将源代码打包成一个或多个文件。
2. 使用 Babel 将 ES6 代码转换为 ES5 代码，以便在旧版本的浏览器中运行。
3. 使用 UglifyJS 压缩代码，以减小文件大小。

## 4. 编译器

Vue 2 的编译器负责将模板编译为渲染函数，渲染函数是 Vue 2 中用于生成虚拟 DOM 的函数。Vue 2 的编译器分为两个部分：模板编译器和渲染函数生成器。

### 4.1 模板编译器

模板编译器将模板字符串解析为抽象语法树（AST），然后根据 AST 生成渲染函数。Vue 2 的模板编译器使用正则表达式来解析模板字符串，然后将解析结果转换为 AST。

```js
// 模板编译器示例
const template = `<div>{{ message }}</div>`;
const ast = compiler.compile(template);
```

### 4.2 渲染函数生成器

渲染函数生成器将 AST 转换为渲染函数。Vue 2 的渲染函数生成器使用 JavaScript 代码生成器来生成渲染函数的代码。

```js
// 渲染函数生成器示例
const render = createRenderer(ast);
```

### 4.3 渲染函数

渲染函数是 Vue 2 中用于生成虚拟 DOM 的函数。Vue 2 的渲染函数使用 JavaScript 代码来生成虚拟 DOM，然后将虚拟 DOM 渲染为真实 DOM。

```js
// 渲染函数示例
function render() {
  return h('div', { class: 'container' }, [
    h('h1', 'Hello, Vue 2!'),
    h('p', 'This is a paragraph.'),
  ]);
}
```

## 5. 渲染器

Vue 2 的渲染器负责将虚拟 DOM 渲染为真实 DOM。Vue 2 的渲染器使用 JavaScript 代码来生成虚拟 DOM，然后将虚拟 DOM 渲染为真实 DOM。

```js
// 渲染器示例
function render(vnode, container) {
  // 创建真实 DOM
  const el = document.createElement(vnode.tag);
  // 设置属性
  for (let key in vnode.attrs) {
    el.setAttribute(key, vnode.attrs[key]);
  }
  // 设置子节点
  if (vnode.children) {
    vnode.children.forEach((child) => {
      render(child, el);
    });
  }
  // 将真实 DOM 添加到容器中
  container.appendChild(el);
}
```

## 6. 数据驱动

Vue 2 是一个数据驱动的框架，它的核心思想是将数据的变化映射到视图的变化上。Vue 2 使用了响应式系统来实现数据驱动，响应式系统可以自动追踪数据的变化，并在数据发生变化时更新视图。

```js
// 数据驱动示例
const vm = new Vue({
  data: {
    message: 'Hello, Vue 2!',
  },
  template: '<div>{{ message }}</div>',
});
```

### 6.1 响应式系统（重点）

Vue 2 的响应式系统使用 Object.defineProperty 来实现数据的响应式。当数据发生变化时，Vue 2 会触发相应的更新函数，从而更新视图。

```js
// 响应式系统示例
const data = {};
Object.defineProperty(data, 'message', {
  get() {
    console.log('get message'); // 当获取 message 属性时，触发 get 函数
    return 'Hello, Vue 2!';
  },
  set(newValue) {
    console.log('set message', newValue); // 当设置 message 属性时，触发 set 函数
  },
});
```

## 7. vue实例化

### 7.1 new Vue的过程

Vue 2 的实例化过程包括以下几个步骤：

合并配置,初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等，最后调用 mounted 钩子函数。

```js
// new Vue 的过程
function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  // 合并配置
  const vm = this;
  vm.$options = mergeOptions(vm.constructor.options, options);

  // 初始化生命周期
  initLifecycle(vm);

  // 初始化事件中心
  initEvents(vm);

  // 初始化渲染
  initRender(vm);

  // 初始化 data、props、computed、watcher 等
  initState(vm);

  // 调用 mounted 钩子函数
  if (vm.$options.mounted) {
    vm.$options.mounted.call(vm);
  }
};
```

### 7.2 vue实例挂载的实现

Vue 2 的挂载过程包括以下几个步骤：

1. 调用 mountComponent 函数，创建一个渲染 watcher，用于监听数据的变化并更新视图。
2. 调用 render 函数，生成虚拟 DOM。
3. 调用 updateComponent 函数，将虚拟 DOM 渲染为真实 DOM。

```js
// 挂载过程
function mountComponent(vm, el) {
  // 创建一个渲染 watcher
  new Watcher(vm, updateComponent);

  // 调用 render 函数，生成虚拟 DOM
  function updateComponent() {
    const vnode = vm.$options.render.call(vm);

    // 将虚拟 DOM 渲染为真实 DOM
    vm.$el = patch(vm.$el, vnode);
  }
}
```

### 7.3 render函数的实现过程

目的：生成虚拟 DOM

```js
Vue.prototype._render = function () {
  const vm = this;
  const { render } = vm.$options;

  // 调用 render 函数，生成虚拟 DOM
  const vnode = render.call(vm);

  return vnode;
}
```

### 7.4 patch函数的实现过程

目的： 将虚拟 DOM 转换为真实 DOM

```js
function patch(oldVnode, vnode) {
  // 如果 oldVnode 不存在，说明是首次渲染，直接创建真实 DOM
  if (!oldVnode) {
    return createElm(vnode);
  }

  // 如果 oldVnode 和 vnode 相同，说明不需要更新，直接返回
  if (oldVnode === vnode) {
    return oldVnode;
  }

  // 如果 oldVnode 和 vnode 不同，说明需要更新，调用 updateElm 函数进行更新
  return updateElm(oldVnode, vnode);
}

function createElm(vnode) {
  // 创建真实 DOM
  const el = document.createElement(vnode.tag);

  // 设置属性
  for (let key in vnode.attrs) {
    el.setAttribute(key, vnode.attrs[key]);
  }

  // 设置子节点
  if (vnode.children) {
    vnode.children.forEach((child) => {
      el.appendChild(createElm(child));
    });
  }

  return el;
}

function updateElm(oldVnode, vnode) {
  // 更新属性
  for (let key in vnode.attrs) {
    el.setAttribute(key, vnode.attrs[key]);
  }

  // 更新子节点
  if (vnode.children) {
    vnode.children.forEach((child, index) => {
      const oldChild = oldVnode.children[index];
      if (oldChild) {
        updateElm(oldChild, child);
      } else {
        el.appendChild(createElm(child));
      }
    });
  }
}
```

### 7.5 数据响应式变化后的更新过程

目的：当数据发生变化时，触发更新函数，从而更新视图。继续调用 updateComponent 函数，将虚拟 DOM 渲染为真实 DOM。[跳转到7.2](#72-vue实例挂载的实现)

```js
function updateComponent() {
  const vm = this;
  const { render } = vm.$options;

  // 调用 render 函数，生成虚拟 DOM
  const vnode = render.call(vm);

  // 将虚拟 DOM 渲染为真实 DOM
  vm.$el = patch(vm.$el, vnode);
}
```

## 8. diff算法

Vue 2 的 diff 算法用于比较新旧虚拟 DOM，找出需要更新的节点，从而提高渲染性能。Vue 2 的 diff 算法使用双指针的方式，从两端开始比较，如果节点相同，则直接跳过，如果节点不同，则根据节点的类型进行不同的处理。

具体步骤：

## 9. 总结

Vue 2 的核心思想是将数据的变化映射到视图的变化上，它使用模板编译器将模板字符串编译为渲染函数，然后使用渲染函数生成虚拟 DOM，最后使用渲染器将虚拟 DOM 渲染为真实 DOM。Vue 2 的响应式系统使用 Object.defineProperty 来实现数据的响应式，当数据发生变化时，Vue 2 会触发相应的更新函数，从而更新视图。Vue 2 的实例化过程包括合并配置、初始化生命周期、初始化事件中心、初始化渲染、初始化 data、props、computed、watcher 等，最后调用 mounted 钩子函数。Vue 2 的挂载过程包括创建一个渲染 watcher、调用 render 函数、调用 updateComponent 函数等。
