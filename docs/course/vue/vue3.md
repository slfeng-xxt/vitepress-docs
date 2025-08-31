# vue3 新特性

:::warning
🔎观察小孩学走路感悟：1.只做刚需之事 2.没有期待之心

总结：少即是多，慢即是快，无欲则刚
:::

## 1. Composition API

### 1.1 什么是 Composition API

- Vue3.0 新增的一组 API，也叫组合 API（对比 Vue2.0 的 Options API）
- 使用 Composition API 可以将组件中相同功能的代码（如数据、方法等）进行分组、封装，提高代码可读性和可维护性

#### 1.1.1 组合形式的写法

```js
import { ref, reactive, toRefs } from "vue";

export default {
  setup(props, context) {
    // props: 接收父组件传递的属性 context: 上下文对象，包含组件的属性、方法、触发事件、暴露公共属性等
    console.log(context.attrs, context.emit, context.slots, context.expose);
    // 响应式状态
    const count = ref(0);
    const state = reactive({
      name: "张三",
      age: 18,
    });

    // 用来修改状态、触发更新的函数
    function increment() {
      count.value++;
    }

    // 生命周期钩子
    onMounted(() => {
      console.log(`The initial count is ${count.value}.`);
    });

    // 返回响应式状态和函数，供模板使用
    return {
      count,
      increment,
      ...toRefs(state),
    };
  },
};
```

setup 语法糖

```vue
<script setup>
import { ref, onMounted } from "vue";

// 响应式状态
const count = ref(0);

// 用来修改状态、触发更新的函数
function increment() {
  count.value++;
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

#### 1.1.2 Options API 与 Composition API

- Options API
  - 优点：对熟悉 Vue2 的开发者来说，Options API 的写法更加直观和易于理解
  - 缺点：当组件变得复杂时，Options API 中的代码会变得难以维护，因为相关功能的代码分散在各个选项中
  - 常用 API：data、methods、computed、watch、生命周期钩子等
- Composition API
  - 优点：可以将相关功能的代码组织在一起，提高代码的可读性和可维护性
  - 缺点：对于不熟悉 Composition API 的开发者来说，可能会觉得代码结构不够直观
  - 常用 API：ref、reactive、toRefs、computed、watch、watchEffect、生命周期钩子等

### 1.2 常用的 Composition API

- setup: 组件的入口函数，用于定义组件的逻辑
- ref：创建一个响应式数据(内部实现：使用了 reactive API)
- reactive：创建一个响应式对象
- shallowRef：创建一个浅层响应式数据
- toRefs：将响应式对象转换为普通对象，其中每个属性都是一个 ref
- computed：创建一个计算属性
- watch：创建一个侦听器(监听源：getter 函数、ref、reactive、数组)
- watchEffect：创建一个副作用侦听器（语法糖：watchPostEffect—— flush: 'post', watchSyncEffect —— flush: 'sync' ）
- watchPostEffect：创建一个在所有副作用完成后执行的侦听器
- watchSyncEffect：创建一个同步执行的侦听器
- onMounted：在组件挂载后执行回调函数
- onUpdated：在组件更新后执行回调函数

## 2. 生命周期

vue2 和 vue3 的生命周期钩子函数对比表格

| vue2          | vue3            |
| ------------- | --------------- |
| beforeCreate  | setup           |
| created       | setup           |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeDestroy | onBeforeUnmount |
| destroyed     | onUnmounted     |
| activated     | onActivated     |
| deactivated   | onDeactivated   |

说明： setup 函数相当于 vue2 中的 beforeCreate 和 created 两个生命周期钩子函数的结合体，因为 setup 函数在组件实例创建之前执行，所以无法访问 this，因此需要使用 Composition API 中的 ref、reactive 等函数来创建响应式数据。如果想访问 this,可以使用 getCurrentInstance 函数来获取当前组件实例。

## 3. 异步组件 defineAsyncComponent

说明：异步组件是 Vue3.0 新增的一个功能，它可以让我们在需要的时候才加载组件，从而提高应用的性能。异步组件的使用非常简单，只需要使用 defineAsyncComponent 函数来定义一个异步组件即可。

- 从服务器加载相关组件

```js
import { defineAsyncComponent } from "vue";

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */);
  });
}); // ... 像使用其他一般组件一样使用 `AsyncComp`
```

- 从本地加载相关组件

```js
import { defineAsyncComponent } from "vue";

const AsyncComponent = defineAsyncComponent(() =>
  import("./components/AsyncComponent.vue")
);
```

与 Suspense 组件一起使用

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const AsyncComponent = defineAsyncComponent(() =>
  import("./components/AsyncComponent.vue")
);
</script>
```

## 4. Teleport

说明：Teleport 是 Vue 3.0 中新增的一个组件，它可以将子组件渲染到指定的 DOM 节点中，而不是当前组件的 DOM 节点中。这在一些场景下非常有用，比如模态框、通知等。

```vue
<template>
  <Teleport to="body">
    <div class="modal">
      <p>This is a modal</p>
    </div>
  </Teleport>
</template>

<script setup></script>

<style>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
```

## 5. Fragments

说明：Fragments 是 Vue 3.0 中新增的一个特性，它允许我们在一个组件中返回多个根节点。这在一些场景下非常有用，比如一个组件需要返回多个兄弟节点。

```vue
<template>
  <div>Hello</div>
  <div>World</div>
</template>
```

## 6. 自定义指令

说明：自定义指令是 Vue 3.0 中新增的一个特性，它允许我们在 Vue 中创建自己的指令，从而扩展 Vue 的功能。自定义指令的使用非常简单，只需要使用 Vue.directive 函数来定义一个指令即可。

- 全局指令

```js
import { createApp } from "vue";

const app = createApp({});

app.directive("focus", {
  // 指令是具有一组生命周期的钩子：
  // 在绑定元素的 attribute 或事件监听器被应用之前调用
  created(el, binding) {},
  // 在绑定元素的父组件挂载之前调用
  beforeMount(el, binding) {},
  // 绑定元素的父组件被挂载时调用
  mounted(el, binding) {},
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate(el, binding) {},
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated(el, binding) {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el, binding) {},
  // 卸载绑定元素的父组件时调用
  unmounted(el, binding) {},
});

app.mount("#app");
```

- 局部指令

```vue
<script setup>
import { ref } from "vue";

const vFocus = {
  mounted(el) {
    el.focus();
  },
};

const input = ref(null);
</script>

<template>
  <input v-focus ref="input" />
</template>
```

## 7. v-model

v-model 在 Vue2 和 Vue3 中的区别

- Vue2

  - 语法：v-model
  - 原理：v-model 是 Vue2 中用于双向绑定的**指令**，它可以在表单元素上创建双向绑定，即当表单元素的值发生变化时，Vue 会自动更新绑定的数据，反之亦然。
  - 使用场景：v-model 通常用于表单元素，如 input、textarea、select 等。
  - 举例：

    ```vue
    <template>
      <input v-model="message" placeholder="edit me" />
      <!-- 👆🏻等同于👇🏻 -->
      <input
        :value="message"
        @input="message = $event.target.value"
        placeholder="edit me"
      />
      <p>Message is: {{ message }}</p>
    </template>

    <script>
    export default {
      data() {
        return {
          message: "",
        };
      },
    };
    </script>
    ```

    - 语法：.sync
    - 原理：.sync 是 Vue2 中用于双向绑定的**修饰符**，它可以在子组件中更新父组件的值，从而实现双向绑定。
    - 使用场景：.sync 通常用于子组件中，当子组件需要更新父组件的值时，可以使用 .sync 修饰符。
    - 举例：
      父组件

      ```vue
      <template>
        <child-component :value.sync="parentValue"></child-component>
      </template>

      <script>
      export default {
        data() {
          return {
            parentValue: "",
          };
        },
      };
      </script>
      ```

      子组件

      ```vue
      <template>
        <input
          :value="value"
          @input="$emit('update:value', $event.target.value)"
        />
      </template>

      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true,
          },
        },
      };
      </script>
      ```

- Vue3

  - 语法：v-model
  - 原理：在 Vue3 中，v-model 的实现方式发生了变化。它不再是一个指令，而是一个**语法糖**，
  它会在内部自动创建一个名为 modelValue 的 prop 和一个名为 update:modelValue 的 event。当组件的 modelValue prop 发生变化时，Vue 会自动更新绑定的数据，反之亦然。

  - 使用场景：v-model 可以用于任何组件，而不仅仅是表单元素。它可以在任何组件上创建双向绑定，只要该组件定义了一个名为 modelValue 的 prop 和一个名为 update:modelValue 的 event。
  - 🌰
    举例1：**v-model 的基本用法**

    父组件

    ```vue
    <template>
       <my-input v-model="msg"></my-input>
        <!-- 👆🏻等同于👇🏻 -->
        <my-input :modelValue="msg" @update:modelValue="msg = $event"></my-input>
    </template>

    <script setup>
    import { ref } from "vue";

    const message = ref("");
    </script>
    ```

    子组件

    ```vue
    <template>
        <div>
            <input
            type="text"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"  // 事件名改为 update:modelValue
            />
        </div>
    </template>

    <script setup>
    import { defineProps, defineEmits } from "vue";

    const props = defineProps({
        modelValue: String,
    });

    const emit = defineEmits(["update:modelValue"]);
    </script>
    ```

    举例2：**v-model 的多个属性**

    父组件

    ```vue
    <template>
      <child-component v-model:title="title" v-model:content="content"></child-component>
    </template>

    <script setup>
    import { ref } from "vue";

    const title = ref("");
    const content = ref("");
    </script>
    ```

    子组件

    ```vue
    <template>
      <div>
        <input
          :value="title"
          @input="emit('update:title', $event.target.value)"
        />
        <textarea
          :value="content"
          @input="emit('update:content', $event.target.value)"
        ></textarea>
      </div>
    </template>

    <script setup>
    import { defineProps, defineEmits } from "vue";

    const props = defineProps({
      title: String,
      content: String,
    });

    const emit = defineEmits(["update:title", "update:content"]);
    </script>
    ```

    举例3：**v-model 的自定义修饰符**
    父组件

    ```vue
    <template>
      <child-component v-model.capitalize="message"></child-component>
    </template>

    <script setup>
    import { ref } from "vue";

    const message = ref("");
    </script>
    ```

    子组件

    ```vue
    <template>
      <input
        :value="modelValue"
        @input="emitValue($event.target.value)"
      />
    </template>
    <script setup>
    import { defineProps, defineEmits } from "vue";

    const props = defineProps({
      modelValue: String,
      modelModifiers: {
        type: Object,
        default: () => ({}),
      },
    });

    const emit = defineEmits(["update:modelValue"]);

    const emitValue = (value) => {
      if (props.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      emit("update:modelValue", value);
    }
    </script>
    ```

    - 语法：.sync（在vue3中用 v-model:propName 的方式来替代 vue2中的 .sync 修饰符）

## 8. 自定义渲染器 createRenderer

说明：
自定义渲染器是 Vue 3.0 中新增的一个特性，它允许我们在 Vue 中创建自己的渲染器，从而扩展 Vue 的功能。

理解：

```text
在 renderer.ts 中，mountElement方法里创建新节点使用的是document.createElement，属性设置使用setAttribute，节点添加使用append。
自定义渲染器就意味着这部分固定的 DOM 环境API需要抽离出来作为 DOM 的固定接口。

将抽离出来的地方使用更为通用的渲染方法，当需要渲染成 DOM 时就使用 DOM 的接口，那当需要渲染成其他平台的.例如 canvas，也可以传入 canvas 相关的 API 接口。
```

应用案例：

- [构建高级自定义渲染器](https://segmentfault.com/a/1190000044963666#item-3)
- [vue3 的跨平台自定义渲染器](https://www.cnblogs.com/kdcg/p/13844808.html)
- [Vue3高阶API，自定义渲染器createRenderer](https://www.bmabk.com/index.php/post/196857.html)

## 9. vue3.6 新特性

### 9.1 Vapor Mode(实验性编译策略)

替代传统的的虚拟DOM渲染方式，通过静态分析和动态优化，Vapor模式可以生成更简介的运行时代码，减少不必要的DOM操作，提高性能。

核心特点：

- 精准DOM操作： 模版直接编译为高效的DOM操作，无需虚拟DOM和diff
- 更小的打包体积： 通过 `createVaporApp`创建的应用基线大小不到10kb,进一步优化加载时间

### 9.2 Alien Signals 1.0 集成

通过对响应式系统的优化，对内存使用和性能提升
