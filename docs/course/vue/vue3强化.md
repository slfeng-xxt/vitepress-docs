# vue3强化

## 10. vue3 的效率提升主要在哪些方面？

### 10.1 静态提升

#### 静态节点会被提升

- 元素节点（指没有绑定动态属性的元素标签）例如：`<img src="logo.png" />`
- 没有绑定动态内容（指没有绑定动态内容的文本节点）例如：`<div>hello world</div>`

```js
// vue3的渲染函数
const hoisted = /*#__PURE__*/ createVNode("div", null, "hello world");
function render(ctx, cache) {
  return createVNode("div", null, [hoisted, "static content"]);
}
```

#### 静态属性会被提升

例如：`<div class="foo" id="bar"></div>`，`class` 和 `id` 属性会被提升到渲染函数之外，这样在每次渲染时就不需要重新创建这些属性。

```js
// vue3的渲染函数
const hoisted = { class: "foo", id: "bar" };
function render(ctx, cache) {
  return createVNode("div", hoisted, "static content");
}
```

### 10.2 预字符串化

对于包含大量连续的静态内容的模板，Vue3 会自动将它们预字符串化，从而减少渲染函数的复杂度，提高渲染性能。

```vue
<template>
  <div>
    <p>这是一段静态内容。</p>
    <p>这是另一段静态内容。</p>
    <p>这是第三段静态内容。</p>
    <p>这是一段静态内容。</p>
    <p>这是另一段静态内容。</p>
    <p>这是第三段静态内容。</p>
    <p>这是一段静态内容。</p>
    <p>这是另一段静态内容。</p>
    <p>这是第三段静态内容。</p>
    <p>这是一段静态内容。</p>
    <p>这是另一段静态内容。</p>
    <p>这是第三段静态内容。</p>
  </div>
</template>
```

```js
// vue3的渲染函数预字符串化处理
const hoisted = _createStaticVNode(
  "<div> <p>这是一段静态内容。</p><p>这是另一段静态内容。</p><p>这是第三段静态内容。</p><p>这是一段静态内容。</p><p>这是另一段静态内容。</p><p>这是第三段静态内容。</p><p>这是一段静态内容。</p> <p>这是另一段静态内容。</p></div>"
);
```

### 10.3 缓存事件处理函数

对于事件处理函数，Vue3 会自动缓存它们，从而避免在每次渲染时都重新创建这些函数，提高性能。

```vue
<template>
  <button @click="onClick">Click me</button>
</template>

<script>
export default {
  methods: {
    onClick: () => {
      console.log("Button clicked");
    },
  },
};
</script>
```

```js
// vue3的渲染函数
function render(ctx, cache) {
  const onClick =
    cache[0] ||
    (cache[0] = () => {
      console.log("Button clicked");
    });
  return createVNode("button", { onClick }, "Click me");
}
```

### 10.4 block tree

Vue3 引入了 block tree 的概念，它是一种树形结构，用于描述模板中的动态内容。通过 block tree，Vue3 可以更高效地识别和更新模板中的动态内容，从而提高渲染性能。

例如，对于以下模板：

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count }}</p>
  </div>
</template>
```

Vue3 会将其转换为以下 block tree：

```js
// vue3的block tree用来记录模板中的动态内容
const blockTree = {
  type: "div",
  children: [
    {
      type: "p",
      children: [
        {
          type: "text",
          content: "{{ message }}",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          type: "text",
          content: "{{ count }}",
        },
      ],
    },
  ],
};
```

通过 block tree，Vue3 可以更高效地识别和更新模板中的动态内容，从而提高渲染性能。

### 10.5 patchFlag

Vue3 引入了 patchFlag 的概念，它是一种标记，用于标识模板中的动态内容。通过 patchFlag，Vue3 可以更高效地识别和更新模板中的动态内容，从而提高渲染性能。

例如，对于以下模板：

```vue
<template>
  <div>
    <p>message</p>
    <p>{{ count }}</p>
  </div>
</template>
```

Vue3 会将其转换为以下 patchFlag：

```js
// vue3的patchFlag用来记录模板中的动态内容
const patchFlag = {
  type: "div",
  children: [
    {
      type: "p",
      children: [
        {
          type: "text",
          content: "message",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          type: "text",
          content: "{{ count }}",
          patchFlag: 1, // 表示这是一个动态内容
        },
      ],
    },
  ],
};
```

## 11. Vue3 去掉了 Vue 构造函数

- Vue3 去掉了 Vue 构造函数，而是使用 createApp 函数来创建**应用实例**。这样做的好处是，可以更灵活地创建和管理应用实例，并且可以更好地支持多实例应用。
- vue3 的 createApp 函数返回一个应用实例，该实例包含了一些常用的方法和属性，如 mount、unmount、provide、inject 等。避免了 Vue2 中全局配置的问题，使得代码更加模块化和可维护。

```txt
vue2:全局Vue构造函数的问题：
1. 全局配置：Vue2 中，Vue 构造函数的全局配置（静态方法）会影响所有实例，不利于隔离不同的应用
2. Vue 构造函数集成了很多功能，导致代码结构复杂，不利于tree shaking优化。
3. vue2没有把组件和应用实例分开，导致组件和全局配置混在一起，不利于代码维护和复用。

vue3: createApp 函数：
1. 灵活创建和管理应用实例：createApp 函数可以更灵活地创建和管理应用实例，使得代码更加模块化和可维护。
2. 代码结构更清晰：createApp 函数将组件和应用实例分开，使得代码结构更加清晰，易于理解和维护。
3. 更好的tree shaking优化：由于 Vue3 的代码结构更加模块化，可以更好地进行 tree shaking 优化，减少打包后的代码体积。
```

## 12. 组件实例中的 API

:::tip
和 vue2 一样
:::

vue3 中，组件实例是个 proxy 对象,包含很多属性和方法，如：

- [component instance](https://cn.vuejs.org/api/component-instance.html)

## 13. Vue3 的响应式

vue2 和 vue3 都在相同的生命周期完成数据响应式（beforCreate~created 之间完成）

### vue2 使用 Object.defineProperty 实现响应式

递归遍历对象，给对象的每个属性添加 getter 和 setter，当属性被访问或修改时，触发 getter 和 setter，从而实现响应式。

```txt
这样做的好处是可以监听对象的属性变化，但是也有一些缺点，比如无法监听对象的新增和删除操作，也无法监听数组的变化。所以新增了 $set 和 $delete 方法来手动触发响应式。
当对象属性很多的时候，递归遍历对象会消耗大量的性能。
```

### vue3 使用 Proxy 实现响应式

不用递归遍历对象，而是直接对整个对象进行代理，当访问对象的属性时，**才会触发** getter 和 setter，从而实现按需响应。极大提升了组件在初始化时的效率。

```txt
Proxy 可以监听对象的新增和删除操作，也可以监听数组的变化。
Proxy 的性能比 Object.defineProperty 好，因为 Proxy 只需要代理一次，而 Object.defineProperty 需要递归遍历对象。
```

响应式核心API:

| API | 传入 | 返回 | 备注 |
| --- | --- | --- | --- |
| reactive | plain-object | 代理对象 | 深度代理对象中的所有成员 |
| readonly | plain-object | 代理对象 | 只能读取代理对象中的成员，但不可修改 |
| ref | any | `{value: ...}` | 对value的访问是响应式的，如果value的值是个对象，那么就通过reactive函数进行代理，如果已经代理，则直接使用代理 |
| computed | function | `{value: ...}` | 当读取value的值的时候，会根据情况（内部响应数据是否发生改变）决定是否运行回调函数 |

### TODO: vue3下会造成响应式丢失的情况有哪些

## 14. 模版中的语法变化

### v-model

vue2中提供两种双向绑定的方式，`v-model` 和 `.sync`，vue3中只保留了 `v-model`，并且进行了优化。

```txt
vue3中的变化：
v-model 在组件上使用时，默认绑定的是 value 属性，可以通过 modelValue 属性来指定绑定的属性名。
v-model 在组件上使用时，默认触发 input 事件，可以通过 update:modelValue 事件来指定触发的事件名。
```

- v-model指令

```vue
<!-- vue2 -->
<child-component :value="title" @input="title = $event"></child-component>
<!-- 简写 -->
<child-component v-model="title"></child-component>

<!-- vue3 -->
<child-component :modelValue="title" @update:modelValue="title = $event"></child-component>
<!-- 简写 -->
<child-component v-model="title"></child-component>
```

- .sync修饰符废弃，使用 `v-model`的参数代替

```vue
<!-- vue2 -->
<child-component :title="title" @update:title="title = $event"></child-component>
<!-- 简写 -->
<child-component :title.sync="title"></child-component>

<!-- vue3 -->
<child-component :title="title" @update:title="title = $event"></child-component>
<!-- 简写 -->
<child-component v-model:title="title"></child-component>
```

- 自定义 `v-model`的修饰符

### v-if优先级高于v-for

### v-for/v-if的key属性

- 当template中同时使用v-for和v-if时，v-if的优先级高于v-for，因此v-if会先执行，导致v-for的key属性失效。
- 当template使用v-for时，需要将key放template标签上，而不是子元素上。
- 当使用v-if v-else-if v-else时，不在指定key属性。因为vue3会自动给每个分支添加唯一key。

## 15. 监听数据变化

:::tip
watch、watchEffect**回调触发时机**：

默认情况下，侦听器回调会在父组件更新 (如有) 之后、所属组件的 DOM 更新之前被调用。这意味着如果你尝试在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态

如果想在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM，你需要指明 flush: 'post' 选项; 后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`

你还可以创建一个同步触发的侦听器，它会在 Vue 进行任何更新之前触发：flush: 'sync'; 同步触发的 `watchEffect()` 有个更方便的别名 `watchSyncEffect()`
:::

### watchEffect

- `watchEffect` 函数会自动收集依赖，只要指定回调中用到的响应式属性发生了变化，就会重新执行回调。
- `watchEffect` 传入的回调函数会被立即执行一次，然后重新执行回调函数的返回值。
- `watchEffect` 返回值是一个用来停止该副作用的函数。

```vue
<template>
  <div>{{ count }}</div>
  <button @click="stopWatch">停止监听</button>
</template>

<script>
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const stopWatch = () => {
      stop();
    };
    const stop = watchEffect(() => {
      console.log(count.value);
    }); // 返回一个函数，调用该函数可以停止监听
    return {
      count,
      stopWatch,
    };
  },
};
</script>
```

### watch

:::tip
第一个参数是侦听器的源。这个来源可以是以下几种：

一个函数，返回一个值

一个 ref

一个响应式对象

...或是由以上类型的值组成的数组
:::

```js
// 侦听一个 getter 函数：
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)
// 侦听一个 ref：
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
// 侦听一个响应式对象：
const state = reactive({ count: 0 })
watch(
  () => state,
  (state, prevState) => {
    /* ... */
  }
)
// 侦听多个源：
watch(
  [() => state.count, () => state.name],
  ([newCount, newName], [oldCount, oldName]) => {
    /* ... */
  }) 
```

- `watch` 函数用来监听响应式数据的变化。
- `watch` 函数接收两个参数，第一个参数是要监听的数据，第二个参数是回调函数。回调函数接收两个参数，第一个参数是变化后的新值，第二个参数是变化前的旧值。
- `watch` 函数返回一个函数，调用该函数可以停止监听。

```vue
<template>
  <div>{{ count }}</div>
  <button @click="stopWatch">停止监听</button>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const stopWatch = () => {
      stop();
    };
    const stop = watch(count, (newVal, oldVal) => {
      console.log(newVal, oldVal);
    }); // 返回一个函数，调用该函数可以停止监听
    return {
      count,
      stopWatch,
    };
  },
}
</script>
```

### watch 和 watchEffect 的区别

- `watch` 函数监听的是具体的响应式数据，而 `watchEffect` 函数监听的是所有响应式数据的变化。
- `watch` 函数可以获取到变化前后的值，而 `watchEffect` 函数只能获取到变化后的值。

### watch 和 watchEffect 的使用场景

- 如果需要监听具体的响应式数据，可以使用 `watch` 函数。
- 如果需要监听所有响应式数据的变化，可以使用 `watchEffect` 函数。

## 16. setup

### setup 函数

:::tip
setup中为什么没有beforeCreate和created?

created之前做了哪些操作？数据响应化，而vue3中数据响应式是 ref,reactive 分离出来的功能，不包含在生命周期中，所以setup()中就没有beforeCreate和created
:::

- `setup` 函数是 Vue 3 中新增的一个函数，它是在组件创建之前执行的。
- `setup` 函数接收两个参数，第一个参数是 `props`，第二个参数是 `context`。
- `props` 是组件的属性，`context` 是一个对象，包含了组件的上下文信息。

## 17. 生命周期

- [composition api 生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html)
- [option api 生命周期钩子](https://cn.vuejs.org/api/options-lifecycle.html)

vue2中的生命周期和vue3中生命周期对比表格

| vue2 option Api | vue3 option Api| vue3 composition api |
| --- | --- | --- |
| beforeCreate | setup | setup |
| created | setup | setup |
| beforeMount | beforeMount | onBeforeMount |
| mounted | mounted | onMounted |
| beforeUpdate | beforeUpdate | onBeforeUpdate |
| updated | updated | onUpdated |
| beforeDestroy | **改** onBeforeUnmount | onBeforeUnmount |
| destroyed | **改** onUnmounted | onUnmounted |
| activated | activated | onActivated |
| deactivated | deactivated | onDeactivated |
| errorCaptured | errorCaptured | onErrorCaptured |
| - | **新** renderTracked | renderTracked |
| - | **新** renderTriggered | renderTriggered |

**renderTracked 和 renderTriggered 是 Vue 3 中新增的两个生命周期钩子，它们用于调试和性能优化。**

- `renderTracked`:在一个响应式依赖被组件的渲染作用追踪后调用。
- `renderTriggered`:在一个响应式依赖被组件的渲染作用触发后调用。
