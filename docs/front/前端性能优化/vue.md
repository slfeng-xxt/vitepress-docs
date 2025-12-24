# vue性能优化

## 1. 常见的性能优化分析方式

### 1.1 用于生产部署的负载性能分析

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://webpagetest.org/)

### 1.2 用于本地开发期间的性能分析

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance?hl=zh-cn)
- [app.config.performance](https://cn.vuejs.org/api/application#app-config-performance)将会开启 Vue 特有的性能标记，标记在 Chrome 开发者工具的性能时间线上。
- [vue开发扩展](https://cn.vuejs.org/guide/scaling-up/tooling#browser-devtools)

## 2. 页面加载优化

### 2.1 代码分割

:::tip
代码分割是指构建工具将构建后的 JavaScript 包拆分为多个较小的，可以按需或并行加载的文件。通过适当的代码分割，页面加载时需要的功能可以立即下载，而额外的块只在需要时才加载，从而提高性能。
:::

- 像 Rollup (Vite 就是基于它之上开发的) 或者 webpack 这样的打包工具可以通过分析 ESM 动态导入的语法来自动进行代码分割：

```js
// 使用动态导入语法
import('./module').then((module) => {
  // 使用模块
})
```

- Vue 的异步组件也可以实现代码分割 defineAsyncComponent

```js
import { defineAsyncComponent } from 'vue'

// 使用 defineAsyncComponent 定义异步组件,并传入一个返回 Promise 的函数,该函数返回一个组件
const AsyncComponent = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)
```

### 2.2 包体积优化（tree-shaking）

:::tip
Tree-shaking 是一种通过静态分析代码，移除未使用的代码（如未使用的函数、变量、模块等）来减小包体积的技术。它可以在构建过程中自动进行，从而减少最终生成的 JavaScript 文件的大小。
:::

- 尽可能地采用构建步骤
  - 如果使用的是相对现代的打包工具，许多 Vue 的 API 都是可以被 tree-shake 的。举例来说，如果你根本没有使用到内置的 `<Transition>`组件，它将不会被打包进入最终的产物里。Tree-shaking 也可以移除你源代码中其他未使用到的模块。
  - 当使用了构建步骤时，模板会被预编译，因此我们无须在浏览器中载入 Vue 编译器。这在同样最小化加上 gzip 优化下会相对缩小 14kb 并避免运行时的编译开销。
- 在引入新的依赖项时要小心包体积膨胀！在现实的应用中，包体积膨胀通常因为无意识地引入了过重的依赖导致的。
  - 如果使用了构建步骤，应当尽量选择提供 ES 模块格式的依赖，它们对 tree-shaking 更友好。举例来说，选择 lodash-es 比 lodash 更好。
  - 查看依赖的体积，并评估与其所提供的功能之间的性价比。如果依赖对 tree-shaking 友好，实际增加的体积大小将取决于你从它之中导入的 API。像 bundlejs.com 这样的工具可以用来做快速的检查，但是根据实际的构建设置来评估总是最准确的。

### 2.3 选择正确的架构

:::tip
如果你的用例对页面加载性能很敏感，请避免将其部署为纯客户端的 SPA，而是让服务器直接发送包含用户想要查看的内容的 HTML 代码。纯客户端渲染存在首屏加载缓慢的问题，这可以通过服务器端渲染 (SSR) 或静态站点生成 (SSG) 来缓解。如果应用对交互性要求不高，你还可以使用传统的后端服务器来渲染 HTML，并在客户端使用 Vue 对其进行增强。
如果你的主应用必须是 SPA，但还有其他的营销相关页面 (落地页、关于页、博客等)，请单独部署这些页面！理想情况下，营销页面应该是包含尽可能少 JS 的静态 HTML，并用 SSG 方式部署。
:::

## 3. 更新优化

### 3.1 v-if 和 v-show

- v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
- v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
- v-show 只是简单地切换元素的 CSS 属性 display。

### 3.2 Props稳定性

#### 3.2.1 基本使用

- 父组件传递给子组件的props，子组件内部不要修改props的值，否则会报错。
- 如果需要修改，可以通过data或者computed来处理。
- 如果是数组或者对象，可以通过深拷贝来处理。
- 如果是基本数据类型，可以通过Object.freeze来处理。

#### 3.2.2 触发更新的时机

在 Vue 之中，一个子组件只会在其至少一个 props 改变时才会更新。如果传入的 props 没有改变，那么子组件就不会重新渲染。

```vue
<template>
<!-- 如果 activeId 变化时，list所有的Item都会触发更新 -->
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
</template>
```

```vue
<template>
<!-- 优化后，只有 item.id === activeId 的 item 才会触发更新  -->
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="itme.id === activeId" />
  </template>
```

### 3.3 v-once

:::tip
v-once 指令用于标记元素或组件，使其只渲染一次。这意味着即使其依赖项发生变化，该元素或组件也不会重新渲染。这可以用于优化性能，特别是在渲染大量静态内容时。
:::

### 3.4 v-memo

:::tip
v-memo 是 Vue 3.2 中引入的一个新指令，用于优化渲染性能。它允许开发者指定一个缓存键，当依赖项发生变化时，只有当缓存键发生变化时，才会重新渲染元素或组件。这可以减少不必要的渲染，提高性能。
:::

```vue
<template>
<!-- 优化后，只有当 item.id 变化时，ListItem 才会重新渲染 -->
<ListItem
  v-for="item in list"
  :id="item.id"
  :key="item.id"
  v-memo="[item.id]" />
  </template>
```

## 4. 通用优化

### 4.1 虚拟滚动

:::tip
虚拟滚动是一种优化技术，用于在渲染大量数据时提高性能。它通过只渲染可视区域内的元素，而不是渲染整个数据集，从而减少 DOM 操作和内存使用。虚拟滚动特别适用于长列表或表格等场景。

根据可视区的高度以及items中每一项的高度(itemSize，可为高度或者是横向滑动的宽度)来决定页面展示多少个item，能显示的item包装后放到了pool数组中进行渲染，页面滚动的时候动态的修改pool数组。为了在滚动的时候尽可能的减少开销，pool中超出范围的view会回收到复用池，pool中新增的view会优先从复用池中取出view，如果没有复用的才会新增。
:::

#### 4.1.1 原理

#### 4.1.2 页面中数据流动

为了达到动态渲染和dom复用的目的，三个存放对应item的池子是必不可少的，分别是：

- 可视区域内的item池(pool)：当前页面显示得视图池，存储当前页面要渲染得数据，即pool是tempalte中渲染真实使用到的；
- $_views：和pool对应，每一次addView新增一个视图得时候，除了要把视图放到pool中，还要放一份到views中。当页面滚动得时候，会取范围在startIndex和endIndex之间得view，每个view先去views中找，这样比在pool中遍历效率要高，如果找到了说明当前view一直在可视区内，这个时候直接显示复用views中得即可。如果在views中没找到，说明是新增得view，则先去复用池中根据type找，找到则复用，找不到则addView新增，新增之后views中也要加进去；
- $_recycle：复用池，当页面滚动的时候，超出startIndex和endIndex范围得view会先放到复用池中，当页面继续滚动，又需要新增view的时候，会先去复用池中找，如果找到了则直接复用，找不到则新增。

#### 4.1.3 数据初始化

### 4.2 减少大型不可变数据的响应性开销

:::tip
在 Vue 3 中，响应性系统是基于 Proxy 实现的，这意味着它能够自动追踪依赖关系并在数据发生变化时触发更新。然而，对于大型不可变数据，频繁的响应性开销可能会成为性能瓶颈。

为了解决这个问题，可以使用 Vue 的 `shallowRef` 或 `shallowReactive` 来创建浅层响应性对象。这些对象只跟踪其第一层属性的响应性，而不会递归地跟踪嵌套对象的响应性。这样可以减少响应性开销，但需要注意的是，浅层响应性对象不会自动更新嵌套属性的响应性。
:::

### 4.3 避免不必要的组件抽象

:::tip
在 Vue 中，组件是构建用户界面的基本单位。然而，过度抽象组件可能会导致性能问题。例如，如果一个组件只包含一个简单的文本节点，那么将其封装在一个单独的组件中可能会引入不必要的开销。

为了优化性能，应该尽量保持组件的简洁性，避免不必要的抽象。如果需要将多个元素组合在一起，可以使用模板中的 `<template>` 元素，而不是创建一个新的组件。

此外，还可以使用 Vue 的 `v-once` 指令来标记那些不需要更新的静态内容，从而避免不必要的渲染。
:::
