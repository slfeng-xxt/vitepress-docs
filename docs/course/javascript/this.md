# this

## 0.前提了解

ECMAScript 的类型分为**语言类型**和**规范类型**。

1. ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的 Undefined, Null, Boolean, String, Number, 和 Object。
2. 规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。规范类型包括：**Reference（它与 this 的指向有着密切的关联。）**, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。

Reference 的构成，由三个组成部分，分别是：

- base value；就是属性所在的对象或者就是 EnvironmentRecord
  The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record
- referenced name；就是属性的名称。
- strict reference；严格模式标志（boolean）

### 参考链接

[JavaScript 深入之从 ECMAScript 规范解读 this](https://www.bookstack.cn/read/mqyqingfeng-JavaScript-advance/cb75ffa87707939f.md)

#### 1. this 的基本概念

在 JavaScript 中，this 是一个特殊的关键字，它引用的是函数运行时所在的上下文（context）。换句话说，this 的值取决于函数如何被调用，而不是函数如何被定义。谁调用谁就是 this

#### 2. this 的几种常见绑定

**默认绑定（Global/Window Object）**：在全局作用域或普通函数调用中，this 通常指向全局对象（在浏览器中是 window）。

```js
function foo() {
  console.log(this); // 输出 Window 对象
}
foo();
```

**隐式绑定（Object Invocation）**：当函数作为对象的方法被调用时，this 指向该对象

```js
var obj = {
  foo: function () {
    console.log(this); // 输出 obj 对象
  },
};
obj.foo();
```

**显式绑定（Call/Apply/Bind）**：使用 call、apply 或 bind 方法可以改变函数的 this 指向。

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 1 };
foo.call(obj); // 输出 1
```

**新建对象绑定（Constructor Invocation）**：使用 new 关键字创建一个新的对象实例时，构造函数中的 this 指向新创建的对象。

```js
function MyObject() {
  this.a = 1;
}
var obj = new MyObject();
console.log(obj.a); // 输出 1
```

**箭头函数中的 this**：箭头函数不绑定自己的 this，而是捕获其所在上下文的 this 值，作为自己的 this 值。

```js
var obj = {
  a: 1,
  foo: function () {
    setTimeout(() => {
      console.log(this.a); // 输出 1，因为箭头函数捕获了外部函数的this
    }, 0);
  },
};
obj.foo();
```

#### 3.注意事项

this 的值在函数执行时确定，而不是在函数定义时。
嵌套函数中的 this 通常不会继承外部函数的 this 值，除非使用 call、apply、bind 或箭头函数。
