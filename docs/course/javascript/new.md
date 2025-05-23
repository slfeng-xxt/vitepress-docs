#### 一、模拟 new,构建一个函数工厂

**实现原理**

1. 创建实例对象：用 new Object() 的方式新建了一个对象 obj；
2. 创建构造函数：取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数；
3. 构建原型链关系：将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性；
4. 委托：使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性；
5. 返回 obj；

```js
function objectFactory() {
  var obj = new Object(),
    Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === "object" ? ret : obj;
}
// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.strength = 60;
  //this.habit = 'Games';
  return {
    name: name,
    habit: "Games",
    sayYourName: function () {
      console.log("I am " + this.name);
    },
  };
}

//Person.prototype.strength = 60;
//Person.prototype.sayYourName = function () {
//  console.log('I am ' + this.name);
//}
// new Person()
var person = new Person("tom", "21");
console.log(person.name); // tom
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.age); // undefined

// 模拟new Person，实现创建对象实例
var personByFactory = objectFactory(Person, "Kevin", "18");

console.log(personByFactory.name); // Kevin
console.log(personByFactory.habit); // Games
console.log(personByFactory.strength); // 60
personByFactory.sayYourName(); // I am Kevin
```

#### 二、创建对象的多种方式

[JavaScript 深入之创建对象的多种方式以及优缺点](https://zhuanlan.zhihu.com/p/20262461006)
2.1 工厂模式(所有实例指向同一个原型)

```js
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("kevin");
```

2.2 构造函数模式(创建的对象可以通过 instanceof 来识别)

```js
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person("kevin");
```

原型模式(所有属性和方法共享)

```js
function Person(name) {}

Person.prototype = {
  constructor: Person,
  name: "xianzao",
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();
```

2.3 组合模式(构造函数+原型)（私有共享部分隔离）

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();
```

2.4 动态原型模式

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype = {
      constructor: Person,
      getName: function () {
        console.log(this.name);
      },
    };
  }
}

var person1 = new Person("xianzao");
console.log(person1.__proto__); // {}
var person2 = new Person("zaoxian");
console.log(person2.__proto__); // {getName: f()}
// 报错 并没有该方法,执行过程中给Person中添加方法，之后再调用构造函数时候就有该方法了
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
```

#### 三、继承的多种方式

[Javascript 6 大继承 最优是寄生组合继承](https://juejin.cn/post/7017335994961625102)

3.1 原型链继承(属性被所有实例共享)

```js
function Parent() {
  this.name = "xianzao";
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child() {}

Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()); // xianzao
```

转换结构图

```
    Person    ---------    Person.prototype  (添加 .getName()方法)
      |                    /
      |                   / .__proto__
      |                 /
   new Person   ------/
     |
     |
     ------------------------
                             |
                             |
   Child    ---------    Child.prototype
      |                      /
      |                     / .__proto__
      |                   /
 new Child(child1)   ----/

```

🌰

```js
function Parent() {
  this.names = ["xianzao", "zaoxian"];
}

function Child() {}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push("test");

console.log(child1.names); // ["xianzao", "zaoxian", "test"]

var child2 = new Child();

console.log(child2.names); // ["xianzao", "zaoxian", "test"]
```

3.2 借用构造函数(避免属性被所有实例共享， 可以在 child 中向 parent 传参)

```js
function Parent() {
  this.names = ["xianzao", "zaoxian"];
}

function Child() {
  Parent.call(this); // 借用Parent.names
}

var child1 = new Child();

child1.names.push("test");

console.log(child1.names); // ["xianzao", "zaoxian", "test"]

var child2 = new Child();

console.log(child2.names); // ["xianzao", "zaoxian"]
```

3.3 组合继承(原型链+借用构造函数)

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);

  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child("kevin", "18");

child1.colors.push("black");

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child("daisy", "20");

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

3.4 原型继承(引用类型的属性值会被共享)

```js
function creatObj(obj) {
  function Fn() {}
  Fn.prototype = obj;
  return new Fn();
}
var person = {
  name: "kevin",
  friends: ["daisy", "kelly"],
};

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = "person1";
console.log(person2.name); // kevin

person1.friends.push("taylor");
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

结构转换

```
   Fn    ------------>    Fn.prototype = obj  <--------  obj
   |                        |
   |                        | .__proto__
  person1 = new Fn()  -------
                            |
  person2 = new Fn()  -------
```

3.5 寄生式继承（优缺点和原型式继承一样）
使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，

```js
// 该函数在内部以某种形式来做增强对象，最后返回对象。
let parent5 = {
  name: "parent5",
  friends: ["p1", "p2", "p3"],
  getName: function () {
    return this.name;
  },
};

function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function () {
    return this.friends;
  };
  return clone;
}

let person5 = clone(parent5);

console.log(person5.getName());
console.log(person5.getFriends());
```

3.6 寄生组合式继承（**最优继承方式**）

```js
// 组合继承
function Parent6() {
  this.name = "parent6";
  this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
  return this.name;
};
function Child6() {
  Parent6.call(this);
  this.friends = "child6";
}

function clone(parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

clone(Parent6, Child6);
// 寄生继承
Child6.prototype.getFriends = function () {
  return this.friends;
};

let person6 = new Child6();
console.log(person6);
console.log(person6.getName());
console.log(person6.getFriends());

// 它可以解决组合继承 父类被调用两次和在不同层级属性重复的问题。
```

应用：ES6 中 extents 语法糖的实现

```js
class Person {
  constructor(name) {
    this.name = name;
  } // 原型方法 // 即 Person.prototype.getName = function() { } // 下面可以简写为 getName() {...}
  getName = function () {
    console.log("Person:", this.name);
  };
}
class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name);
    this.age = age;
  }
}
const juiceice = new Gamer("juiceice", 20);
juiceice.getName(); // 成功访问到父类的方法
```
