# TypeScript

- TypeScript 官方没有做运行环境，只提供编译器。编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。
- TypeScript 代码只涉及类型，不涉及值。所有跟“值”相关的处理，都由 JavaScript 完成。
- TypeScript 的编译过程，实际上就是把“类型代码”全部拿掉，只保留“值代码”。

## 1.any

### any:（top type）

any 类型主要适用以下两个场合。

- 1.出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为 any。
- 2.为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为 any。有些年代很久的大型 JavaScript 项目，尤其是别人的代码，很难为每一行适配正确的类型，
  这时你为那些类型复杂的变量加上 any，TypeScript 编译时就不会报错。

注意

- any 类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他变量。它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。

### unknown：（top type）

为了解决 any 类型“污染”其他变量的问题，TypeScript 3.0 引入了 unknown 类型。它与 any 含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像 any 那样自由，可以视为严格版的 any。

怎么才能使用 unknown 类型变量呢？
只有经过“类型缩小”，unknown 类型变量才可以使用。所谓“类型缩小”，就是缩小 unknown 变量的类型范围，确保不会出错。

注意：
1.unknown 类型的变量，不能直接赋值给其他类型的变量（除了 any 类型和 unknown 类型）。 2.不能直接调用 unknown 类型变量的方法和属性。
3.unknown 类型变量能够进行的运算是有限的，只能进行比较运算（运算符==、===、!=、!==、||、&&、?）、取反运算（运算符!）、typeof 运算符和 instanceof 运算符这几种，其他运算都会报错。

### never:（bottom type）

- never 类型的使用场景
1.主要是在一些类型运算之中，保证类型运算的完整性
2.不可能返回值的函数，返回值的类型就可以写成 never
3.如果一个变量可能有多种类型（即联合类型），通常需要使用分支处理每一种类型。这时，处理所有可能的类型之后，剩余的情况就属于 never 类型。

- never 类型的一个重要特点是，可以赋值给任意其他类型。
【TypeScript 就相应规定，任何类型都包含了 never 类型。因此，never 类型是任何其他类型所共有的，TypeScript 把这种情况称为“底层类型”（bottom type）。】

## 2.类型系统

### js 类型: (boolean string number undefined null object bigint-ES2020 symbol-ES2015)

- 1.undefined 类型只包含一个值undefined，表示未定义（即还未给出定义，以后可能会有定义）。
- 2.null 类型也只包含一个值null，表示为空（即此处没有值）。
- 3.undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们。作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为undefined或null——目的：跟 JavaScript 的行为保持一致。

注意： 大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象。建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象

### ts 类型：（string number boolean array tuple enum any voild null undefied never object union-| intersection-& unknown 值类型）

1. 大写的 Object 类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是 Object 类型，这囊括了几乎所有的值。
2. 小写的 object 类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值。
    注意，无论是大写的 Object 类型，还是小写的 object 类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中
3. TypeScript 规定，单个值也是一种类型，称为“值类型”。TypeScript 推断类型时，遇到 const 命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型。
    注意：
    - 3.1 const 命令声明的变量，如果赋值为对象，并不会推断为值类型。
    - 3.2 值类型可能会出现一些很奇怪的报错。const x: 5 = 4 + 1; // 报错（5 是 number 类型的子类型，父类型不能赋值给子类型）
    - 3.3 as(断言) const x: 5 = (4 + 1) as 5; // 正确
4. 联合类型：“类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。
5. 交叉类型的主要用途是表示对象的合成。常常用来为对象类型添加新属性。
6. 别名：type 命令用来定义一个类型的别名，别名不允许重名。别名的作用域是块级作用域。别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套。 type Age = number;let age: Age = 55;
7. typeof 运算符的移植：js 中运算一个值返回值的类型字符串，ts 中运算一个值返回该值的 TypeScript 类型；typeof 命令的参数不能是类型。

## 3.数组类型

数组（array）和元组（tuple）

### 数组

写法一：

```ts
let arr: number[];
```

写法二：

```ts
let arr: Array<number>;
```

#### 多维数组

```ts
var multi: number[][];
```

#### 只读数组

写法一：

```ts
const arr: readonly number[] = [0, 1];
```

写法二：

```ts
const a1: ReadonlyArray<number> = [0, 1];
const a2: Readonly<number[]> = [0, 1];
```

写法三：

```ts
const arr = [0, 1] as const; //（as const 告诉 TypeScript，推断类型时要把变量 arr 推断为只读数组，从而使得数组成员无法改变。）
```

注意： 1.只读数组是数组的父类型，所以它不能代替数组； 2. readonly 关键字不能与数组的泛型写法一起使用。const arr: readonly `Array<number>` = [0, 1];// 报错

### 元组

TypeScript 【特有】的数据类型，JavaScript 没有单独区分这种类型。
它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。元组【必须】明确声明每个成员的类型。越界的成员会报错。

```ts
const s: [string, string, boolean] = ["a", "b", true];
```

注意：

- 1.使用扩展运算符（...），可以表示不限成员数量的元组。

```ts
type NamedNums = [string, ...number[]];
const a: NamedNums = ["A", 1, 2];
const b: NamedNums = ["B", 1, 2, 3];
```

- 2.如果没有可选成员和扩展运算符，TypeScript 会推断出元组的成员数量（即元组长度）
- 3.如果包含了可选成员，TypeScript 会推断出可能的成员数量。
- 4.扩展运算符（...）将数组（注意，不是元组）转换成一个逗号分隔的序列，这时 TypeScript 会认为这个序列的成员数量是不确定的，因为数组的成员数量是不确定的。
使用扩展运算符传入函数参数，可能发生参数数量与数组长度不匹配的报错。
如何解决：a.就是把成员数量不确定的数组，写成成员数量确定的元组，再使用扩展运算符。b.使用 as const 断言。(这是一个只读的值类型，可以当作数组，也可以当作元组。)

#### 只读元组

写法一：

```ts
type t = readonly [number, string];
```

写法二：

```ts
type t = Readonly<[number, string]>;
```

注意：
只读元组是元组的父类型， 元组可以替代只读元组，而只读元组不能替代元组。如何解决：用 断言 as [number, number]

### 注意： TypeScript 的区分数组和元组的方法：成员类型写在方括号里面的就是元组，写在外面的就是数组

## 4.Symbol 类型

symbol & unique symbol

- symbol: symbol 类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。
let x: symbol = Symbol(); // Symbol 值不存在字面量，必须通过变量来引用，不是固定不变的值,所以写不出只包含单个 Symbol 值的那种值类型。
- unique symbol: 为了解决无法表示某一个【具体】的 Symbol 值，TypeScript 设计了 symbol 的一个子类型 unique symbol，它表示单个的、某个具体的 Symbol 值。
const x: unique symbol = Symbol(); 等价于 const x = Symbol();
  注意： 因为 unique symbol 表示单个值，所以这个类型的变量是不能修改值的，只能用 const 命令声明，不能用 let 声明。

### 注意

1. unique symbol 类型是 symbol 类型的子类型
2. unique symbol 类型的一个作用，就是用作属性名，这可以保证不会跟其他属性名冲突。如果要把某一个特定的 Symbol 值当作属性名，那么它的类型只能是 unique symbol，不能是 symbol。
3. unique symbol 类型也可以用作类（class）的属性值，但只能赋值给类的 readonly static 属性。
class C { static readonly foo: unique symbol = Symbol(); }

### 类型推断

1. let 命令声明的变量，推断类型为 symbol。
2. const 命令声明的变量，推断类型为 unique symbol。
3. const 命令声明的变量，如果赋值为另一个 symbol 类型的变量，则推断类型为 symbol。
4. let 命令声明的变量，如果赋值为另一个 unique symbol 类型的变量，则推断类型还是 symbol。

## 5.函数类型

写法一：

```ts
    const hello = function(txt: string) => { console.log(txt) } // 推断出变量hello的类型
```

写法二：

```ts
const hello: (txt:string) => void = function(txt) => { console.log(txt) } // 使用箭头函数的形式，为变量hello指定类型
```

写法三：

```ts
let hello: { (txt: string): void };
hello = function (txt) {
  console.log(txt);
}; // 采用对象的写法。{ (参数列表): 返回值 }
```

写法四：

```ts
interface myfn {
  (a: number, b: number): number;
}
let add: myfn = (a, b) => a + b; // 使用 Interface 来声明, 这种写法就是对象写法的翻版
```

注意：

1. 类型里面的参数名（本例是 txt）是必须的，如果写成(string) => void，TypeScript 会理解成函数有一个名叫 string 的参数，并且这个 string 参数的类型是 any。
2. 写法二用起来就很麻烦。因此，往往用 type 命令为函数类型定义一个别名，便于指定给其他变量。type MyFunc = (txt: string) => void;
3. 函数的实际参数个数，可以少于类型指定的参数个数，但是不能多于
4. 如果一个变量要套用另一个函数类型，有一个小技巧，就是使用 typeof 运算符。

```ts
function add(x: number, y: number) {
  return x + y;
}
const myAdd: typeof add = function (x, y) {
  return x * 2 + y;
};
```

5.写法三使用场合：函数本身存在属性的时候，类型就要使用对象的写法。

### Function 类型

TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型。

#### 可选参数

- 参数名带有问号，表示该参数的类型实际上是 原始类型|undefined
- 函数的可选参数只能在参数列表的尾部，跟在必选参数的后面。
- 函数体内部用到可选参数时，需要判断该参数是否为 undefined。
- 可选参数与默认值不能同时使用。

#### 只读参数

```ts
function arraySum(arr: readonly number[]) {
  // 如果函数体内部修改这个数组，就会报错。
  arr[0] = 0; // 报错
}
```

#### 函数 never 类型的应用

1. 抛出错误的函数

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
// 注意，只有抛出错误，才是 never 类型。如果显式用return语句返回一个 Error 对象，返回值就不是 never 类型。
function fail(): Error {
  return new Error("Something failed");
}
```

2.无限执行的函数。

```ts
const sing = function (): never {
  while (true) {
    console.log("sing");
  }
};
```

- never 类型不同于 void 类型。前者表示函数没有执行结束，不可能有返回值；后者表示函数正常执行结束，但是不返回值，或者说返回 undefined。

#### 高阶函数

一个函数的返回值还是一个函数，那么前一个函数就称为高阶函数（higher-order function）。

#### 函数重载

- JavaScript 函数只能有一个实现，必须在这个实现当中，处理不同的参数。
- TypeScript 有些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载（function overload）。

**注意：**

- 函数重载的每个类型声明之间，以及类型声明与函数实现的类型之间，不能有冲突。
- 重载声明的排序很重要，因为 TypeScript 是按照顺序进行检查的，一旦发现符合某个类型声明，就不再往下检查了，所以类型最宽的声明应该放在最后面，防止覆盖其他类型声明。

#### 构造函数

JavaScript 语言使用构造函数，生成对象的实例。构造函数的最大特点，就是必须使用 new 命令调用。

```js
const d = new Date();
```

TypeScript 构造函数的类型写法，就是在参数列表前面加上 new 命令。

```ts
class Animal {
  numLegs: number = 4;
}

type AnimalConstructor = new () => Animal;

function create(c: AnimalConstructor): Animal {
  return new c();
}

const a = create(Animal);
```

```ts
// 构造函数还有另一种类型写法，就是采用对象形式。
type D = {
  new (s: string): object;
};
// F 既可以当作普通函数执行，也可以当作构造函数使用。
type F = {
  new (s: string): object;
  (n?: number): number;
};
```

## 6.对象类型

对象类型的最简单声明方法，就是使用大括号表示对象，在大括号内部声明每个属性和方法的类型。

```ts
// 属性类型以分号结尾
type User = {
  readonly x: number; // 只读属性
  y?: number; // ? 可选属性写法一
  //   y: numnber | undefined; // 可选属性写法二
  name: string;
  add(x: number, y: number): number;
  // 或者写成
  // add: (x:number, y:number) => number;
};

type Name = User["name"]; // string

// 属性类型以逗号结尾
type MyObj = {
  x: number;
  y: number;
};
// 最后一个属性后面，可以写分号或逗号，也可以不写

// 除了type命令可以为对象类型声明一个别名，TypeScript 还提供了interface命令，可以把对象类型提炼为一个接口。
// 写法二
interface MyObj {
  x: number;
  y: number;
}
```

规则：

- 一旦声明了类型，对象赋值时，就不能缺少指定的属性，也不能有多余的属性。
- 也不能删除类型声明中存在的属性
- 修改属性值是可以的。
- TypeScript 不区分对象自身的属性和继承的属性，一律视为对象的属性。
- 读取可选属性之前，必须检查一下是否为 undefined。
- 对象后面加了只读断言 as const，就变成只读对象了，不能修改属性了。as const 属于 TypeScript 的类型推断,如果变量明确地声明了类型，那么 TypeScript 会以声明的类型为准。

```ts
// ES2020 引入了一个新的 Null 判断运算符??  它的行为类似||，但是只有运算符左侧的值为null或undefined时，才会返回右侧的值。

// 写法一
let firstName = user.firstName === undefined ? "Foo" : user.firstName;
let lastName = user.lastName === undefined ? "Bar" : user.lastName;

// 写法二
let firstName = user.firstName ?? "Foo";
let lastName = user.lastName ?? "Bar";
```

### 属性名的索引类型

如果对象的属性非常多，一个个声明类型就很麻烦，而且有些时候，无法事前知道对象会有多少属性，比如外部 API 返回的对象。这时 TypeScript 允许采用属性名表达式的写法来描述类型，称为“属性名的索引类型”。
属性索引共有 string、number 和 symbol 三种类型。

```ts
type MyObj = {
  [property: string]: string;
};

const obj: MyObj = {
  foo: "a",
  bar: "b",
  baz: "c",
};
```

对象可以同时有多种类型的属性名索引，比如同时有数值索引和字符串索引。但是，数值索引不能与字符串索引发生冲突，必须服从后者，这是因为在 JavaScript 语言内部，所有的数值属性名都会自动转为字符串属性名

```ts
type MyType = {
  [x: number]: boolean; // 报错
  [x: string]: string;
};
```

### 解构赋值

注意，目前没法为解构变量指定类型，因为对象解构里面的冒号，JavaScript 指定了其他用途。

```ts
// 正确写法
const {
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
} = product;

// 错误写法
function draw({ shape: Shape, xPos: number = 100, yPos: number = 100 }) {
  let myShape = shape; // 报错： 函数体内不存在变量shape，而是属性shape的值被赋值给了变量Shape。
  let x = xPos; // 报错
}
```

### 结构类型原则

只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则（structual typing）。

- 根据“结构类型”原则，TypeScript 检查某个值是否符合指定类型时，并不是检查这个值的类型名（即“名义类型”），而是检查这个值的结构是否符合要求（即“结构类型”）。
- TypeScript 之所以这样设计，是为了符合 JavaScript 的行为。JavaScript 并不关心对象是否严格相似，只要某个对象具有所要求的属性，就可以正确运行。

### 严格字面量检查

如果对象使用字面量表示，会触发 TypeScript 的严格字面量检查（strict object literal checking）

- 规避严格字面量检查，可以使用中间变量。

```ts
let myOptions = {
  title: "ts",
  content: "xxxxx",
};

const Obj: Options = myOptions;
```

### 最小可选属性规则

如果一个对象的所有属性都是可选的，会触发最小可选属性规则。

- 为了避免这种情况，TypeScript 添加了最小可选属性规则，规定这时属于 Options 类型的对象，必须至少存在一个可选属性，不能所有可选属性都不存在

### 空对象

空对象是 TypeScript 的一种特殊值，也是一种特殊类型。

- 空对象没有自定义属性，所以对自定义属性赋值就会报错。空对象只能使用继承的属性，即继承自原型对象 Object.prototype 的属性。

```ts
const obj: {} = {};
obj.a = 123; // 报错
obj.toString(); // 正确
```

## 7.interface

interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”。使用了某个模板的对象，就拥有了指定的类型结构。

### 对象的方法写法

```ts
// 写法一
interface A {
  f(x: boolean): string;
  f(x: string, y: string): string; // 重载
}

// 写法二
interface B {
  f: (x: boolean) => string;
}

// 写法三
interface C {
  f: { (x: boolean): string };
}
```

- interface 里面的函数重载，不需要给出实现。但是，由于对象内部定义方法时，无法使用函数重载的语法，所以需要额外在对象外部给出函数方法的实现

### 函数

interface 也可以用来声明独立的函数。

```ts
interface Add {
  (x: number, y: number): number;
}

const myAdd: Add = (x, y) => x + y;
```

### 构造函数表示

interface 内部可以使用 new 关键字，表示构造函数。

```ts
interface ErrorConstructor {
  new (message?: string): Error;
}
```

### 继承（主要作用是添加属性）

- 多重接口继承，实际上相当于多个父接口的合并。
- 多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错。
- 子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错。
- interface 可以继承 type 命令定义的对象类型。
- interface 还可以继承 class，即继承该类的所有成员。

```ts
interface Shape {
  name: string;
}

type Animal = {
  spin: boolean;
};

class Content {
  title: string = "";
  getTitle(): string {
    return this.title;
  }
}

interface Circle extends Shape, Animal, Content {
  radius: number;
  name: number; // 报错: 子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错。
}
```

## 8.interface 与 type 的异同

相同点：

- interface 命令与 type 命令作用类似，都可以表示对象类型。

不同点：

- type 能够表示非对象类型，而 interface 只能表示对象类型（包括数组、函数等）。
- interface 可以继承其他类型，type 不支持继承。type 定义的对象类型如果想要添加属性，只能使用&运算符，重新定义一个类型。
- 同名 interface 会自动合并，同名 type 则会报错。也就是说，TypeScript 不允许使用 type 多次定义同一个类型。
- interface 不能包含属性映射（mapping），type 可以
- this 关键字只能用于 interface。
- type 可以扩展原始数据类型，interface 不行。
- interface 无法表达某些复杂类型（比如交叉类型和联合类型），但是 type 可以。

```ts
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

interface Point {
  x: number;
  y: number;
}

// 映射正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key]; // 映射
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};

// 正确
type MyStr = string & {
  type: "new";
};
```

总结：

- 如果有复杂的类型运算，那么没有其他选择只能使用 type；一般情况下，interface 灵活性比较高，便于扩充类型或自动合并，建议优先使用。

补充：

- class 命令也有类似作用，通过定义一个类，同时定义一个对象类型。但是，它会创造一个值，编译后依然存在。如果只是单纯想要一个类型，应该使用 type 或 interface。

## 9.class

类（class）是面向对象编程的基本构件，封装了属性和方法；
TypeScript 的类本身就是一种类型，但是它代表该类的实例类型，而不是 class 的自身类型。

```txt
凡我所失，皆非我所有；凡我所求，皆受其所困；万物皆为我所用，而非我所属；君子使物，不为物使；大道至简，无欲则刚，无为则无所不为
```

- constructor() 构造方法不能声明返回值类型，否则报错，因为它总是返回实例对象。

### TypeScript 对 class 存取器(get/set)有以下规则

- 如果某个属性只有 get 方法，没有 set 方法，那么该属性自动成为只读属性。
- set 方法的参数类型，必须兼容 get 方法的返回值类型，否则报错。
- get 方法与 set 方法的可访问性必须一致，要么都为公开方法，要么都为私有方法。

### implements 关键字

- interface 接口或 type 别名，可以用对象的形式，为 class 指定一组检查条件。然后，类使用 implements 关键字，表示当前类满足这些外部类型条件的限制。
- interface 只是指定检查条件，如果不满足这些条件就会报错。它并不能代替 class 自身的类型声明。
- TypeScript 不允许两个同名的类，但是如果一个类和一个接口同名，那么接口会被合并进类。

### 类的实例类型

对于引用实例对象的变量来说，既可以声明类型为 Class，也可以声明类型为 Interface，因为两者都代表实例对象的类型。

```ts
interface MotorVehicle {}

class Car implements MotorVehicle {}

// 写法一
const c1: Car = new Car();
// 写法二
const c2: MotorVehicle = new Car();
```

注意：

- 作为类型使用时，类名只能表示实例的类型，不能表示类的自身类型。

### 获得一个类的自身类型

```ts
// 写法一： 要获得一个类的自身类型，一个简便的方法就是使用 typeof 运算符。
function createPoint(PointClass: typeof Point, x: number, y: number): Point {
  return new PointClass(x, y);
}
// JavaScript 语言中，类只是构造函数的一种语法糖，本质上是构造函数的另一种写法。所以，类的自身类型可以写成构造函数的形式。
// 写法二：new (x: number, y: number) => Point
function createPoint(
  PointClass: new (x: number, y: number) => Point,
  x: number,
  y: number
): Point {
  return new PointClass(x, y);
}
// 写法三：构造函数也可以写成对象形式 { new (x: number, y: number): Point;  }
function createPoint(
  PointClass: {
    new (x: number, y: number): Point;
  },
  x: number,
  y: number
): Point {
  return new PointClass(x, y);
}
// 写法四： interface
interface PointConstructor {
  new (x: number, y: number): Point;
}

function createPoint(
  PointClass: PointConstructor,
  x: number,
  y: number
): Point {
  return new PointClass(x, y);
}
```

```txt
人生似书卷，风吹哪页读哪页
```

### 类的继承（extends）

类（这里又称“子类”）可以使用 extends 关键字继承另一个类（这里又称“基类”）的所有属性和方法。【类是构造函数语法糖】

```txt
ES6引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。constructor()方法，这就是构造方法，而this关键字则代表实例对象。

类的所有方法都定义在类的prototype属性上面，方法前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。使用的时候，类必须使用new调用跟构造函数的用法完全一致。
```

```ts
class A {
  greet() {
    console.log("Hello, world!");
  }
}

class B extends A {
  // 子类可以覆盖基类的同名方法。
  greet(name?: string) {
    if (name === undefined) {
      super.greet(); // 调用基类A的greet()方法
    } else {
      console.log(`Hello, ${name}`);
    }
  }
}

const b = new B();
b.greet(); // "Hello, world!"
b.greet("Tom"); // "Hello, Tom"
```

注意：

- 如果基类包括保护成员（protected 修饰符），子类可以将该成员的可访问性设置为公开（public 修饰符），也可以保持保护成员不变，但是不能改用私有成员（private 修饰符）
- extends 关键字后面不一定是类名，可以是一个表达式，只要它的类型是构造函数就可以了。（类的本质）

### 可访问性修饰符

- public 省略不写的
- private 只能用在当前类的内部，类的实例和子类都不能使用该成员。（子类不能定义父类私有成员的同名成员。如果在类的内部，当前类的实例可以获取私有成员。）
- protected 该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用。(子类不仅可以拿到父类的保护成员，还可以定义同名成员。)

```txt
严格地说，private定义的私有成员，并不是真正意义的私有成员。一方面，编译成 JavaScript 后，private关键字就被剥离了，这时外部访问该成员就不会报错。
另一方面，由于前一个原因，TypeScript 对于访问private成员没有严格禁止，使用方括号写法（[]）或者in运算符，实例对象就能访问该成员。

由于private存在这些问题，加上它是 ES6 标准发布前出台的，而 ES6 引入了自己的私有成员写法#propName。因此建议不使用private，改用 ES6 的写法，获得真正意义的私有成员。
```

```ts
class A {
  private x = 1;
  #y = 2;
}
const a = new A();
console.log(a.x); // Property 'x' is private and only accessible within class 'A'.
console.log(a["x"]); // 1
console.log(a["y"]); // 报错
```

### 实例属性的简写形式

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
// 简写
class Point {
  constructor(public x: number, public y: number) {} // 这里的public不能省略,和其他修饰符一样写出来
}

const p = new Point(1, 2);
console.log(p.x);
console.log(p.y);
```

### 静态成员

类的内部可以使用 static 关键字，定义静态成员。（只能通过【类本身】使用的成员，不能通过【实例对象】使用。）

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}

MyClass.x; // 0
MyClass.printX(); // 0
```

### 抽象类，抽象成员

TypeScript 允许在类的定义前面，加上关键字 abstract，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做“抽象类”（abastract class）。

抽象类只能当作基类使用，用来在它的基础上定义子类。

#### 抽象成员

- 抽象类的内部可以有已经实现好的属性和方法，也可以有还未实现的属性和方法。后者就叫做“抽象成员”（abstract member），即属性名和方法名有 abstract 关键字，表示该方法需要子类实现。如果子类没有实现抽象成员，就会报错。
- 如果抽象类的属性前面加上 abstract，就表明子类必须给出该方法的实现。

注意

- 抽象成员只能存在于抽象类，不能存在于普通类。
- 抽象成员不能有具体实现的代码。也就是说，已经实现好的成员前面不能加 abstract 关键字。
- 抽象成员前也不能有 private 修饰符，否则无法在子类中实现该成员。
- 一个子类最多只能继承一个抽象类。

总结

抽象类的作用是，确保各种相关的子类都拥有跟基类相同的接口，可以看作是模板。其中的抽象成员都是必须由子类实现的成员，非抽象成员则表示基类已经实现的、由所有子类共享的成员。

### this

this 关键字，它表示该方法当前所在的对象。

- 在类的内部，this 本身也可以当作类型使用，表示当前类的实例对象。

```ts
class Box {
  contents: string = "";
  static a: this; // 报错 this类型不允许应用于静态成员。

  set(value: string): this {
    this.contents = value;
    return this;
  }
}
```

## 10.泛型

“泛型”（generics）反映【参数】与【返回值】之间的类型关系。新增一个传入参数的入口（类型相关的参数），即类型参数 `<T>` 、`<T, U>`；用来表达类型逻辑，与函数普通的形参类似。

```ts
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<number>([1, 2, 3]);
```

- 函数 getFirst()的函数名后面尖括号的部分`<T>`，就是【类型参数】，参数要放在一对尖括号（`<>`）里面。本例只有一个类型参数 T，可以将其理解为类型声明需要的变量，需要在调用时传入具体的参数类型。
- 函数 getFirst()的参数类型是 T[]，返回值类型是 T，就清楚地表示了两者之间的关系。比如，输入的参数类型是 number[]，那么 T 的值就是 number，因此返回值类型也是 number。

### 写法

泛型主要用在四个场合：函数、接口、类和别名。

```ts
// 1. 函数
function id<T>(arg: T): T {
  return arg;
}
let myId: <T>(arg: T) => T = id;
let youId: { <T>(arg: T): T } = id;

// 2. 接口
interface Box<T> {
  content: T;
}
let box: Box<string>;
interface Fn {
  <T>(arg: T): T;
}
let myId: Fn = id;

// 3. 类
class A<T> {
  x: T;
}
class B extends A<number> {}
const b = new B();
b.x = 1;
b.x = "2"; // 报错

// 4. 别名 JavaScript 的类本质上是一个构造函数，因此也可以把泛型类写成构造函数。
type MyClass<T> = new (...args: any[]) => T;
type Nullable<T> = T | undefined | null;
type Container<T> = { value: T };
```

注意

- 泛型类描述的是类的实例，不包括静态属性和静态方法，因为这两者定义在类的本身。因此，它们不能引用类型参数

```ts
class C<T> {
  static data: T; // 报错
  constructor(public value: T) {}
}
```

### 类型参数的约束条件

```ts
// 类型参数 Type 有一个隐藏的约束条件：它必须存在length属性。如果不满足这个条件，就会报错。
function comp<Type>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
// TypeScript 提供了一种语法,允许在类型参数上面写明约束条件；<TypeParameter extents ConstraintType>

function comp <T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
```

- TypeParameter 类型参数
- extends 是关键字
- ConstraintType 表示类型参数要满足的条件，即类型参数应该是 ConstraintType 的子类型

注意：

- 尽量少用泛型。
- 类型参数越少越好。
- 类型参数需要出现两次。
- 泛型可以嵌套。

## 11.Enum 类型

TypeScript 就设计了 Enum 结构，用来将相关常量放在一个容器里面，方便使用。它既是一种类型，也是一个值

:::tip
绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。

由于 TypeScript 的定位是 JavaScript 语言的类型增强，所以官方建议谨慎使用 Enum 结构，因为它不仅仅是类型，还会为编译后的代码加入一个对象。

Enum 作为类型有一个缺点，就是输入任何数值都不报错。
:::

```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}
// Enum 结构本身也是一种类型，它的每个成员都是该类型的一个值。
// type Color = 0 | 1 | 2;
let c: Color = Color.Green; // 1
let c: number = Color.Green; // 1
```

- Enum 结构可以被对象的as const断言替代。使用了as const断言，作用就是使得它的属性无法修改
- 除了数值和字符串，Enum 成员不允许使用其他值（比如 Symbol 值）。
- keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回。

```ts
enum MyEnum {
  A = "a",
  B = "b",
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
```

- 数值 Enum 存在反向映射，即可以通过成员值获得成员名。

```ts
enum MyEnum {
  A = 1,
  B = 2,
}
console.log(MyEnum[2]); // B
```

## 12.类型断言

:::tip
允许开发者在某个位置“绕过”编译器的类型推断，让本来通不过类型检查的代码能够通过，避免编译器报错。这样虽然削弱了 TypeScript 类型系统的严格性，但是为开发者带来了方便，毕竟开发者比编译器更了解自己的代码。

类型断言并不是真的改变一个值的类型，而是提示编译器，应该如何处理这个值。
:::

```ts
type T = "a" | "b" | "c";

let foo = "a";
let bar: T = foo; // ❎ Type 'string' is not assignable to type 'T'.
let bar: T = foo as T; // ✅
```

### 语法

```ts
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 推荐使用: as 语法 (TypeScript 开始支持 React 的 JSX 语法（尖括号表示 HTML 元素），为了避免两者冲突)
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 前提

类型断言的使用前提是，值的实际类型(exper)与断言的类型(T)必须满足一个条件。

```ts
expr as T; // expr是T的子类型，或者T是expr的子类型。
```

:::tip
但是，如果真的要断言成一个完全无关的类型，也是可以做到的。那就是连续进行两次类型断言，先断言成 unknown 类型或 any 类型，然后再断言为目标类型。因为any类型和unknown类型是所有其他类型的父类型，所以可以作为两种完全无关的类型的中介。
:::

### as const

- let命令声明的变量，会被推断为TypeScript中的内置基本类型之一，比如string、number、boolean等。
- const命令声明的变量，会被推断为值类型常量。
- as const断言只能用于字面量，不能用于变量。
- as const也不能用于表达式

```ts
let foo = "hello"; // foo的类型是string
const bar = "hello"; // bar的类型是"hello"
let foo1 = "hello" as const; // foo1的类型是"hello"
foo as const; // ❎ 
let s = ('hello' + 'world') as const; //  ❎ 

const v1 = {
  x: 1,
  y: 2,
}; // 类型是 { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
}; // 类型是 { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const; // 类型是 { readonly x: 1; readonly y: 2; }
```

### 非空断言

对于那些可能为空的变量（即可能等于undefined或null），TypeScript 提供了非空断言，保证这些变量不会为空，写法是在变量名后面加上感叹号!

```ts
let s = "hello";
let len = s!.length;
```

## 13.模块

:::tip
任何包含 import 或 export 语句的文件，就是一个模块（module）。相应地，如果文件不包含 export 语句，就是一个全局的脚本文件。

模块本身就是一个作用域，不属于全局作用域。模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。暴露给外部的接口，必须用 export 命令声明；如果其他文件要使用模块的接口，必须用 import 命令来输入。

TypeScript 模块除了支持所有 ES 模块的语法，特别之处在于允许输出和输入类型。
:::

### import type

```ts
// foo.ts
export type Foo = {
  foo: string;
};
export const foo = {
  foo: 'foo',
}

import type { Foo } from './foo'; // 只导入类型
// 其他写法
import { type Foo } from './foo';
```

## 14.namespace

:::tip
namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”。

它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。
:::

```ts
namespace Utils {
    function sum(a: number, b: number) {
        return a + b;
    }

    export function sub(a: number, b: number) {
        return a - b;
    }
    sum(1, 2); // 没有export，只能在当前模块使用
}

Utils.sub(1, 2); // 有export，可以在其他模块使用
// import 
import sub = Utils.sub;
sub(1, 2);
```

## 15.装饰器

:::tip
TypeScript 从早期开始，就支持装饰器。但是，装饰器的语法后来发生了变化。ECMAScript 标准委员会最终通过的语法标准，与 TypeScript 早期使用的语法有很大差异。

目前，TypeScript 5.0 同时支持两种装饰器语法。标准语法可以直接使用，传统语法需要打开--experimentalDecorators编译参数。
:::

### 标准语法

### 传统语法

## 16.declare 关键字

## 17.运算符

## 18.类型映射

## 19.类型工具

## 参考链接

- [TypeScript 教程 阮一峰](https://typescript.p6p.net/typescript-tutorial/intro.html)
