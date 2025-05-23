### 一、Promise 基础概念

前端异步编程

#### 定义

Promise 是一个构造函数，用于表示一个可能现在还没有结果，但将来某一时刻会完成的异步操作。
它封装了异步操作的成功值和失败原因（或异常）。

#### 状态

Promise 有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。
状态只能由 Pending 转变为 Fulfilled 或 Rejected，且状态一旦改变就不能再变。
throw 等同于 reject

#### 方法

```js
// 异步操作方法定义
let p = new Promise((resolve, reject) => {
  resolve("success");
  // reject('fail')
});
// 异步方法有结果后的回调
p.then(
  (res) => res * 2,
  (err) => {}
)
  .then(
    (res1) => {
      console.log(res1);
    },
    (err) => {}
  ) // res1 = res*2
  .catch((err) => {})
  .finally(() => {});
```

- resolve(value)：将 Promise 的状态从 Pending 变为 Fulfilled，并将结果作为参数传递。
- reject(reason)：将 Promise 的状态从 Pending 变为 Rejected，并将错误原因作为参数传递。
- then(onFulfilled, onRejected)：当 Promise 状态改变时，调用相应的回调函数。onFulfilled 是 Fulfilled 状态的回调函数，onRejected 是 Rejected 状态的回调函数。
- catch(onRejected)：是.then(null, onRejected)的简写，用于捕获 Promise 链中的错误。
- finally(onFinally)：无论 Promise 最终状态如何，都会执行该函数。

### 二、promise 原理

1. 状态的变更（resolve -> Fulfilled reject -> Rejected）
2. 状态只变更一次
3. throw 等同于 reject(try...catch...)
4. 链式调用
   4.1 FIFO-回调函数队列 （存储队列）
   4.2 then 返回的是一个 Promise 对象才能继续支持调用下一个 then（then 返回的结果会传给下一个 then()）
5. 其他方法（all race allSettled any)
   5.1 all([p1,p2,...]) ---如果所有 Promise 都成功，则返回成功结果数组;如果有一个 Promise 失败，则返回这个失败结果；
   5.2 race() ---哪个 Promise 最快得到结果，就返回那个结果，无论成功失败；
   5.3 allSettled() ---把每一个 Promise 的结果，集合成数组后返回；
   5.4 any() ---如果有一个 Promise 成功，则返回这个成功结果;如果所有 Promise 都失败，则报错；

### 三、promise 实现

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      // 待执行队列，先进先出，取出后并传入当前结果后执行
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult);
            if (x === thenPromise) {
              // 不能返回自身哦
              throw new Error("不能返回自身。。。");
            }
            if (x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(x);
            }
          } catch (err) {
            // 处理报错
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }
}
```

### 4.async/await（Generator 和 Promise ）

#### 用同步的方式执行异步操作

```js
request(5).then((res1) => {
  console.log(res1); // 1秒后 输出 10

  request(res1).then((res2) => {
    console.log(res2); // 2秒后 输出 20
  });
});
// 转
async function fn() {
  const res1 = await request(5);
  const res2 = await request(res1);
  console.log(res2); // 2秒后输出 20
}
fn();
```

#### async

**Q：什么是 async？async 是一个位于 function 之前的前缀，只有 async 函数中，才能使用 await。那 async 执行完是返回是什么？**
**_A: async 是一个通过异步执行并隐式返回 Promise 作为结果的函数_**

```js
async function fn() {}
console.log(fn); // [AsyncFunction: fn]
console.log(fn()); // Promise {<fulfilled>: undefined}
```

可以看出，async 函数执行完会自动返回一个状态为 fulfilled 的 Promise，也就是成功状态，但是值却是 undefined，那要怎么才能使值不是 undefined 呢？只要函数有 return 返回值就行了。

```js
async function fn(num) {
  return num;
}
console.log(fn); // [AsyncFunction: fn]
console.log(fn(10)); // Promise {<fulfilled>: 10}
fn(10).then((res) => console.log(res)); // 10
```

#### await

**Q：await 是什么?**
**_A: 将 await 后面的任务添加到微任务队列等待被执行_**

#### 总结：

```
1. await只能在async函数中使用，不然会报错；
2. async函数返回的是一个Promise对象，有无值看有无return值；
3. await后面最好是接Promise，虽然接其他值也能达到排队效；
4. async/await作用是用同步方式，执行异步操作
```

**async/await 是一种语法糖，用到的是 ES6 里的迭代函数——generator 函数**
--> 先分析有哪些功能，再去对应实现 ===> Generator + Promise = async/await

### 5.generator 函数

#### 5.1 介绍

generator 函数跟普通函数在写法上的区别就是，多了一个星号 \* ，并且只有在 generator 函数中才能使用 yield，而 yield 相当于 generator 函数执行的中途暂停点，而怎么才能暂停后继续走呢？那就得使用到 next 方法，next 方法执行后会返回一个对象，对象中有 value 和 done 两个属性

- value：暂停点后面接的值，也就是 yield 后面接的值；
- done：是否 generator 函数已走完，没走完为 false，走完为 true；

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next()); // { value: 2, done: false }
console.log(g.next()); // { value: 3, done: false }
console.log(g.next()); // { value: undefined, done: true }
```

- **yield 后接普通函数**，到了对应暂停点 yield，会马上执行此函数，并且该函数的执行返回值，会被当做此暂停点对象的 value

```js
function fn(num) {
  console.log(num);
  return num;
}
function* gen() {
  yield fn(1);
  yield fn(2);
  return 3;
}
const g = gen();
console.log(g.next());
// 1
// { value: 1, done: false }
console.log(g.next());
// 2
//  { value: 2, done: false }
console.log(g.next());
// { value: 3, done: true }
```

- **yield 后接 promise**,到了对应暂停点 yield,会返回一个 promise 对象

```js
function fn(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num);
    }, 1000);
  });
}
function* gen() {
  yield fn(1);
  yield fn(2);
  return 3;
}
const g = gen();
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: 3, done: true }
```

- next 函数传参， generator 函数可以用 next 方法来传参，并且可以通过 yield 来接收这个参数，注意两点

1. 第一次 next 传参是没用的，只有从第二次开始 next 传参才有用；(一步一步执行，有停顿)
2. next 传值时，要记住顺序是，先右边 yield，后左边接收参数；

```js
function* gen() {
  const num1 = yield 1;
  console.log(num1);
  const num2 = yield 2;
  console.log(num2);
  return 3;
}
const g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next(11111));
// 11111
//  { value: 2, done: false }
console.log(g.next(22222));
// 22222
// { value: 3, done: true }
```

#### 5.2 实现 async/await

- 1. yield 后面接 Promise；
- 2. next 函数传参；

```js
function fn(nums) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums * 2);
    }, 1000);
  });
}
function* gen() {
  const num1 = yield fn(1);
  const num2 = yield fn(num1);
  const num3 = yield fn(num2);
  return num3;
}
function generatorToAsync(generatorFn) {
  return function () {
    return new Promise((resolve, reject) => {
      const g = generatorFn();
      const next1 = g.next();
      next1.value.then((res1) => {
        const next2 = g.next(res1); // 传入上次的res1
        next2.value.then((res2) => {
          const next3 = g.next(res2); // 传入上次的res2
          next3.value.then((res3) => {
            // 传入上次的res3
            resolve(g.next(res3).value);
          });
        });
      });
    });
  };
}

const asyncFn = generatorToAsync(gen);

asyncFn().then((res) => console.log(res)); // 3秒后输出 8
```

#### 其他

[JavaScript 引擎是如何实现 async/await 的](https://cloud.tencent.com/developer/article/1965452)
