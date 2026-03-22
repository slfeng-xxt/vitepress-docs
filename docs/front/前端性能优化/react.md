# react性能优化

## 1. React状态管理

### 1.1 减少全局状态的依赖

- 将状态尽可能的局部化，避免使用全局状态（Redux/Context）管理所有的数据
- 例如，对于仅用某些组件的状态，可以使用组件的`useState`或`useReducer`来管理

### 1.2 优化Context的性能

- Context的更新会重新渲染所有订阅的组件
- 解决方法：拆分Context,将不同的逻辑存储在多个Context中，降低重新渲染范围

### 1.3 使用高效的状态管理库

- 使用轻量级的状态管理工具，例如：Zustand、Jotai、Recoil等,他们具有更细粒度状态更新机制，可以减少不必要的渲染

```jsx
import create from 'zustand';

const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 }))
}))

const Counter = () => {
    const { count, increment, decrement } = useStore();
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    )
}
```

### 1.4 避免不必要的状态更新

- 使用不可变数据结构，避免直接修改状态，例如：`immer`

## 2. 视图更新优化

### 2.1 使用React.memo防止不必要的重新渲染

- `React.memo`是一个高阶组件，用于防止组件不必要的重新渲染
- 它接受一个组件作为参数，并返回一个新的组件，该组件仅在props发生变化时才会重新渲染

```jsx
const MyComponent = React.memo(({data}) => {
    return <div>My Component{data}</div>
});
```

### 2.2 使用useMemo和useCallback减少不必要的计算和渲染

- `useMemo`和`useCallback`可以用于缓存计算结果和回调函数，避免在每次渲染时重新计算和创建
- `useMemo`接受一个函数和一个依赖数组作为参数，返回一个缓存的值

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const handleClick = useCallback(() => {
    doSomething()
}, [])
```

### 2.3 拆分组件

- 将页面拆分为跟小的组件，只更新必要的部分，避免整体的重新渲染

### 2.4 使用虚拟滚动

- 对于长链表的渲染，使用虚拟滚动（React-Virtualized）只渲染可见区域的内容

### 2.5 批量更新

- 例如：`ReactDOM.unstable_batchedUpdates`，可以批量更新组件的状态，减少渲染次数

## 3. 代码分割和懒加载

- 使用`React.lazy`和`Suspense`实现代码分割和懒加载，按需加载组件，减少初始加载时间
