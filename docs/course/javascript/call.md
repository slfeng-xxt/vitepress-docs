### 背景

```txt
JavaScript 的一大特点是，函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。
```

#### 一、作用

**call、apply、bind 作用是改变函数执行时的上下文，简而言之就是改变函数运行时的 this 指向**

举例：

```js
function fruits() {}

fruits.prototype = {
  color: "black",
  say: function () {
    console.log("My color is " + this.color);
  },
};

var f = new fruits();
f.say(); //My color is black
// 如果我们有一个对象banana= {color : 'yellow'} ,我们不想对它重新定义say方法,而是委托f中的say方法，并修改this
banana = {
  color: "yellow",
};
apple = {
  color: "red",
};
pear = {
  color: "green",
};

f.say.call(banana); //My color is yellow
f.say.apply(apple); //My color is red

const fb = f.say.bind(pear);
fb(); //My color is green
```

#### 二、区别

##### apply、call：

- apply、call 作用完全一样，只是接受参数的方式不太一样。
- 改变 this 指向后原函数会立即执行，且此方法只是临时改变 this 指向一次

```js
// 参数区别
var func = function (arg1, arg2) {};
func.call(this, arg1, arg2);
func.apply(this, [arg1, arg2]);
```

##### bind

- bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind()方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。
- 改变 this 指向后不会立即执行【稍后调用】，而是返回一个永久改变 this 指向的函数

```js
// 使用_this等保存this ，以便在改变了上下文之后继续引用到它
var foo = {
  bar: 1,
  eventBind: function () {
    var _this = this;
    $(".someClass").on("click", function (event) {
      /* Act on the event */
      console.log(_this.bar);
    });
  },
};
// 使用bind()方法创建了一个新函数，当这个click事件绑定在被调用的时候，this指向调用bind()时传入的第一个参数（即foo对象）。
var foo = {
  bar: 1,
  eventBind: function () {
    $(".someClass").on(
      "click",
      function (event) {
        /* Act on the event */
        console.log(this.bar);
      }.bind(this)
    );
  },
};
```

**小结**
apply、call、bind 三者的区别在于：

三者都可以改变函数的 this 对象指向
三者第一个参数都是 this 要指向的对象，如果如果没有这个参数或参数为 undefined 或 null，则默认指向全局 window
三者都可以传参，但是 apply 是数组，而 call 是参数列表，且 apply 和 call 是一次性传入参数，而 bind 可以分为多次传入
bind 是返回绑定 this 之后的函数，apply、call 则是立即执行

#### 三、实现

##### call

1. 将函数设为对象的属性；
2. 执行该函数；
3. 删除该函数；

```js
Function.prototype.call2Mine = function (context, ...args) {
  // 判断是否是undefined和null
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  let fnSymbol = Symbol(); // 唯一的 不会冲突
  context[fnSymbol] = this;
  let result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};
```

##### apply

```js
Function.prototype.apply2Mine = function (context, args) {
  // 判断是否是undefined和null
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  let fnSymbol = Symbol();
  context[fnSymbol] = this;
  let result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};
```

##### bind

```js
Function.prototype.bind2 = function (context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

#### 四、应用场景

[apply、call、bind 的使用场景](https://blog.csdn.net/liuqinrui520/article/details/136731748)

判断对象类型

```js
var arr = [];

//把函数体Object.prototype.toString()方法内部的this，绑到arr的执行环境（作用域）
Object.prototype.toString.call(arr); // [object Array]
```

类数组转数组

```js
var arrayLike = { 0: "name", 1: "age", 2: "sex", length: 3 };
// 1. slice
Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"]
// 2. splice
Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"]
// 3. ES6 Array.from
Array.from(arrayLike); // ["name", "age", "sex"]
// 4. apply
Array.prototype.concat.apply([], arrayLike);
```

找出数组中最大或最小的元素

```js
var a = [10, 2, 4, 15, 9];
Math.max.apply(Math, a); // 15
Math.min.apply(null, a); // 2
/* ES6的方法 */
Math.max(...[10, 2, 4, 15, 9]); // 12 等同于Math.max(10, 2, 4, 15, 9);
```

数组追加

```js
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
[].push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]
console.log(arr2); // [4, 5, 6]
/* ES6的方法 */
arr1.push(...arr2); // [1, 2, 3, 4, 5, 6]
```

数组合并

```js
var arr1 = [1, 2, { id: 1, id: 2 }, [1, 2]];
var arr2 = ["ds", 1, 9, { name: "jack" }];
// var arr = arr1.concat(arr2);//简单做法
Array.prototype.push.apply(arr1, arr2);
console.log(arr1);
/* ES6的方法 */
[...arr1, ...arr2];
```

实现继承：

```js
function peaple(name) {
  this.name = name;
  this.showName = function () {
    console.log(this.name);
  };
}
function student(name) {
  peaple.call(this, name);
}
var xiaoming = new student("xiaoming");

xiaoming.showName();
```

保存 this 变量,防止丢失上下文

```js
var foo = {
  bar: 1,
  eventBind: function () {
    var _this = this;
    $(".someClass").on("click", function (event) {
      console.log(_this.bar);
    });
  },
};
var foo = {
  bar: 1,
  eventBind: function () {
    $(".someClass").on(
      "click",
      function (event) {
        console.log(this.bar);
      }.bind(this)
    );
  },
};
```

[Object.prototype.toString.call()](https://zhuanlan.zhihu.com/p/118793721)
