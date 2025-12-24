# vue3源码解析

- 版本： v3.2.29
- 地址： <https://github.com/vuejs/core>
- 源码解析文档参考： <https://vue3js.cn/start/>

:::tip
“人与人之间的差距不是来自年龄，甚至不是来自经验，而是来自经验总结、反思和升华的能力”

尽可能用自己的话把新学的知识写出来
:::

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

:::tip
reactive用于将一个引用类型数据声明为响应式数据，返回的是一个Proxy对象。(只接受引用类型数据,基本类型会原样返回并产生警告.)

reactive 实现响应式就是基于ES6 Proxy 实现的。

reactive默认是深层响应式，并且watch的监听是默认开启深度监听的
:::

```js
// src/reactive.ts
export function reactive(raw) {
  return createReactiveObject(raw, false, mutableHandlers);
}

function createReactiveObject(target, isReadonly, baseHandlers) {
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

- **只接受对象类型，否则直接返回**

```js
const raw = {a: 1}
const num = reactive(1);
const obj = reactive(raw)
console.log(num) // 1
console.log(obj) // Proxy {a: 1}
```

- **会丢失响应式的几个操作**

1.对象引用发生变化

```js
const obj = reactive({a: 1})
obj = {a: 2} // 不会触发响应式
```

2.解构

```js
const obj = reactive({a: 1})
const {a} = obj
a = 2 // 不会触发响应式
```

- **shallowReactive**

shallowReactive也是用于声明一个浅层的响应式对象，用于性能优化处理

```js
const obj = shallowReactive({a: 1, b: {c: 2}})
obj.a = 2 // 触发响应式
obj.b.c = 2 // 不会触发响应式
```

#### 3.2.2 ref

:::tip
ref接受任意类型值，返回响应式对象，通过.value访问

ref默认提供深层响应式，也就是说即使我们修改嵌套的引用类型数据，vue也能够检测到并触发页面更新

watch函数如果监听的是ref定义的引用类型数据，默认是不会开启深度监听的,我们需要手动开启深度监听
:::

```js
//reactive.ts
export const toReactive = (value) => isObject(value) ? reactive(value) : value;
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

- **shallowRef**

```txt
由于ref默认是深层响应式，但有时候我们为了性能考虑，也可以通过 shallowRef 来放弃深层响应性。对于浅层 ref，只有 .value 的访问会被追踪。

修改属性值，虽然数据变化了，但是页面并不会更新，并且无法通过watch监听数据变化。
```

- **triggerRef**

```txt
当一个浅层ref的属性值发生改变又想触发页面更新时，可以手动调用triggerRef来实现
```

```js
const count = shallowRef(0);
watchEffect(() => {
  console.log(count.value);
})
count.value++;
triggerRef(count);
```

- **customRef**

```txt
customRef 是一个工厂函数，可以用来创建一个自定义的 ref，它接受一个工厂函数，该函数接收 track 和 trigger 两个参数，并返回一个带有 get 和 set 方法的对象。

在 get 方法中，我们可以手动调用 track 函数来追踪依赖，在 set 方法中，我们可以手动调用 trigger 函数来触发更新。
```

```js
const myRef = customRef((track, trigger) => {
  let value = 0;
  return {
    get() {
      track();
      return value;
    },
    set(newValue) {
      value = newValue;
      trigger();
    }
  };
})
console.log(myRef.value); // 0
```

#### 3.2.3 readonly

```js
export function readonly(raw) {
  return createReactiveObject(raw, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
```

```js
// readonly应用场景，例如：父组件传递给子组件的数据，子组件不允许修改
const state = readonly({
  count: 0
})
state.count++; // 报错
```

### 3.3 reactive和ref的区别

| 特性       | ref           | reactive       |
| ---------- | ------------- | -------------- |
| 接受类型   | 任意类型       | 仅对象类型     |
| 访问方式   | 通过.value访问 | 直接访问属性   |
| 模板解包   | 自动解包(无需.value) | 无需解包       |
| 深层响应   | 默认支持       | 默认支持       |
| 性能优化   | shallowRef    | shallowReactive |
| watch       | 对于引用类型，watch默认不会开启深度监听 | 默认开启深度监听 |
| 引用替换   | 保持响应(.value=新引用) | 完全丢失响应   |
| 解构处理   | 需保持.value引用 | 需配合toRefs   |
| 适用场景   | 基本类型、组件模板引用、跨函数传递 | 复杂对象、状态管理、局部状态 |

### 3.4 toRefs

- `toRefs` 是将一个响应式对象的每个属性都转换为 `ref`，并返回一个新的对象。
- 它可以用于将响应式对象的属性解构出来，同时保持响应式。
- 它可以用于将响应式对象的属性传递给子组件，同时保持响应式。

### 3.5 toRef

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

## 8.学习mini-vue

:::warning
不发生真正改变的学习都是无效的学习。懂得百点不如改变一点。凡事都以改变为标准去做

把阅读设想为和一个智者对话，而不是把阅读想象为学习知识。

“现代社会，人人都在学知识，但我时常问自己：学习知识到底是为了什么？现在似乎有了一个新的答案：知识可以让我们更好地审视自己和感知世界。有了感知，我们便能更好地定位和应对。”
:::

实现最简 vue3 模型，用于深入学习 vue3， 让你更轻松的理解 vue3 的核心逻辑

- [mini-vue](https://github.com/cuixiaorui/mini-vue?tab=readme-ov-file)
- [petite-vue](https://github.com/vuejs/petite-vue)
