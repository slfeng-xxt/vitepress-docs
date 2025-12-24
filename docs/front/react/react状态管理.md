# react状态管理

学习过程：

- 状态管理的使用
- 状态管理的原理
- 实现一个简单的状态管理

## 1. 状态管理

目的：解决组件之间的状态共享问题

有哪些方法：

- useState: 用于在函数组件中添加状态,例如，计数器、表单输入等；用于解决局部状态管理的问题；
- useReducer: 用于在函数组件中管理复杂的状态逻辑，例如，购物车、任务列表等；用于解决复杂状态管理的问题；
- useContext: 用于在函数组件中访问上下文，例如，主题颜色、语言等；用于解决后代组件状态共享的问题；
- redux: 用于在应用中管理全局状态，例如，用户认证、主题颜色、语言等；用于解决跨组件状态共享的问题、复杂状态管理的问题、全局状态管理的问题、数据持久化的问题；相当于vue中的vuex

### 1.1  redux

#### 1.1.1 redux是什么

redux是一个用于管理应用状态的库，它提供了一种集中式的方式来存储和管理应用的状态，使得状态的变化更加可预测和可追踪。

#### 1.1.2 redux的核心概念

redux的核心概念包括：store、action、reducer、dispatch、subscribe。

- store：是redux应用的核心，它是一个单一的状态树，存储了整个应用的状态。
- action：是描述状态变化的普通对象，它包含了type和payload两个属性，type表示动作的类型，payload表示动作的负载。action是改变状态的唯一途径。
- reducer：是一个纯函数，它接收当前的state和action作为参数，返回一个新的state。reducer负责根据action的类型来更新state。
- dispatch：是触发action的函数，它接收一个action作为参数，并返回一个新的state。
- subscribe：是订阅store变化的函数，它接收一个回调函数作为参数，当store发生变化时，回调函数会被调用。

#### 1.1.3 redux的使用

redux的使用分为以下步骤：

- 创建store：使用createStore函数创建一个store，它接收一个reducer作为参数。
- 创建action：创建一个action，它是一个普通对象，包含了type和payload两个属性。
- 创建reducer：创建一个reducer，它是一个纯函数，接收当前的state和action作为参数，返回一个新的state。
- dispatch action：使用dispatch函数触发action，它接收一个action作为参数，并返回一个新的state。
- subscribe：使用subscribe函数订阅store的变化，它接收一个回调函数作为参数，当store发生变化时，回调函数会被调用。

```jsx
import { createStore } from 'redux';

// 创建一个reducer
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 创建一个store
const store = createStore(reducer);

// 创建一个action
const increment = { type: 'INCREMENT' };
const decrement = { type: 'DECREMENT' };

// dispatch action
store.dispatch(increment); // { count: 1 }
store.dispatch(decrement); // { count: 0 }

// subscribe
store.subscribe(() => {
  console.log(store.getState());
});
```

#### 1.1.4 redux的原理

redux的原理是基于发布-订阅模式，它通过store来存储状态，通过action来描述状态的变化，通过reducer来更新状态，通过dispatch来触发action，通过subscribe来订阅store的变化。

#### 1.1.5 redux的优缺点

redux的优点包括：状态的可预测性、状态的追踪性、状态的集中管理、状态的持久化等。

redux的缺点包括：学习曲线陡峭、代码量较大、性能问题等。

#### 1.1.6 redux的替代品

redux的替代品包括：MobX、Vuex、Recoil等。

## 2. 实现一个简单的状态管理

实现一个简单的状态管理，包括以下步骤：

- 创建一个store：使用createStore函数创建一个store，它接收一个reducer作为参数。
- 创建一个action：创建一个action，它是一个普通对象，包含了type和payload两个属性。
- 创建一个reducer：创建一个reducer，它是一个纯函数，接收当前的state和action作为参数，返回一个新的state。
- dispatch action：使用dispatch函数触发action，它接收一个action作为参数，并返回一个新的state。

```javascript
import { createStore } from 'redux';

// 创建一个reducer
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 创建一个store
const store = createStore(reducer);

// 创建一个action
const increment = { type: 'INCREMENT' };
const decrement = { type: 'DECREMENT' };

// dispatch action
store.dispatch(increment); // { count: 1 }
store.dispatch(decrement); // { count: 0 }
```

## 3. 状态管理选型依据

- useState：适用于组件内部状态管理，简单易用，但无法跨组件共享状态。
- useReducer：适用于组件内部复杂状态管理，可以跨组件共享状态。
- useContext：适用于跨组件状态共享，但需要配合Provider和Consumer使用。
- redux：适用于全局状态管理，可以跨组件共享状态，但需要学习额外的API和概念。

状态库能力对照表，表格如下：

| 能力       | useState | useReducer | useContext | redux |
| ---------- | -------- | ---------- | ---------- | ----- |
| 状态管理   | ✅        | ✅          | ✅          | ✅     |
| 状态共享   | ❌        | ❌          | ✅          | ✅     |
| 状态持久化 | ❌        | ❌          | ❌          | ✅     |
| 状态追踪   | ❌        | ❌          | ❌          | ✅     |
| 性能       | ✅        | ✅          | ✅          | ✅     |

### 3.1 状态管理

useState和useReducer都是React自带的API，用于在函数组件中添加状态，useState用于解决局部状态管理的问题，useReducer用于解决复杂状态管理的问题。
useContext用于在函数组件中访问上下文，例如，主题颜色、语言等，用于解决后代组件状态共享的问题。
redux是一个用于管理应用状态的库，它提供了一种集中式的方式来存储和管理应用的状态，使得状态的变化更加可预测和可追踪。

### 3.2 状态共享

useState和useReducer都无法跨组件共享状态，而useContext和redux都可以跨组件共享状态。

### 3.3 状态持久化

useState和useReducer都无法实现状态持久化，而redux可以实现状态持久化。

### 3.4 状态追踪

useState和useReducer都无法实现状态追踪，而redux可以实现状态追踪。

### 3.5 性能

useState和useReducer的性能都很好，而useContext的性能稍差，redux的性能稍差。

### 3.6 总结

根据以上对比，我们可以得出以下结论：

- 如果只是需要简单的状态管理，可以使用useState或useReducer。
- 如果需要跨组件共享状态，可以使用useContext或redux。
- 如果需要状态持久化和状态追踪，建议使用redux。
- 如果需要高性能的状态管理，建议使用useState或useReducer。
