# react高级用法

## 1. 高阶组件(heighter-order component)

高阶组件(HOC)是react中用于复用组件逻辑的一种高级技术。HOC自身不是react API的一部分，它是一种基于react的组合特性而形成的设计模式。

高阶组件是参数为组件，返回值为新组件的函数。

```jsx
function HOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

### 1.1 属性代理

属性代理是最常见的高阶组件模式，通过包装要增强的组件来操作props。属性代理是最常见的高阶组件模式，通过包装要增强的组件来操作props。

```jsx
// 返回一个有状态的类组件
function HOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      const newProps = {
        name: 'new name',
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
// 返回一个无状态的函数组件
function HOC(WrappedComponent) {
  return function(props) {
    const newProps = {
      name: 'new name',
    };
    return <WrappedComponent {...props} {...newProps} />;
  };
}
```

### 1.2 反向继承

反向继承是另一种高阶组件模式，通过继承要增强的组件来操作组件。反向继承是另一种高阶组件模式，通过继承要增强的组件来操作组件。

使用一个函数接受一个组件作为参数传入，并返回一个继承了该传入组件的类组件，且在返回组件的 render() 方法中返回 super.render() 方法

```jsx
function HOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  };
}
```

- 允许HOC通过this访问到原组件，可以直接读取和操作原组件的state/ref等；
- 可以通过super.render()获取传入组件的render，可以有选择的渲染劫持；
- 劫持原组件生命周期方法，可以在原组件生命周期方法执行前后做一些事情；

```jsx
// 应用1：读取/操作原组件的state
function HOC(WrappedComponent){
  const didMount = WrappedComponent.prototype.componentDidMount;
  // 继承了传入组件
  return class HOC extends WrappedComponent {
    async componentDidMount(){
      if (didMount) {
        await didMount.apply(this);
      }
      // 直接读取和操作原组件的state/ref等
      // 将 state 中的 number 值修改成 2
      this.setState({ number: 2 });
      console.log(this.state.number);
    }

    render(){
      //使用 super 调用传入组件的 render 方法
      return super.render();
    }
  }
}
// 应用2：劫持生命周期方法，可以在原组件生命周期方法执行前后做一些事情
function HOC(WrappedComponent) {
  return class extends WrappedComponent {
    componentDidMount() {
      super.componentDidMount();
      console.log('HOC did mount');
    }
    render() {
      return super.render();
    }
  };
}
// 应用3：选择性渲染劫持，根据条件渲染不同的组件
function HOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      if (this.props.loggedIn) {
        return super.render();
      } else {
        return null;
      }
    }
  };
}
```

### 1.3 属性代理和反向继承的对比

- 属性代理：从“组合”角度出发，有利于从外部操作wrappedComp，可以操作props，或者在wrappedComp 外加一些拦截器（如条件渲染等）；
- 反向继承：从“继承”角度出发，从内部操作wrappedComp，可以操作组件内部的state，生命周期和render等，功能能加强大

### 1.4 高阶组件的注意事项

1. 不要在render方法中使用高阶组件，这会导致每次渲染时都创建一个新的组件，从而影响性能。
2. 不要在组件的state中使用高阶组件，这会导致组件的state无法正确更新。
3. 不要在组件的props中使用高阶组件，这会导致组件的props无法正确传递。
4. 不要在组件的生命周期方法中使用高阶组件，这会导致组件的生命周期方法无法正确执行。
5. 不要在组件的子组件中使用高阶组件，这会导致组件的子组件无法正确渲染。

### 1.5 高阶组件的应用

高阶组件的应用非常广泛，以下是一些常见的应用场景：

- 抽取重复代码，实现**组件复用**：相同功能组件复用，例如权限控制、表单验证等
- **条件渲染**：根据条件渲染不同的组件，例如权限控制、页面加载状态等
- **捕获/劫持被处理组件的生命周期**，常见场景：组件渲染性能追踪、日志打点。

## 2. Hooks

官网react hooks介绍：<https://zh-hans.reactjs.org/docs/hooks-intro.html>

Hooks是React 16.8引入的新特性，它允许你在不编写类的情况下使用state和其他React特性。Hooks只能在函数组件中使用，不能在类组件中使用。

目的： 解决函数组件没有state的问题，让函数组件也可以有状态；弥补无状态组件没有生命周期的缺陷。

优点：

- 开发友好，可扩展性强，抽离公共的方法或组件，Hook 使你在无需修改组件结构的情况下复用状态逻辑
- 函数式编程，将组件中相互关联的部分根据业务逻辑拆分成更小的函数；
- class更多作为语法糖，没有稳定的提案，且在开发过程中会出现不必要的优化点，Hooks无需学习复杂的函数式或响应式编程技术；

常见的Hooks：

- useState：用于在函数组件中添加state。相当于vue3中的reactive，vue2中的data
- useEffect：用于在函数组件中执行副作用。 相当于vue3中的watch，vue2中的watch，computed
- useContext：用于在函数组件中使用Context。 相当于vue3中的provide/inject，vue2中的provide/inject
- useReducer：用于在函数组件中实现状态管理。 相当于vue3中的store，vue2中的vuex
- useCallback：用于在函数组件中缓存函数。 相当于vue3中的computed，vue2中的computed
- useMemo：用于在函数组件中缓存计算结果。 相当于vue3中的computed，vue2中的computed
- useRef：用于在函数组件中访问DOM元素或保存可变值。 相当于vue3中的ref，vue2中的ref
- useImperativeHandle：用于在函数组件中自定义暴露给父组件的实例值。 相当于vue3中的expose，vue2中的expose
- useLayoutEffect：用于在函数组件中执行副作用，它在所有DOM变更后同步触发。 相当于vue3中的onMounted，vue2中的mounted
- useDebugValue：用于在React DevTools中显示自定义hook的标签。

### 2.1 useState

useState是React中最常用的Hooks之一，它允许你在函数组件中使用state。useState接受一个初始state作为参数，并返回一个包含当前state和更新state的函数的数组。

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>Count: {count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### 2.2 useEffect

useEffect是React中另一个常用的Hooks，它允许你在函数组件中使用副作用。副作用是指在组件渲染后执行的操作，例如数据获取、订阅或者手动更改DOM。

```jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>Count: {count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### 2.3 useContext

useContext是React中另一个常用的Hooks，它允许你在函数组件中使用Context。Context是React中用于跨组件传递数据的机制。

```jsx
import React, { useState, useContext } from 'react';

const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

### 2.4 useReducer

useReducer是React中另一个常用的Hooks，它允许你在函数组件中实现状态管理。useReducer接受一个reducer函数和一个初始state作为参数，并返回一个包含当前state和dispatch函数的数组。

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default: 
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

### 2.5 useCallback

useCallback是React中另一个常用的Hooks，它允许你在函数组件中缓存函数。useCallback接受一个回调函数和一个依赖数组作为参数，并返回一个缓存后的回调函数。只有当依赖数组中的值发生变化时，才会重新创建回调函数。

```jsx
import React, { useState, useCallback } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>Count: {count}<button onClick={increment}>+</button></div>
  );
}
```

### 2.6 useMemo

useMemo是React中另一个常用的Hooks，它允许你在函数组件中缓存计算结果。useMemo接受一个计算函数和一个依赖数组作为参数，并返回一个缓存后的计算结果。只有当依赖数组中的值发生变化时，才会重新计算结果。

```jsx
import React, { useState, useMemo } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <div>Count: {count} Double Count: {doubleCount}</div>
  );
}
```

### 2.7 useRef

useRef是React中另一个常用的Hooks，它允许你在函数组件中访问DOM元素或保存可变值。useRef返回一个可变的ref对象，其.current属性被初始化为传入的参数（initialValue）。返回的ref对象在组件的整个生命周期内保持不变。

- 获取DOM元素
- 保存可变值

```jsx
// 1. 获取DOM元素
import React, { useRef } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus the input</button>
    </div>
  );
}

// 2. 保存可变值
import React, { useRef } from 'react';

function Counter() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return (
    <div>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

## 3. 自定义Hooks

自定义Hooks是React中另一个高级用法，它允许你在函数组件中封装可重用的逻辑。自定义Hooks是一个普通的JavaScript函数，它以“use”开头，并返回一个值。

```jsx
import React, { useState, useEffect } from 'react';

function useCounter(initialCount) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return [count, setCount];
}

function Counter() {
  const [count, setCount] = useCounter(0);

  return (
    <div>Count: {count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
```

自定义一个Hooks,计算一个组件render期间的渲染耗时

```jsx
import React, { useState, useEffect } from 'react';

function useRenderTime() {
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    };
  }, []);

  return renderTime;
}

function App() {
  const renderTime = useRenderTime();

  return (
    <div>Render Time: {renderTime}ms</div>
  );
}
```

## 4. 异步组件

异步组件是React中另一个高级用法，它允许你在需要时才加载组件。异步组件可以提高应用的性能，减少初始加载时间。

```jsx
import React, { Suspense, lazy } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```
