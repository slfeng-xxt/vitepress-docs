# AST

- 编译原理的基本思路
- 简单编译器的实现
- 前端构建中相关的编译

## 1. 概念

### 1.1 什么是 AST

AST（Abstract Syntax Tree）抽象语法树，是源代码的抽象语法结构的树状表现形式，它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

### 1.2 什么是编译器

编译器由词法分析器、语法分析器、语义分析器、中间代码生成器、目标代码生成器、代码优化器和错误处理器组成。

## 2. AST 的作用

- 代码转译（Babel）
- 代码压缩（Terser）
- 代码检查（ESLint）
- 代码格式化（Prettier）
- 代码高亮（VSCode）
- 代码高亮（WebStorm）
- 代码提示（VSCode）
- 代码提示（WebStorm）
- 代码重构（TypeScript）

## 3. AST 的应用

### 3.1 Babel

Babel 是一个 JavaScript 编译器，用于将 ES6+ 代码转换为向后兼容的 JavaScript 代码，以便能够运行在当前和旧版本的浏览器或环境中。

Babel 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
Babel 的解析器使用 @babel/parser 库，它可以将源代码解析为 AST。Babel 的转换器使用 @babel/traverse 库，它可以在 AST 上进行遍历和操作。Babel 的生成器使用 @babel/generator 库，它可以将 AST 转换为新的代码。

### 3.2 Terser

Terser 是一个 JavaScript 压缩器，用于将 JavaScript 代码压缩为更小的代码，以便能够更快地加载和执行。Terser 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
Terser 的解析器使用 acorn 库，它可以将源代码解析为 AST。Terser 的转换器使用 acorn-walk 库，它可以在 AST 上进行遍历和操作。Terser 的生成器使用 acorn 库，它可以将 AST 转换为新的代码。

### 3.3 ESLint

ESLint 是一个 JavaScript 代码检查工具，用于检查代码是否符合规范，以及是否存在潜在的错误。ESLint 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
ESLint 的解析器使用 espree 库，它可以将源代码解析为 AST。ESLint 的转换器使用 eslint-scope 库，它可以在 AST 上进行遍历和操作。ESLint 的生成器使用 eslint-scope 库，它可以将 AST 转换为新的代码。

### 3.4 Prettier

Prettier 是一个代码格式化工具，用于将代码格式化为统一的风格。Prettier 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
Prettier 的解析器使用 @babel/parser 库，它可以将源代码解析为 AST。Prettier 的转换器使用 @babel/traverse 库，它可以在 AST 上进行遍历和操作。Prettier 的生成器使用 @babel/generator 库，它可以将 AST 转换为新的代码。

### 3.5 VSCode

VSCode 是一个代码编辑器，它支持代码高亮、代码提示、代码格式化等功能。VSCode 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
VSCode 的解析器使用 @babel/parser 库，它可以将源代码解析为 AST。VSCode 的转换器使用 @babel/traverse 库，它可以在 AST 上进行遍历和操作。VSCode 的生成器使用 @babel/generator 库，它可以将 AST 转换为新的代码。

### 3.6 WebStorm

WebStorm 是一个代码编辑器，它支持代码高亮、代码提示、代码格式化等功能。WebStorm 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
WebStorm 的解析器使用 @babel/parser 库，它可以将源代码解析为 AST。WebStorm 的转换器使用 @babel/traverse 库，它可以在 AST 上进行遍历和操作。WebStorm 的生成器使用 @babel/generator 库，它可以将 AST 转换为新的代码。

### 3.7 TypeScript

TypeScript 是一种 JavaScript 的超集，它添加了类型系统和其他特性。TypeScript 的核心功能是通过解析器将源代码转换为 AST，然后通过转换器对 AST 进行操作，最后通过生成器将 AST 转换为新的代码。
TypeScript 的解析器使用 @babel/parser 库，它可以将源代码解析为 AST。TypeScript 的转换器使用 @babel/traverse 库，它可以在 AST 上进行遍历和操作。TypeScript 的生成器使用 @babel/generator 库，它可以将 AST 转换为新的代码。

## 4. 编译器的基本思路

编译器的基本思路是将源代码转换为抽象语法树（AST），然后对 AST 进行操作，最后将 AST 转换为目标代码。编译器的实现可以分为以下几个步骤：
- 词法分析：将源代码转换为词法单元（Token）的序列。
- 语法分析：将词法单元的序列转换为抽象语法树（AST）。
- 语义分析：对 AST 进行操作，例如类型检查、代码优化等。
- 代码生成：将 AST 转换为目标代码。
编译器的实现可以使用不同的编程语言来实现，例如 C、C++、Java、Python 等。编译器的实现可以使用不同的工具来实现，例如 GCC、Clang、LLVM 等。

## 5. 简单编译器的实现（demo）



