# Vue 3 中容易造成“响应式丢失”的场景与解决方案

> 下面总结常见导致响应式失效/丢失的场景，每条都附上“错误示例 / 正确做法”。

---

:::tip
<https://playcode.io/vue> 在线调试
:::

## 1）从 `reactive` 或 `props` 里直接解构

错误：直接解构会拿到普通值，失去响应式。

```ts
import { reactive } from 'vue'

const state = reactive({ count: 0 })
const { count } = state // 普通 number，不会跟随响应式更新

setInterval(() => {
  state.count++ // 视图更新
  // count++ 不会影响 state.count，也不会触发视图
}, 1000)
```

正确：使用 `toRef`/`toRefs`，或在模板中直接使用属性链。

```ts
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({ count: 0 })
const countRef = toRef(state, 'count')
// 或：const { count } = toRefs(state)

countRef.value++ // 响应式生效
```

对于 `props`：

```ts
const props = defineProps<{ title?: string }>()
// 错误：const { title } = props
const title = toRef(props, 'title') // 正确
```

---

## 2）展开/拷贝破坏代理（丢失 Proxy）

错误：`...`、`Object.assign` 会创建全新普通对象。

```ts
import { reactive } from 'vue'

const state = reactive({ user: { name: 'A' } })
const copy = { ...state.user } // 普通对象
copy.name = 'B' // 不会触发更新
```

正确：保持代理引用不变，仅修改其属性；或对新对象再次 `reactive`。

```ts
state.user.name = 'B' // 响应式生效
// 或
const copy = reactive({ ...state.user })
copy.name = 'C' // 自己的响应式
```

---

## 3）先取出属性保存到局部变量再改

错误：保存的是值拷贝，不会回写到源对象。

```ts
const state = reactive({ n: 0 })
let n = state.n
n++ // 与 state 脱钩
```

正确：对属性使用 `toRef`。

```ts
const n = toRef(state, 'n')
n.value++ // 响应式生效
```

---

## 4）对 `ref` 的 `.value` 结果再解构/展开

错误：从 `ref.value` 解构得到的属性是普通值。

```ts
const user = ref({ name: 'A', age: 18 })
const { name } = user.value // 普通 string
name.toUpperCase() // 与 user 脱钩
```

正确：保持整体 `ref`，或用 `toRef(user.value, 'name')`。

```ts
const name = toRef(user.value, 'name')
name.value = 'B' // 响应式生效
```

---

## 5）`toRaw` / `markRaw` / 浅层响应导致未追踪

错误：操作原始对象或被标记为原始的对象。

```ts
const state = reactive({ x: { y: 1 } })
const raw = toRaw(state)
raw.x.y = 2 // 绕过追踪，不触发更新

const rawObj = markRaw({ z: 1 })
const s = reactive({ rawObj })
s.rawObj.z = 2 // 不追踪
```

正确：仅在必要时使用；需要深层追踪就用 `reactive`/`ref`。

```ts
state.x.y = 2 // 通过代理修改
```

另外：`shallowReactive`/`shallowRef` 只追踪顶层，嵌套层修改不触发，需要手动替换顶层或使用深层响应。

---

## 6）替换响应式对象引用本身

错误：把 `reactive` 返回的代理变量整个替换掉。

```ts
let state = reactive({ a: 1 })
state = { a: 2 } as any // 丢失代理
```

正确：只改属性，或用 `ref` 包装对象再整体替换。

```ts
state.a = 2 // 保持代理

const stateRef = ref({ a: 1 })
stateRef.value = { a: 2 } // 通过 ref 替换引用
```

---

## 7）序列化/跨边界传递（JSON、本地存储、消息通道）

错误：序列化会丢掉 Proxy。

```ts
const state = reactive({ a: 1 })
localStorage.setItem('s', JSON.stringify(state))
const parsed = JSON.parse(localStorage.getItem('s')!)
parsed.a = 2 // 普通对象，不追踪
```

正确：还原后重新 `reactive`。

```ts
const restored = reactive(parsed)
restored.a = 3 // 响应式生效
```

---

## 8）对集合/对象用原始引用操作绕过代理

错误：通过 `toRaw` 获取底层集合后直接操作。

```ts
const m = reactive(new Map<string, number>())
toRaw(m).set('k', 1) // 绕过追踪
```

正确：始终操作代理对象。

```ts
m.set('k', 1) // 响应式生效
```

---

## 9）冻结对象或某些类实例

错误：`Object.freeze` 使属性不可被 Proxy 拦截设置；类实例上非可枚举/访问器也可能不被追踪。

```ts
const obj = Object.freeze({ x: 1 })
const s = reactive({ obj })
// s.obj.x = 2 // 无效
```

正确：避免冻结需要响应的对象；对类实例，只在可变数据层使用 `reactive` 封装其可变字段。

---

## 10）`watch` / `computed` 依赖错误收集

错误：把值传给 `watch`，而不是 getter 或 `ref`。

```ts
const state = reactive({ a: 1 })
watch(state.a, (nv) => { /* 不会触发 */ })
```

正确：传入 getter 或 `toRef`。

```ts
watch(() => state.a, (nv) => { /* ok */ })
// 或
watch(toRef(state, 'a'), (nv) => { /* ok */ })
```

---

## 11）与第三方库交互被拷贝/序列化

错误：库内部为了不可变性做浅/深拷贝，导致响应式断链。

```ts
// 假设某库的 setState 会深拷贝传入对象
setState({ ...reactiveUser }) // 传入的是普通对象
```

正确：明确边界策略：

```ts
// 仅在 Vue 侧保持响应式，跨边界传输使用普通数据
// 接收后如需响应式再 reactive
const plain = JSON.parse(JSON.stringify(reactiveUser))
const reactiveAgain = reactive(plain)
```

---

## 12）数组/对象的“不可追踪”操作的误解

说明：Vue 3 对数组索引赋值、长度修改已可追踪；但如果数组/对象本身不是代理（例如来源于解构或拷贝），仍然不会追踪。

```ts
const list = reactive<number[]>([])
list[0] = 1 // 可追踪（Vue 3）
const copy = [...list]
copy[0] = 2 // 普通数组，不追踪
```

---

## 快速对照：避免响应式丢失的原则

- 保持并操作“代理对象/集合”，不要把它们替换为普通对象
- 需要“取出并保持响应”的属性，用 `toRef`/`toRefs`
- 避免随意展开/拷贝；跨边界后重新 `reactive`
- 小心 `toRaw`/`markRaw`/`shallow*` 系列
- `watch`/`computed` 传入 getter 或 `ref`

## 总结

### 本质原因

- 读时未通过代理，没收集依赖你读取的是“普通值”（解构、展开、序列化、toRaw 等得到的非 Proxy），响应系统看不到这次读取，自然不会在后续变化时通知你。
- 写时未通过代理，没触发通知你修改的是“原始对象/值”（绕过 Proxy 的引用、冻结对象、类实例不可拦截字段、toRaw(map).set 等），响应系统拦不住这次写入，不会触发更新。

### 衍生形态

- 解构/拷贝把代理变成普通值（读未收集）。
- 替换响应式引用本身（丢失原 Proxy 链）。
- shallow* 只追踪顶层（深层写未拦截）。
- watch(state.a) 直接传值（未建立依赖），应用 getter 或 toRef。

### 一句话

Vue3 依赖收集与通知都发生在 Proxy 拦截里，凡是“读/写”绕开了 Proxy，就会“看不见”和“拦不住”，于是就丢失响应式。
