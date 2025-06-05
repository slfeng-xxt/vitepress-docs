# react源码

## 1. react设计理念

- 声明式：只需要告诉react你想要什么，react就会自动帮你更新UI
- 组件化：UI被切分为一些独立的、可复用的组件
- 一次学习，跨端使用：无论在web还是原生app，甚至VR，react都能大放异彩

### 1.1 如何提升页面响应

- cpu瓶颈：计算量太大，导致浏览器线程没有足够的时间来渲染UI
- io瓶颈：发送网络请求，等待响应

### 1.2 如何解决cpu瓶颈

- 时间切片：requestIdleCallback
- 异步：promise、async/await

cpu卡顿的原因：浏览器里JS线程与GUI线程是互斥的，不可同时执行，所以JS脚本和浏览器的render、painting不能同时执行，所以执行顺序为：JS脚本执行 ->样式布局 ->样式绘制，JS执行时间超过16.6ms，就不会执行render与painting了

1. 浏览器刷新率是60Hz，即每16.6ms刷新一次
2. 当浏览器执行js时，会阻塞页面的渲染
3. 当js执行时间过长，超过了16.6ms，就会导致页面卡顿

如何解决：在浏览器每一帧的时间中，预留一些时间给JS线程，React利用这部分时间更新组件（预留的初始时间是5ms）。当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染UI，React则等待下一帧再继续被中断的工作。
[源码参考](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)

1. shouldYieldToHost：判断是否需要让出主线程的控制权
2. requestHostCallback：调度React任务
3. cancelHostCallback：取消React任务
4. requestHostTimeout：在指定延迟后执行任务
5. cancelHostTimeout：取消延迟执行的任务

### 1.3 如何解决io瓶颈

- 虚拟滚动：只渲染可视区域内的元素
- 缓存：对请求过的数据做缓存
- 分页/懒加载：按需加载

## 2. 新旧架构的区别

### 2.1 react15架构

- Reconciler（协调器）：主要职责是负责找出变化的组件
- Renderer（渲染器）：负责将变化的组件渲染到页面上

react中如何触发更新：setState、forceUpdate、ReactDOM.render；

当有更新操作时，Reconciler如何工作：

1. 调用setState、forceUpdate、ReactDOM.render等API，将更新的组件标记为“ dirty”，加入到dirtyComponents中
2. Reconciler会遍历dirtyComponents，通过调用组件的render方法，将render方法返回的JSX转化为虚拟DOM
3. 将虚拟DOM和上次更新时的虚拟DOM对比，找到变化的部分，生成一个变化的对象（change）
4. 根据变化的对象（change），生成一个变更（update），加入到updateQueue中
5. 将包含变化的组件加入到effectList中，待commit阶段处理

当commit阶段开始时，Renderer根据effectList的顺序，将变化的组件渲染到页面上

该架构的缺点：

- 在reconciler阶段，采用递归的方式执行，当组件层级很深时，递归更新时间超过了16.6ms，就会导致页面卡顿
- 在reconciler阶段，每次更新都会重新生成虚拟DOM，然后和上次更新时的虚拟DOM对比，生成变化的对象，当组件树很大时，这个过程的计算量很大，会导致页面卡顿
- 不支持异步可中断的更新，当组件树很大时，更新过程会卡顿

### 2.2 react16架构

- Scheduler（调度器）：调度任务的优先级，高优任务优先进入Reconciler
- Reconciler（协调器）：负责找出变化的组件
- Renderer（渲染器）：负责将变化的组件渲染到页面上

为什么需要Scheduler?
在react16中，引入了Scheduler，用于调度任务的优先级，高优任务优先进入Reconciler，从而避免低优任务阻塞高优任务，导致页面卡顿

Scheduler如何工作？

1. 当有更新操作时，Scheduler会根据任务的优先级，将任务加入到任务队列中
2. Scheduler会循环从任务队列中取出任务，交给Reconciler处理
3. 当任务执行时间超过5ms时，Scheduler会将控制权交还给浏览器，使浏览器有时间渲染UI，React则等待下一帧再继续被中断的工作

16中的Reconciler有哪些优化？

1. 采用Fiber架构，将递归的更新过程改为循环，从而避免递归更新时间过长导致的页面卡顿
2. 将虚拟DOM的对比过程改为增量对比，从而避免每次更新都重新生成虚拟DOM，减少计算量
3. 支持异步可中断的更新，当组件树很大时，更新过程会卡顿，react16通过Scheduler将任务分成多个小任务，每个小任务执行时间不超过5ms，从而避免页面卡顿

## 3. Fiber架构详解

### 3.1 Fiber是什么？

Fiber是React16中引入的一种新的数据结构，用于描述组件的更新。Fiber架构是React16中引入的一种新的架构，用于解决React15中存在的性能问题。

### 3.2 Fiber架构如何工作？

Fiber架构将组件的更新过程分为两个阶段：Reconciliation阶段和Commit阶段。

1. Reconciliation阶段：在这个阶段，React会构建一个Fiber树，用于描述组件的更新。Fiber树是一个链表结构，每个节点代表一个组件的更新。React会遍历Fiber树，找到需要更新的组件，并将它们标记为“ dirty”。在遍历过程中，React会根据任务的优先级，将任务分成多个小任务，每个小任务执行时间不超过5ms。当小任务执行完毕后，React会将控制权交还给浏览器，使浏览器有时间渲染UI。React等待下一帧再继续被中断的工作。
2. Commit阶段：在这个阶段，React会遍历Fiber树，将需要更新的组件渲染到页面上。在Commit阶段，React会采用批处理的方式，将多个更新操作合并为一个，从而减少DOM操作次数，提高性能。

### 3.3 Fiber架构的render流程

1. 创建Fiber树：React会遍历组件树，为每个组件创建一个Fiber节点，并将这些节点连接起来，形成Fiber树。
2. 构建Effect List：React会遍历Fiber树，找到需要更新的组件，并将它们标记为“ dirty”，同时构建一个Effect List，用于记录需要更新的组件。
3. Commit阶段：React会遍历Effect List，将需要更新的组件渲染到页面上。

### 3.4 Fiber架构的commit阶段

1. before mutation阶段：在这个阶段，React会遍历Effect List，调用组件的render方法，将组件的更新渲染到页面上。同时，React会调用组件的生命周期方法，如componentWillMount、componentWillReceiveProps等。
2. mutation阶段：在这个阶段，React会遍历Effect List，调用组件的componentDidMount、componentDidUpdate等方法，同时更新DOM。

## 4. diff算法

在render阶段，对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成一个update对象，然后加入到该Fiber节点的updateQueue队列中，待commit阶段渲染到真实DOM时使用。这里要注意的是，这里Diff算法的执行是在render阶段，而且只针对update的组件执行Diff算法。

### 4.1 diff算法是什么？

diff算法是React中用于比较新旧虚拟DOM树，找出需要更新的组件的一种算法。React通过diff算法，可以快速地找到需要更新的组件，从而提高性能。

### 4.2 diff算法的原理？

diff算法的原理是基于虚拟DOM树，通过比较新旧虚拟DOM树的差异，找出需要更新的组件。React通过diff算法，可以快速地找到需要更新的组件，从而提高性能。

### 4.3 diff算法的实现？

diff算法的实现主要包括两个部分：diff算法和patch算法。

- diff算法：diff算法用于比较新旧虚拟DOM树的差异，找出需要更新的组件。React通过diff算法，可以快速地找到需要更新的组件，从而提高性能。
- patch算法：patch算法用于将diff算法找到的更新应用到实际的DOM树上。React通过patch算法，可以将更新渲染到页面上。

### 4.4 diff算法的性能优化？

diff算法的性能优化主要包括两个方面：减少diff算法的计算量、减少DOM操作次数。

- 减少diff算法的计算量：React通过diff算法，可以快速地找到需要更新的组件，从而提高性能。但是，当组件树很大时，diff算法的计算量也会很大，导致页面卡顿。为了解决这个问题，React引入了Fiber架构，将递归的更新过程改为循环，从而避免递归更新时间过长导致的页面卡顿。

- 减少DOM操作次数：React通过patch算法，可以将更新渲染到页面上。但是，当更新操作很多时，DOM操作次数也会很多，导致页面卡顿。为了解决这个问题，React引入了批处理的方式，将多个更新操作合并为一个，从而减少DOM操作次数，提高性能。

## 5. 状态更新

### 5.1 概览

- 触发状态更新的操作：setState、forceUpdate、ReactDOM.render
- 状态更新的流程：调度任务 -> 构建update对象 -> 更新Fiber节点 -> 执行更新 -> 更新DOM

## 6. hooks

### 6.0 hooks是什么？

Hooks是React16.8中引入的一种新的特性，用于在函数组件中使用状态和其他React特性。Hooks可以在不编写类组件的情况下使用状态和其他React特性。

### 6.1 hooks的数据结构

- hooks的数据结构是一个单向链表，每个节点代表一个hook，每个节点包含一个memoizedState属性，用于存储hook的值
- hooks的数据结构在Fiber节点中，每个Fiber节点都有一个memoizedState属性，用于存储该Fiber节点的hooks
- hooks的数据结构在函数组件中，每个函数组件都有一个hooks数组，用于存储该函数组件的hooks

### 6.2 hooks的执行流程

- 在函数组件中，hooks的执行流程如下：
  1. 调用useState、useEffect等hook函数，React会根据hook函数的调用顺序，为该函数组件创建一个hook节点，并将该节点加入到函数组件的hooks数组中
  2. 在函数组件的render阶段，React会遍历函数组件的hooks数组，执行每个hook函数，并将hook函数的返回值存储到hook节点的memoizedState属性中
  3. 在函数组件的commit阶段，React会遍历函数组件的hooks数组，执行每个hook函数的副作用函数，如useEffect的回调函数

- 在类组件中，hooks的执行流程如下：
  1. 在类组件的render阶段，React会遍历类组件的hooks数组，执行每个hook函数，并将hook函数的返回值存储到hook节点的memoizedState属性中
  2. 在类组件的commit阶段，React会遍历类组件的hooks数组，执行每个hook函数的副作用函数，如useEffect的回调函数

### 6.3 hooks的注意事项

- hooks只能在函数组件中使用，不能在类组件中使用
- hooks只能在函数组件的顶层调用，不能在条件语句、循环语句中调用
- hooks的调用顺序必须保持一致，不能在函数组件的render阶段改变hooks的调用顺序
- hooks的调用顺序必须与函数组件的render阶段保持一致，不能在函数组件的commit阶段改变hooks的调用顺序，否则会导致hook节点的memoizedState属性错乱，从而引发bug

## 7. Concurrent Mode

react mode有哪些？

- Legacy Mode：这是React 16及更早版本的默认模式，不支持Concurrent Mode的特性。
- Blocking Mode：这是React 16.6引入的一种模式，支持Concurrent Mode的特性，但优先级较低。
- Concurrent Mode：这是React 16.8引入的一种模式，支持Concurrent Mode的特性，优先级最高。

### 7.1 Concurrent Mode是什么？

Concurrent Mode是React16中引入的一种新的模式，用于提高React的性能。Concurrent Mode通过将任务分成多个小任务，每个小任务执行时间不超过5ms，从而避免页面卡顿。

### 7.2 Concurrent Mode的工作原理？

Concurrent Mode的工作原理主要包括

- 底层架构：Fiber架构
- 架构驱动：Scheduler
- 运行策略：lane模型