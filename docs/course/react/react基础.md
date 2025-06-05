# react基础

:::tip
[react官网教学地址](https://zh-hans.react.dev/learn)
:::

## 1 react是什么

- React 是一个用于构建用户界面的 JavaScript 库。
- 由 Facebook 开发，用于其产品（如 Instagram 和 WhatsApp）。
- React 主要用于构建单页应用程序（SPA）。
- React 拥有组件化、声明式、虚拟DOM、单向数据流等特性。

## 2 react特点

- 组件化：React 将 UI 分解为独立、可复用的组件，使代码更易于维护和扩展。每个组件都有自己的状态和属性，可以独立更新和渲染。
- 声明式：React 使用 JSX 语法，使代码更直观、易读。开发者只需关注组件的渲染逻辑，而不必关心 DOM 操作。
- 虚拟DOM：React 使用虚拟 DOM 来提高性能。虚拟 DOM 是一个轻量级的 JavaScript 对象，代表真实的 DOM。当组件的状态或属性发生变化时，React 会先更新虚拟 DOM，然后通过 diff 算法计算出实际 DOM 需要更新的部分，最后只更新这些部分，而不是整个 DOM 树。
- 单向数据流：React 采用单向数据流，即数据从父组件流向子组件，子组件不能直接修改父组件的状态。这种设计使得组件之间的通信更加清晰和可预测。
- 高效：React 使用虚拟 DOM 和 diff 算法，使得渲染性能得到了显著提升。同时，React 还提供了生命周期方法和钩子函数，使开发者可以更灵活地控制组件的生命周期。

## 3 jsx模版语法

- JSX 是一种 JavaScript 的语法扩展，它允许在 JavaScript 代码中直接书写类似 HTML 的代码。React 使用 JSX 来描述 UI 的结构。
- 在 JSX 中，可以使用 JavaScript 表达式，用大括号 `{}` 包裹起来。例如，可以插入变量、函数调用、条件语句等。
- JSX 中的 HTML 标签和属性与普通的 HTML 标签和属性相同。例如，可以使用 `<div>` 标签来创建一个 div 元素，使用 `className` 属性来指定 CSS 类名。- JSX 中的自定义组件必须以大写字母开头。例如，可以使用 `<MyComponent />` 来创建一个自定义组件。
- JSX 中的注释与 JavaScript 中的注释相同，使用 `//` 或 `/* */` 来注释。
- JSX 中的样式属性必须使用 camelCase 命名法，例如 `backgroundColor` 而不是 `background-color`。
- JSX 中的事件处理函数必须使用驼峰命名法，例如 `onClick` 而不是 `onclick`。
- JSX 中的属性值必须使用引号或双引号包裹起来。

## 4 react组件形式

- 函数组件：函数组件是一个纯函数，接收 props 作为参数，并返回 JSX 元素。**函数组件没有状态和生命周期方法。**
- Class类组件：类组件是一个 ES6 类，继承自 React.Component。类组件有状态和生命周期方法，可以使用 `this.state` 来访问状态，使用 `this.setState` 来更新状态。类组件必须实现 `render` 方法，该方法返回 JSX 元素。

```jsx
// 函数组件
function MyComponent(props) {
  return <div>{props.name}</div>;
}

// 类组件
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

## 5 react组件

### 5.1 组件通信

- 父组件向子组件传递数据：**使用 props 传递数据**。父组件通过 props 将数据传递给子组件，子组件通过 props 接收数据。例如，父组件可以通过 `<ChildComponent name="John" />` 将 name 传递给子组件，子组件可以通过 `this.props.name` 访问 name。
- 子组件向父组件传递数据：**使用回调函数**。父组件可以通过 props 将一个回调函数传递给子组件，子组件在需要时调用该回调函数，并将数据作为参数传递给回调函数。例如，父组件可以通过 `<ChildComponent onButtonClick={this.handleButtonClick} />` 将 handleButtonClick 传递给子组件，子组件可以通过 `this.props.onButtonClick(data)` 调用回调函数，并将数据作为参数传递给回调函数。
- 兄弟组件之间传递数据：**使用状态提升**。将状态提升到它们的共同父组件中，然后通过 props 将状态和更新状态的函数传递给兄弟组件。兄弟组件可以通过调用更新状态的函数来更新状态，从而实现兄弟组件之间的通信。例如，父组件可以通过 `<SiblingComponentA state={this.state} updateState={this.updateState} />` 将状态和更新状态的函数传递给 SiblingComponentA 和 SiblingComponentB，SiblingComponentA 和 SiblingComponentB 可以通过调用 `this.props.updateState(data)` 来更新状态。

```jsx
// 父组件
class ParentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  updateState = (data) => {
    this.setState({ count: data });
  };

  render() {
    return (
      <div>
        <ChildComponentA count={this.state.count} />
        <ChildComponentB updateState={this.updateState} />
      </div>
    );
  }
}

// 子组件A - 接收父组件传递的数据
function ChildComponentA(props) {
  return <div>{props.count}</div>;
}

// 子组件B - 向父组件传递数据
function ChildComponentB(props) {
  return <button onClick={() => props.updateState(1)}>Update State</button>;
}
```

### 5.2 受控组件和非受控组件

- 受控组件：受控组件是由 React 控制其值的组件。在受控组件中，表单元素的值由 React 的状态管理，并且通过事件处理函数来更新状态。例如，可以使用 `value` 属性来设置输入框的值，并使用 `onChange` 事件处理函数来更新状态。

```jsx
class ControlledComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return <input type="text" value={this.state.value} onChange={this.handleChange} />;
  }
}
```

- 非受控组件：非受控组件是由 DOM 控制其值的组件。在非受控组件中，表单元素的值由 DOM 管理，并且可以通过 `ref` 来访问表单元素的值。例如，可以使用 `ref` 来获取输入框的值。

```jsx
class UncontrolledComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleClick = () => {
    console.log(this.inputRef.current.value);
  };

  render() {
    return <input type="text" ref={this.inputRef} />;
  }
}
```

### 5.3 高阶组件

- 高阶组件（HOC）是一个函数，它接收一个组件作为参数，并返回一个新的组件。高阶组件可以用于组件复用、逻辑抽象和代码组织。

```jsx
// 高阶组件
function withExtraProps(WrappedComponent) {
  return function(props) {
    return <WrappedComponent {...props} extraProp="extraValue" />;
  };
}

// 定义组件
function MyComponent(props) {
  return <div>{props.extraProp}</div>;
}

// 使用高阶组件
const EnhancedComponent = withExtraProps(MyComponent);
```

## 6 react生命周期

- [参考文章](https://juejin.cn/post/6871728918643081230)
- [生命周期图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### 6.1 class组件生命周期

React 组件的生命周期方法是指在组件的不同阶段被调用的方法。React 组件的生命周期方法可以分为三个阶段：挂载阶段、更新阶段和卸载阶段。

#### 6.1.1 挂载阶段

- `constructor()`：组件的构造函数，在组件创建时被调用。可以在构造函数中初始化组件的状态和绑定事件处理函数。
- `static getDerivedStateFromProps()`：在组件挂载和更新时被调用，用于根据 props 更新组件的状态。这个方法应该返回一个对象，表示新的状态，或者返回 null 表示状态不需要更新。
- `render()`：组件的渲染方法，在组件挂载和更新时被调用。这个方法应该返回一个 React 元素，表示组件的 UI 结构。
- `componentDidMount()`：组件挂载完成后被调用，可以在这里执行一些副作用操作，例如发送网络请求、订阅事件等。

#### 6.1.2 更新阶段

- `static getDerivedStateFromProps()`：在组件挂载和更新时被调用，用于根据 props 更新组件的状态。这个方法应该返回一个对象，表示新的状态，或者返回 null 表示状态不需要更新。
- `shouldComponentUpdate(nextProps, nextState)`：在组件更新前被调用，用于判断组件是否需要更新。这个方法应该返回一个布尔值，表示是否需要更新组件。如果返回 false，则组件不会更新。【性能优化点】
- `render()`：组件的渲染方法，在组件挂载和更新时被调用。这个方法应该返回一个 React 元素，表示组件的 UI 结构。
- `getSnapshotBeforeUpdate(prevProps, prevState)`：在组件更新前被调用，用于获取组件更新前的快照。这个方法应该返回一个值，该值将作为 `componentDidUpdate` 方法的第三个参数。
- `componentDidUpdate(prevProps, prevState, snapshot)`：组件更新完成后被调用，可以在这里执行一些副作用操作，例如更新 DOM、发送网络请求等。

#### 6.1.3 卸载阶段

- `componentWillUnmount()`：组件卸载前被调用，可以在这里执行一些清理操作，例如取消网络请求、取消订阅事件等。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component updated');
  }

  componentWillUnmount() {
    console.log('Component will unmount');
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

### 6.2 函数组件生命周期

Function Component 是更彻底的状态驱动抽象，甚至没有 Class Component 生命周期的概念，只有一个状态，而 React 负责同步到 DOM。

- React 16.8 引入了 Hooks，使得函数组件也可以使用生命周期方法。函数组件的生命周期方法可以通过 `useEffect` Hook 来实现。

```txt
useEffect 就是一个 Effect Hook ，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount 、 componentDidUpdate  和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。
```

```jsx
import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will unmount'); // 清理操作
    };
  }, []); // 空数组表示只在组件挂载和卸载时执行

  useEffect(() => {
    console.log('Component updated');
  }, [/* 依赖项 */]); // 依赖项数组表示只在依赖项发生变化时执行

  return <div>{/* UI 结构 */}</div>;
}
```

## 7. 事件处理

React 中的事件处理与原生 JavaScript 中的事件处理类似，但是有一些不同之处。以下是 React 事件处理的一些关键点：

1. 事件名称：React 中的事件名称与原生 JavaScript 中的事件名称相同，但是需要使用驼峰命名法。例如，`onClick`、`onChange` 等。
2. 事件对象：React 中的事件对象是一个合成事件对象，它是一个对原生事件对象的封装。合成事件对象与原生事件对象具有相同的接口，但是它提供了一些额外的功能，例如事件委托和事件池。在处理事件时，应该使用合成事件对象，而不是原生事件对象。
3. 事件绑定：在 React 中，事件绑定是通过在 JSX 中使用 `onEventName` 属性来实现的。例如，`<button onClick={handleClick}>Click me</button>`。在事件处理函数中，可以使用 `event` 参数来获取事件对象。例如，`function handleClick(event) { console.log(event.target.value); }`。
4. 事件传播：React 中的事件传播与原生 JavaScript 中的事件传播相同。事件可以在组件树中向上或向下传播。可以使用 `event.stopPropagation()` 来阻止事件传播，使用 `event.preventDefault()` 来阻止默认行为。

```jsx
import React from 'react';

class MyComponent extends React.Component {
  handleClick = (event) => {
    console.log(event.target.value);
  };

  render() {
    return <input type="text" onClick={this.handleClick} />;
  }
}
```

## 8. create-react-app

官方地址：<https://create-react-app.dev/>

github：<https://github.com/facebook/create-react-app>

create-react-app是一个官方支持的创建React单页应用程序的脚手架。它提供了一个零配置的现代化配置设置。

## 9. immutable 及immer

### 9.1 immutable

- 官方地址：<https://immutable-js.com/>
- Immutable.js 是一个用于创建不可变数据的 JavaScript 库。不可变数据是指一旦创建，就不能被修改的数据。不可变数据可以用于优化性能，因为 React 可以使用不可变数据来检测组件是否需要重新渲染。
- Immutable.js 提供了一些方法来创建不可变数据，例如 `Map`、`List`、`Set` 等。这些方法返回一个新的不可变数据对象，而不是修改原始数据对象。

```jsx
import { Map } from 'immutable';

const map1 = Map({ a: 1, b: 2 }); // 创建一个不可变数据对象
const map2 = map1.set('a', 2); // 对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象；

console.log(map1.get('a')); // 1
console.log(map2.get('a')); // 2
```

### 9.2 immer

- 官方地址：<https://immerjs.github.io/immer/zh-CN/>
- immer 是一个用于创建可变数据的 JavaScript 库。可变数据是指可以被修改的数据。immer 提供了一种简单的方式来创建可变数据，而不需要手动管理状态。

```jsx
import produce from 'immer';

const state = {
  count: 0,
};

const nextState = produce(state, draftState => {
  draftState.count += 1;
});
console.log(nextState.count); // 1
```
