# 第三节

## 1. node生命周期

### 1.1 启动

1. 启动node
2. 执行文件
3. 执行文件中的代码
4. 退出

### 1.2 事件循环

1. 执行全局的同步代码
2. 执行微任务
3. 执行宏任务

### 1.3 事件循环阶段

:::warning
事件循环中，每次打算执行一个阶段的回调时，都会先检查微任务队列，如果微任务队列中有任务，则先执行微任务队列中的任务
:::

1. `timers` 定时器阶段，例如：setTimeout/setInterval
2. pending callbacks 待定回调阶段，例如：TCP错误
3. idle, prepare 空闲，预备阶段，例如：等待数据，用于计算
4. `poll` 轮询阶段，例如：获取新的I/O事件，**适当的条件下node将阻塞在这里**
5. `check` 检查阶段，例如：setImmediate()的回调函数
6. close callbacks 关闭回调阶段，例如：socket.on('close')

```js
// setTimeout(callback,0)和setImmediate(calback)的性能对比
let i = 0;
console.time('timer');
function test() {
  i++;
  if (i === 10000) {
    console.timeEnd('timer');
  } else {
    setTimeout(test, 0); // timer: 11.787s
    // setImmediate(test); // timer: 143.624ms
  }
}
test();
// setTimeout和setImmediate的执行顺序和当前阶段有关
// 如果当前处于timers阶段，则setImmediate会先执行
// 如果当前处于check阶段，则setTimeout会先执行
// 如果两者都处于空闲阶段，则顺序由代码执行顺序决定
// 所以下面的代码打印结果不确定，可能是setTimeout先执行，也可能是setImmediate先执行
setTimeout(() => {
  console.log('setTimeout');
}, 0);
setImmediate(() => {
  console.log('setImmediate')
})

// 如果将setTimeout和setImmediate放在一个异步函数中，则setImmediate会先执行
// 因为异步函数中的代码会在当前阶段(poll阶段)执行完毕后，才会进入下一个阶段(check阶段)
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

:::tip
在node中，setTimeout的第二个参数默认为0，但实际执行时间并不是0，而是1ms

在浏览器中，setTimeout的第二个参数默认为4ms

在node中，setImmediate的执行时间是0ms

在浏览器中，setImmediate的执行时间是1ms
:::

### 1.4 宏任务

1. setTimeout
2. setInterval
3. setImmediate
4. I/O

### 1.5 微任务

1. Promise.resolve().then()
2. process.nextTick

- **ps: process.nextTick优先级高于Promise.then**

## 2. [EventEmitter🔗](https://www.nodejs.com.cn/api/events.html#class-eventemitter)

eventEmitter是node中一个非常重要的模块，它是一个事件触发与事件监听器功能的封装

### 2.1 基本用法

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('event', () => {
  console.log('event triggered');
});
emitter.emit('event');
```

### 2.2 封装一个网络请求模块

```js
const EventEmitter = require('events');
const http = require('http');
// 封装一个网络请求模块
class Request extends EventEmitter {
  constructor(url, options) {
    super();
    this.url = url;
    this.options = options;
  }
  request(body='') {
    http.request(this.url, this.options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        this.emit('response', data); // 触发response事件
      });
    });
  }
}
// 使用
const req = new Request('http://www.baidu.com', {});
req.on('response', (data) => { // 监听response事件
  console.log(data);
});
req.request();
```
