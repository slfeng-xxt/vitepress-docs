# es6

```txt
介绍：

ES6（ECMAScript 2015）是JavaScript的一个重大更新版本，它引入了许多新特性和改进，使得JavaScript更加强大和易于使用。以下是一份关于ES6相关学习笔记的概述：
```

## 1. let和const

### 1.1特点

* **let**：用于声明一个块作用域局部变量，其作用域为声明所在的块级作用域内，并且不会提升变量声明。
* **const**：用于声明一个只读的常量，一旦声明，其值就不能被重新赋值（但如果是对象或数组，则可以修改其内部属性或元素）。同样具有块级作用域。
***使用 const 声明对象属性可以避免误修改，同时使用 Object.freeze() 方法可以将对象冻结，防止意外修改对象属性***

```javascript
const obj = { name: 'Alice' };
obj.name = 'Bob'; // 修改成功
Object.freeze(obj);
obj.name = 'Charlie'; // 修改失败，抛出 TypeError
```

### 1.2实现原理

底层实现上，let 和 const 的工作方式是通过 JavaScript 引擎来实现的。在 JavaScript 引擎中，每一个变量都会被封装在一个称为“变量对象”的容器中，这个对象包含了所有当前上下文中定义的变量与函数。变量对象类似于一个键/值对的容器，其中键是变量名，值是变量的值。在 JavaScript 引擎中，使用 let 和 const 定义变量，实际上是将该变量定义在了一个块级作用域中，而块级作用域是由编译器在编译阶段中实现的。

#### 1.2.1 let

1. 编译阶段
在代码编译阶段，编译器会扫描整个函数体（或全局作用域），查找所有使用 let 定义的变量，为这些变量生成一个初始值为 undefined 的词法环境（LexicalEnvironment）并将其保存在作用域链中。
2. 进入执行上下文
当进入执行块级作用域（包括 for、if、while 和 switch 等语句块）后，会创建一个新的词法环境。如果执行块级作用域中包含 let 变量声明语句，这些变量将被添加到这个词法环境的环境记录中。
3. 绑定变量值
运行到 let 定义的变量时，JavaScript 引擎会在当前词法环境中搜索该变量。首先在当前环境记录中找到这个变量，如果不存在变量，则向包含当前环境的外部环境记录搜索变量，直到全局作用域为止。如果变量值没有被绑定，JavaScript 引擎会将其绑定为 undefined，否则继续执行其他操作。
4. 实现块级作用域
使用 let 定义变量时，在运行时不会在当前作用域之外创建单独的执行上下文，而是会创建子遮蔽（shadowing）新环境。在子遮蔽的词法环境中，变量的值只在最接近的块级作用域内有效。

#### 1.2.2 const

const 具有与 let 相同的底层实现原理，区别在于 const 定义的变量被视为常量（在赋值之后无法更改），因此变量声明时 必须初始化。此外，应该注意的是，使用 const 声明的对象是可以修改属性的。在定义 const 对象时，对象本身是常量，而不是对象的属性。只有对象本身不能被修改，而对象包含的属性可以任意修改。

### 1.3使用场景

* **let**：用于声明局部变量，如循环变量、函数参数等。
* **const**：用于声明常量，如配置项、函数参数等，确保其值不会被意外修改。

## 2. 解构赋值

* **数组解构**：允许你按照一定模式，从数组或类数组对象中提取值，对变量进行赋值。

```txt
实现原理：
第一步是使用取值函数（getter）读取数组中对应位置的值，
第二步是将取得的值赋值给目标变量。
```

```js
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3
```

* **对象解构**：允许你从对象中提取数据，将其值赋给声明的变量。

```txt
解构对象变量的过程与解构数组变量非常类似。将会遍历对象中的每一个属性，然后在解构表达式中查找同名的变量。
```

```js
const { name, age } = { name: 'Alice', age: 25 };
console.log(name, age); // Alice 25

// 简单理解如下：
const tempObject = { firstname: 'John', lastname: 'Doe' };
const first = tempObject.firstname;
const last = tempObject.lastname;
console.log(first, last); // John Doe
```

## 3. 模板字符串

* 模板字符串使用反引号（\`）来标识，可以包含占位符（${expression}），支持多行字符串和字符串插值。

模板字符串的实现原理，可以大致分为两个步骤：

```txt
首先，JavaScript 引擎会将模板字符串解析成一个函数调用表达式；
接着，这个表达式会被执行，并输出一个最终的字符串。
```

## 4. 箭头函数

* 箭头函数提供了一种更简洁的函数书写方式，它不使用function关键字，而是使用箭头（=>）来定义函数。
* 箭头函数不绑定自己的this，arguments，super或new.target。这些函数表达式更适合用于非方法函数，并且它们不能用作构造函数。

### 4.1 了解

它可以创建一个函数并赋值给变量，使用箭头语法'=>'。在箭头函数中，this 关键字的作用域与它周围代码作用域相同，因而有时也被称为“词法作用域函数”。

### 4.2 基础

箭头函数的原理是基于JavaScript中的闭包、this和参数作用域。在箭头函数中，this关键字始终指向函数所在上下文的this指针，而不是所在作用域的this指针。

### 4.3 箭头函数与普通函数有哪些不同？

* 箭头函数没有自己的this，它会捕获其所在上下文的this值，作为自己的this值。
* 箭头函数没有自己的arguments对象，它会捕获其所在上下文的arguments对象，作为自己的arguments对象。
* 箭头函数不能用作构造函数，不能使用new关键字调用。
* 箭头函数没有prototype属性，不能使用call、apply、bind方法来改变this的指向。

### 4.4 应用场景

1. 箭头函数在以下场景中特别有用：

* 简单函数表达式：当函数体只有一个表达式时，可以省略大括号和return关键字。
* 回调函数：在处理异步操作时，箭头函数可以简化回调函数的书写。
* 简化对象方法：在对象字面量中，可以使用箭头函数来定义对象的方法。
* 简化数组方法：在数组方法（如map、filter、reduce等）中，可以使用箭头函数来简化代码。

```js
// 简单函数表达式
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// 回调函数
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(n => n * n);
console.log(squared); // [1, 4, 9, 16, 25]

// 简化对象方法
const person = {
  name: 'Alice',
  sayHello: () => console.log(`Hello, my name is ${this.name}`) // 错误，this.name 为 undefined
};
person.sayHello(); // Hello, my name is undefined

// 简化数组方法
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15
```

2.当我们需要引用所在父级的this指针时，可以使用箭头函数，因为箭头函数中的this指向的是全局对象，而不是函数调用时的上下文对象。而不使用箭头函数时，这里会因为this指针指向的问题而带来一些不便。

```js
const obj = {
  name: 'Tom',
  age: 20,
  say: function() {
    console.log(`My name is ${this.name}, I'm ${this.age} years old`);
  }
};
// setTimeout 中的this指向的是全局对象，而不是obj对象
setTimeout(obj.say, 1000); // My name is undefined, I'm undefined years old
```

```js
const obj = {
  name: 'Tom',
  age: 20,
  say: function() {
    // 使用箭头函数，this指向的是obj对象
    setTimeout(() => {
      console.log(`My name is ${this.name}, I'm ${this.age} years old`);
    }, 1000);
  }
};

obj.say(); // My name is Tom, I'm 20 years old
```

## 5. 类的引入

* ES6引入了类的概念，这是一种新的语法糖，用于创建对象和处理继承。类使得面向对象编程在JavaScript中变得更加容易和直观。

**说明：**
JavaScript 的类最终也是一种函数，，JavaScript 的 class 语法只是语法糖，使用 class 关键字创建的类会被编译成一个函数，因此其底层原理与函数有一些相似之处。

**问题**
Q1：JavaScript 原型继承实现继承的有哪些方式？
构造器借用、寄生式继承、组合继承

Q2:Class 语法继承，最接近我们自己实现的那种继承方式？
寄生+组合

### 5.1 类的构造函数（constructor）

* 类的构造函数用于创建和初始化类的实例。当创建类的实例时，构造函数会被调用。

```txt
1. 使用 class 关键字来定义类时，在内部会创建一个特殊的函数，称为构造函数（constructor）。构造函数用于在创建对象时初始化对象的属性，类似于传统的基于原型的代码中的构造函数。
2. class 中定义的属性和方法分别定义在这个构造函数的 prototype 属性中。并且与原型方式不同的是，类的方法是不可枚举的，因此无法使用 for...in 循环遍历类实例对象的属性和方法。
3. 需要注意的是，在 ES6 中，通过 class 定义的对象默认不可枚举，就算没有显式地设置 enumerable 属性。这与使用 Object.defineProperty() 方法在 ES5 中设置不可枚举属性的方式不同。如果需要将 class 中的某个属性或方法设置为可枚举属性，需要使用 Object.defineProperty() 方法来进行设置。
```

### 5.2 类的继承（extends）

* 类可以通过extends关键字继承另一个类，从而实现代码的复用和扩展。

```txt
0. 在 JavaScript 中，继承是通过类的 prototype 属性实现的。
1. 在 ES6 中，类可以通过 extends 关键字继承另一个类，从而实现代码的复用和扩展。继承的类称为子类，被继承的类称为父类。
2. 子类通过 extends 关键字继承父类，并在子类的构造函数中调用 super() 方法来调用父类的构造函数，从而实现父类属性的初始化。
3. 子类可以重写父类的方法，也可以添加自己的方法。
4. 子类可以通过 super 关键字调用父类的属性和方法，super 关键字只能在子类的构造函数和实例方法中使用。
```

### 5.3 类的静态方法（static）

```js
class Person {
    static species = "human";

    static saySpecies() {
        console.log(`We are ${this.species}.`);
    }
}
```

* 静态方法属于类本身，而不是类的实例。可以通过类名直接调用静态方法。

```txt
0. 在 JavaScript 中，静态方法是通过在类中定义一个函数，并在函数前面加上 static 关键字来实现的。
1. 静态方法属于类本身，而不是类的实例。可以通过类名直接调用静态方法。
2. 静态方法不能通过类的实例调用，只能通过类名调用。
3. 静态方法可以访问类的静态属性，但不能访问类的实例属性。
4. 静态方法可以用于定义类的工具函数，或者定义类的初始化方法。
```

* 静态方法通常用于定义类的工具函数，或者定义类的初始化方法。

```txt
例如，在 JavaScript 中，Array 类的静态方法 from() 可以将类数组对象转换为数组，而 Array 类的静态方法 of() 可以创建一个包含指定元素的数组。这些方法都是静态方法，可以直接通过类名调用，而不需要创建类的实例。
```

* 静态属性和实例属性的区别

```txt
静态属性是属于类本身的属性，而实例属性是属于类实例的属性。
静态属性可以通过类名直接访问，而实例属性需要通过类的实例来访问。
例如，在 JavaScript 中，Array 类的静态属性 length 是属于 Array 类本身的属性，可以通过 Array.length 来访问。而 Array 类的实例属性 length 是属于 Array 类实例的属性，需要通过 Array 的实例来访问，例如 new Array(5).length。
```

### 5.4 getter/setter

在类中定义 getter 和 setter 方法可以让我们封装实例的内部数据属性，使得这些属性的读写行为更加的安全和合理。

```js
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  get name() {
    return `${this.first} ${this.last}`;
  }

  // 👇️ Define setter
  set name(name) {
    this.first = name.split(' ')[0];
    this.last = name.split(' ')[1];
  }
}

const p1 = new Person('John', 'Smith');

// ✅ Use setter
p1.name = 'Bobby Hadz';

console.log(p1.name); // 👉️ "Bobby Hadz"
```

#### 5.5 class表达式

ES6 还引入了 class 表达式，可以通过这种表达式来创建函数对象。

```js
const Person = class {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHi() {
        console.log(`Hi, my name is ${this.name}, I'm ${this.age} years old.`);
    }
};
```

总体来说，JavaScript 的类本质上是一个函数，使用 class 关键字来声明类只是伪代码，这些代码最终都会被转成函数，并存在函数对象的属性和原型属性上。

## 6. Promise

* Promise是异步编程的一种解决方案，它代表了一个最终可能完成（或失败）及其结果值的异步操作。
* 使用Promise可以避免回调地狱，使异步代码更加易于阅读和维护。

## 7. 扩展运算符（Spread Operator）和剩余参数（Rest Parameters）

* **扩展运算符（...）**：允许一个表达式在某些地方展开为多个元素（在函数调用时使用）或在多个地方展开为单个元素（在数组字面量或对象字面量表达式中使用）。
* **剩余参数（...args）**：允许你将一个不定数量的参数表示为一个数组。

## 8. 默认参数和命名参数

* **默认参数**：允许在函数定义时为参数设置默认值，从而避免在函数体内部进行条件判断。
* ES6本身没有直接引入命名参数，但可以通过解构赋值等方式间接实现类似的功能。

## 9. Symbol

* Symbol是一种新的原始数据类型，表示独一无二的值。它可以用作对象的属性名，以确保属性名的唯一性。

## 10. 模块化

* ES6引入了模块（Module）的概念，用于将JavaScript代码分割成可重用的单元。
* 使用`import`和`export`语句可以实现模块之间的导入和导出。

## 11. 生成器（Generator）

* 生成器是一种特殊的函数，它可以在执行过程中暂停和恢复，从而实现异步编程。

## 12. Proxy

* Proxy是一种用于定义基本操作（如属性查找、赋值、枚举、函数调用等）的自定义行为的对象。

## 13. Set和Map

* Set是一种新的数据结构，类似于数组，但成员的值都是唯一的，没有重复的值。
* Map是一种新的数据结构，类似于对象，但键可以是任意类型。

## 14. for...of循环

* for...of循环是一种新的循环语法，用于遍历可迭代对象（如数组、字符串、Map、Set等）。
* 它与for...in循环不同，for...of循环可以正确地遍历对象的属性值，而for...in循环会遍历对象的所有可枚举属性，包括原型链上的属性。

### 示例代码

for...of

```javascript
// for...of循环遍历数组
const arr = [1, 2, 3, 4, 5];
for (const num of arr) {
  console.log(num); // 1 2 3 4 5
}

// for...of循环遍历字符串
const str = "hello";
for (const char of str) {
  console.log(char); // h e l l o
}

// for...of循环遍历Map
const map = new Map([["a", 1], ["b", 2], ["c", 3]]);
for (const [key, value] of map) {
  console.log(key, value); // a 1 b 2 c 3
}

// for...of循环遍历Set
const set = new Set([1, 2, 3, 4, 5]);
for (const num of set) {
  console.log(num); // 1 2 3 4 5
}
```

for...in

```javascript
// for...in循环遍历对象的可枚举属性
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  console.log(key, obj[key]); // a 1 b 2 c 3
}
// 配置属性不可枚举
Object.defineProperty(obj, "d", {
  value: 4,
  enumerable: false
});
for (const key in obj) {
  console.log(key, obj[key]); // a 1 b 2 c 3
}

// for...in循环遍历数组的索引
const arr = [1, 2, 3, 4, 5];
for (const index in arr) {
  console.log(index, arr[index]); // 0 1 1 2 2 3 3 4 4 5 5
}
```

## 15.解构赋值

```javascript
// 数组解构
let [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 对象解构
let { name, age } = { name: "Alice", age: 30 };
console.log(name, age); // Alice 30
```

## 16. 箭头函数

```javascript
// 箭头函数
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// 箭头函数没有自己的this
const obj = {
  value: 1,
  getValue: () => this.value,
  getValueUsingFunction: function() {
    return this.value;
  }
};

console.log(obj.getValue()); // undefined，因为箭头函数的this指向全局对象
console.log(obj.getValueUsingFunction()); // 1，因为普通函数的this指向调用它的对象
```

## 学习建议

* **实践为主**：学习ES6的最佳方式是通过编写代码来实践。尝试将新学的特性应用到实际项目中，以加深理解。
* **阅读官方文档**：ECMAScript官方文档是了解ES6及其后续版本特性的权威来源。
* **参考教程和书籍**：有许多优秀的在线教程和书籍可以帮助你系统地学习ES6。
* **参与社区讨论**：加入JavaScript相关的社区或论坛，与其他开发者交流学习心得，解答疑惑。
