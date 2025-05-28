# Vue2的高级用法

[Vue2 的 github 仓库](https://github.com/vuejs/vue)

## 1. mixin（废弃，不推荐使用）

### 1.1 什么是 mixin

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

### 1.2 使用场景

- 多个组件有相同的逻辑，把这些逻辑抽取出来，放到一个混入对象里面。
- 全局混入，混入对象里面定义的是全局的组件选项，如生命周期钩子函数，那么这些钩子函数会作用于每一个组件。全局混入使用 `Vue.mixin()` 方法。

## 2. vue.js 动画特效＆ 常见组件库介绍

### 2.1 transition组件

- `transition` 组件是 Vue.js 提供的用于在插入、更新或移除 DOM 元素时应用过渡效果。

```javaScript
<transition name="fade">
  <p v-if="show">Hello Vue!</p>
</transition>
```

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
```

### 2.2 transition-group组件

- `transition-group` 组件用于在插入、更新或移除多个元素时应用过渡效果。

```javaScript
<transition-group name="list">
  <p v-for="item in items" :key="item.id">{{ item.text }}</p>
</transition-group>
```

```css
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

### 2.3 常用动画库

- [animate.css](https://animate.style/)
- [wow.js](https://wowjs.uk/)
- [vue2-animate](https://github.com/asika32764/vue2-animate)

### 2.4 案例

创建一个简单的待办事项列表，点击添加按钮时，新的待办事项会以淡入的动画效果出现；当点击删除按钮时，待办事项会以淡出的动画效果消失。

```javaScript
<template>
  <div>
    <input v-model="newTodo" @keyup.enter="addTodo">
    <button @click="addTodo">Add</button>
    <transition-group name="fade">
      <li v-for="todo in todos" :key="todo.id">{{ todo.text }} <button @click="removeTodo(todo)">Remove</button></li>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTodo: '',
      todos: [],
      nextTodoId: 1
    }
  },

  methods: {
    addTodo() {
      if (this.newTodo.trim() === '') {
        return
      }
      this.todos.push({
        id: this.nextTodoId++,
        text: this.newTodo
      })
      this.newTodo = ''
    },

    removeTodo(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
```

### 2.5 应用场景

- 列表项的添加和删除
- 表单的提交和重置
- 模态框的打开和关闭
- 切换视图和组件

## 3. 插槽

插槽的概念可以与 react 中 renderProps 对比。

### 3.1 什么是插槽

插槽（Slot）是 Vue.js 中用于在组件中插入内容的机制。插槽允许我们在组件的模板中定义一个占位符，然后在组件的使用者中插入内容。

### 3.2 使用场景

- 在组件中插入内容，如导航栏、侧边栏、页脚等。
- 在组件中使用其他组件，如按钮、表单、列表等。
- 在组件中使用自定义内容，如文本、图片、视频等。

### 3.3 插槽的分类

- 默认插槽：没有指定名称的插槽，只能有一个。
- 具名插槽：指定名称的插槽，可以有多个。
- 作用域插槽：带有数据的插槽，可以将数据传递给插槽内容。
    使用情景：当数据在组件自身，但根据数据生成的结构需要组件使用者来定，我们则可以使用作用域插槽。
    [Vue2中插槽使用](https://blog.csdn.net/qq_45890970/article/details/123174161)

### 3.4 插槽的原理

vue源码中, 插槽实现原理是通过编译器将插槽内容编译成函数，然后在渲染时调用该函数，将插槽内容插入到组件中。
大体流程如下：

1. 编译器将插槽内容编译成函数，并将函数保存在组件的 `render` 函数中。
2. 在渲染组件时，调用 `render` 函数。
3. 在 `render` 函数中，调用插槽函数，将插槽内容插入到组件中。

### 3.5 作用域插槽举例

```javaScript
// 父组件
<template>
  <div>
    <child>
      <template v-slot:default="slotProps">
        <p>{{ slotProps.text }}</p>
      </template>
    </child>
  </div>
</template>

<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  }
}
</script>

// 子组件
<template>
  <div>
    <slot :text="text"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: 'Hello, World!'
    }
  }
}
</script>
```

## 4. 插件

### 4.1 什么是插件

插件可以是对象，或者是一个函数。如果是对象，那么对象中需要提供 install 函数，如果是函数，形态需要跟前面提到的 install 函数保持一致。

### 4.2 定义插件

```javaScript
// plugins.js
export default {
  install(Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
      // 逻辑...
    }

    // 2. 添加全局资源：指令/过滤器/过渡等
    Vue.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) {
        // 逻辑...
      }
      ...
    })

    // 3. 通过全局混入来添加一些组件选项
    Vue.mixin({
      created: function () {
        // 逻辑...
      }
      ...
    })

    // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
    Vue.prototype.$myMethod = function (methodOptions) {
      // 逻辑...
    }

    // 5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能
    // 逻辑...
  }
}
```

### 4.3 插件的使用

```javaScript
// main.js
import Vue from 'vue'
import App from './App.vue'
import MyPlugin from './plugins'

Vue.config.productionTip = false

Vue.use(MyPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
```

### 4.4 插件化机制原理

插件化机制原理是通过 Vue 的全局 API `Vue.use` 来实现的。当调用 `Vue.use` 时，Vue 会执行插件的 `install` 方法，并将 Vue 实例作为参数传递给 `install` 方法。在 `install` 方法中，插件可以添加全局方法或属性、全局资源、全局混入、实例方法等。

```javaScript
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 获取已经安装的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 看看插件是否已经安装，如果安装了直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // toArray(arguments, 1)实现的功能就是，获取Vue.use(plugin,xx,xx)中的其他参数。
    // 比如 Vue.use(plugin,{size:'mini', theme:'black'})，就会回去到plugin意外的参数
    const args = toArray(arguments, 1)
    // 在参数中第一位插入Vue，从而保证第一个参数是Vue实例
    args.unshift(this)
    // 插件要么是一个函数，要么是一个对象(对象包含install方法)
    if (typeof plugin.install === 'function') {
      // 调用插件的install方法，并传入Vue实例
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 在已经安装的插件数组中，放进去
    installedPlugins.push(plugin)
    return this
  }
}
```

### 4.5 常用的vue插件举例

- vue-router：用于构建单页面应用的路由管理器。
- vuex：用于管理应用状态的集中式存储库。
- axios：用于发送 HTTP 请求的库。
- vue-lazyload：用于图片懒加载的插件。
- vue-clipboard2：用于复制文本到剪贴板的插件。

## 5. 过滤器

### 5.1 什么是过滤器

过滤器（Filter）是 Vue.js 中用于格式化数据的机制。过滤器可以在模板中直接使用，也可以在 JavaScript 代码中使用。

### 5.2 定义过滤器

```javaScript
// 定义一个全局过滤器
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// 定义一个局部过滤器
new Vue({
  el: '#app',
  data: {
    message: 'hello'
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

### 5.3 使用过滤器

```javaScript
// 在模板中使用过滤器
<div>{{ message | capitalize }}</div>

// 在 JavaScript 代码中使用过滤器
const filteredMessage = this.$options.filters.capitalize(this.message)
```

## 6. 自定义指令(包含在插件中)

### 6.1 什么是自定义指令

自定义指令（Directive）是 Vue.js 中用于扩展 HTML 元素功能的机制。自定义指令可以在模板中直接使用，也可以在 JavaScript 代码中使用。

### 6.2 定义自定义指令

```javaScript
// 定义一个全局自定义指令
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 定义一个局部自定义指令
new Vue({
  el: '#app',
  directives: {
    focus: {
      // 下面每个方法都是一个钩子函数
    // el代表 当前绑定的dom元素
      bind: (el, binding) => {
        el.value = 56 // 可以赋值 不能使用方法
        console.log('bind:只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。')
      },
      inserted: (el, binding) => {
        el.focus() // 可以使用方法
        console.log('inserted:被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。')
      },
      update: (el, binding) => {
        console.log('update:被绑定元素所在模板更新时调用,模板还没更新完成')
      },
      componentUpdated: (el, binding) => {
        console.log('componentUpdated:指令所在组件的 VNode 及其子 VNode 全部更新后调用。')
      },
      unbind: (el, binding) => {
        console.log('unbind:只调用一次，指令与元素解绑时调用。')
      }
    }
  }
})
```

### 6.3 使用自定义指令

```javaScript
// 在模板中使用自定义指令
<input v-focus />

// 在 JavaScript 代码中使用自定义指令
const inputElement = document.querySelector('input')
this.$nextTick(() => {
  this.$options.directives.focus.inserted(inputElement) // 调用指令的inserted钩子函数
})
```
