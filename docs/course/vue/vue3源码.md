# vue3源码解析

- 版本： v3.2.29
- 地址： <https://github.com/vuejs/core>

## 1. 源码目录结构

```js
├── benchmarks/ # 性能测试
├── dist/ # 构建后文件
├── examples/ # 示例
├── packages/ # 子包
    |── compiler-core/ # 编译核心
    |── compiler-dom/ # 编译dom
    |── compiler-sfc/ # 编译sfc
    |── reactivity/ # 响应式
    |── runtime-core/ # 运行时核心
    |── runtime-dom/ # 运行时dom
    |── runtime-test/ # 运行时测试
    |── server-renderer/ # 服务器渲染
    |── shared/ # 共享
    |── template-explorer/ # 模板探索
    |── vue/ # vue入口
├── scripts/ # 脚本
├── src/ # 源码
├── test/ # 单元测试
├── types/ # 类型定义
├── .github/ # github相关
├── .gitignore # git忽略
├── LICENSE # 版权
├── README.md # 说明
├── babel.config.js # babel配置
├── package.json # 依赖
├── tsconfig.json # ts配置
└── yarn.lock # yarn锁
```

## 2. compiler-core

### 2.1. 编译核心

- `@vue/compiler-core` 是 Vue 的编译核心，它负责将模板编译为渲染函数。
- 它不依赖于具体的平台，因此可以在任何支持 JavaScript 的环境中使用。
- 它可以处理 Vue 模板中的所有指令和特殊语法，包括条件渲染、列表渲染、事件绑定、插槽等。
- 它还支持自定义指令和过滤器，以及动态组件和异步组件。
- 它还支持模板的预编译，可以将模板编译为渲染函数，从而提高运行时的性能。

### 2.2. 编译过程(和vue2相同)

- 模板解析：将模板字符串解析为抽象语法树（AST）。
- AST 转换：对 AST 进行转换，包括添加静态属性、处理指令、处理插槽等。
- 代码生成：将转换后的 AST 生成渲染函数的代码。

```js
// src/index.ts
export { baseCompile } from "./compile";

// src/compiler.ts
import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformExpression } from "./transforms/transformExpression";
import { transformElement } from "./transforms/transformElement";
import { transformText } from "./transforms/transformText";

export function baseCompile(template, options) {
  // 1. 先把 template 也就是字符串 parse 成 ast
  const ast = baseParse(template);
  // 2. 给 ast 加点料（- -#）
  transform(
    ast,
    Object.assign(options, {
      nodeTransforms: [transformElement, transformText, transformExpression],
    })
  );
  
  // 3. 生成 render 函数代码
  return generate(ast);
}
```

## 3. reactivity

- `@vue/reactivity` 是 Vue 的响应式系统，它负责将数据转换为响应式数据，并在数据发生变化时通知相关的组件进行更新。
- 它使用 Proxy 对象来实现响应式数据，Proxy 对象可以拦截对数据的读写操作，并在操作发生时触发相应的回调函数。
- 它还支持计算属性、侦听器、异步更新队列等功能。
- 它还支持在 Vue 组件中使用响应式数据，当数据发生变化时，组件会自动重新渲染。

### 3.1 响应式原理

- Vue 3 的响应式系统基于 Proxy 对象实现，Proxy 对象可以拦截对数据的读写操作，并在操作发生时触发相应的回调函数。
- 当数据发生变化时，Vue 会自动通知相关的组件进行更新，从而实现数据的响应式。

### 3.2 响应式 API

- `reactive`：将一个对象转换为响应式对象。
- `ref`：将一个值转换为响应式对象。
- `computed`：创建一个计算属性。
- `watch`：侦听数据的变化。
- `watchEffect`：侦听数据的变化，并执行相应的回调函数。

#### 3.2.1 reactive

```js
// src/reactive.ts
export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

function createReactiveObject(target, baseHandlers) {
  // 1. 先判断是不是对象
  if (!isObject(target)) {
    return target;
  }
  // 2. 再判断是不是响应式对象
  const existingProxy = targetMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // 3. 创建响应式对象
  const proxy = new Proxy(target, baseHandlers);
  // 4. 缓存起来
  targetMap.set(target, proxy);
  return proxy;
}
```

#### 3.2.2 ref

```js
// ref.ts
export function ref(value) {
  return createRef(value);
}

function createRef(rawValue) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, _shallow);
}
class RefImpl {
  private _value: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;

  constructor(value: T, public readonly _shallow: boolean) {
    this._value = _shallow ? value : toReactive(value);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    const useDirectValue = this._shallow || isShallow(newVal);
    newVal = useDirectValue ? newVal : toReactive(newVal);
    if (hasChanged(newVal, this._value)) {
      this._value = newVal;
      triggerRefValue(this, newVal);
    }
  }
}
```

### 3.2 reactive和ref的区别

- `reactive` 是将一个对象转换为响应式对象，而 `ref` 是将一个值转换为响应式对象。
- `reactive` 返回的是一个 Proxy 对象，而 `ref` 返回的是一个 Ref 对象。
- `reactive` 的值是深层次的响应式，而 `ref` 的值是浅层次的响应式。
- `reactive` 的值可以通过 `obj.prop` 的方式访问，而 `ref` 的值需要通过 `obj.value` 的方式访问。

## 4. runtime-core

- `@vue/runtime-core` 是 Vue 的运行时核心，它负责将渲染函数转换为虚拟 DOM，并渲染到页面上。
- 它不依赖于具体的平台，因此可以在任何支持 JavaScript 的环境中使用。
- 它可以处理 Vue 组件的生命周期、事件、插槽等。
- 它还支持自定义指令和过滤器，以及动态组件和异步组件。
- 它还支持在 Vue 组件中使用响应式数据，当数据发生变化时，组件会自动重新渲染。

### 4.1 始化流程(TODO)

### 4.2 更新流程(TODO)

## 5. runtime-dom

- `@vue/runtime-dom` 是 Vue 的运行时 DOM，它负责将虚拟 DOM 转换为真实的 DOM，并处理 DOM 的事件和生命周期。
- 它依赖于具体的平台，因此只能在浏览器环境中使用。
- 它可以处理 DOM 的事件、生命周期、样式等。

## 6. 总结

- `@vue/compiler-core` 是 Vue 的编译核心，它负责将模板编译为渲染函数。
- `@vue/reactivity` 是 Vue 的响应式系统，它负责将数据转换为响应式数据，并在数据发生变化时通知相关的组件进行更新。
- `@vue/runtime-core` 是 Vue 的运行时核心，它负责将渲染函数转换为虚拟 DOM，并渲染到页面上。
- `@vue/runtime-dom` 是 Vue 的运行时 DOM，它负责将虚拟 DOM 转换为真实的 DOM，并处理 DOM 的事件和生命周期。

## 7. vue3中的diff相比较于vue2的diff做了哪些优化

- Vue 3 的 diff 算法相比 Vue 2 的 diff 算法进行了优化，主要表现在以下几个方面：

1. 静态标记 + 非全量 Diff：（Vue 3在创建虚拟DOM树的时候，会根据DOM中的内容会不会发生变化，添加一个静态标记。之后在与上次虚拟节点进行对比的时候，就只会对比这些带有静态标记的节点。）；

2. 使用最长递增子序列优化对比流程，可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作；
