# Vue-Router

## 一、原理

### 初始化阶段

#### 1.mode 模式定义

#### 2.对不同的mode进行监听

```txt
    hash: 
        window.addEventListener('load',fn)
        window.addEventListener('hashchange',fu)
    history:
        window.addEventListener('load',fn)
        window.addEventListener('popstate', fn)
```

#### 3.创建路径与组件的映射表

什么时候使用这个映射表？

`<router-view />`的h函数需要通过`<router-link />`的路径来查找对应的组件来渲染到页面上

#### 4.通过install方法添加一些该插件使用时候需要的功能

全局变量的注册：$router, $route
应用组件的注册：`<router-link /> <router-view />`

```js
//myVueRouter.js
let Vue = null;
class HistoryRoute {
    constructor() {
        this.current = null; // 当前路径
    }
}
class VueRouter {
    constructor(options) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || []; //你传递的这个路由是一个数组表
        this.routesMap = this.createMap(this.routes); // 创建映射表
        this.history = new HistoryRoute(); // 创建一个history对象
        this.init();
    }
    init() {
        if (this.mode === 'hash') {
            // 先判断用户打开时有没有hash值，没有的话跳转到#/
            location.hash ? '' : (location.hash = '/');
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener('hashchange', () => {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? '' : (location.pathname = '/');
            window.addEventListener('load', () => {
                this.history.current = location.pathname;
            });
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname;
            });
        }
    }

    // 创建映射表
    createMap(routes) {
        return routes.reduce((pre, current) => {
            pre[current.path] = current.component;
            return pre;
        }, {});
    }
}
// 插件化，通过install方法添加一些该插件使用时候需要的功能
VueRouter.install = function (v) {
    Vue = v;
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.router) {  // 如果是根组件
                this._root = this; //把当前实例挂载到_root上
                this._router = this.$options.router; //把路由实例挂载到_root上
                Vue.util.defineReactive(this, '_history', this._router.history); // 把路由实例挂载到根实例上
            } else {
                //如果是子组件
                this._root = this.$parent && this.$parent._root;
            }
            // 将$router挂载到每个组件上，这样每个组件都可以通过this.$router来访问路由实例
            Object.defineProperty(this, '$router', {
                get() {
                    return this._root._router;
                },
            });
            // 将$route挂载到每个组件上，这样每个组件都可以通过this.$route来访问当前路由信息
            Object.defineProperty(this, '$route', {
                get() {
                    return this._root._router.history.current;
                },
            });
        },
    });
    // 全局组件注册，这样每个组件都可以使用<router-link />和<router-view />
    Vue.component('router-link', {
        props: {
            to: String,
        },
        render(h) {
            let mode = this._self._root._router.mode;
            let to = mode === 'hash' ? '#' + this.to : this.to;
            return h('a', { attrs: { href: to } }, this.$slots.default);
        },
    });
    Vue.component('router-view', {
        render(h) {
            let current = this._self._root._router.history.current;
            let routeMap = this._self._root._router.routesMap;
            return h(routeMap[current]);
        },
    });
};

export default VueRouter;
```

## 二、导航守卫

### 全局

1.全局前置守卫 beforeEach

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

2.全局解析守卫 beforeResolve
3.全局后置守卫 afterEach

### 路由独享

beforeEnter

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

### 组件内部

1.- beforeRouteEnter  在被激活的组件里调用
2.- beforeRouteUpdate 在重用的组件里调用
3.- beforeRouteLeave  在失活的组件里调用

## 三、组合式API的使用（vue3）

```js
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
          ...query,
        },
      })
    }
  },
}
```

## 四、路由懒加载

* 原因：
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
* 应用：
Vue Router 支持开箱即用的动态导入，这意味着你可以用动态导入代替静态导入：

```js
// 将
// import UserDetails from './views/UserDetails.vue'
// 替换成
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [{ path: '/users/:id', component: UserDetails }],
})
```
