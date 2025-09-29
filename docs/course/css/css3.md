# css3

## 0. 简介

### 升级版本

- **本质**：CSS3是CSS2的升级版本(upgrade version)，语法格式基本保持一致
- **核心突破**：在CSS2基础上实现了动画功能，无需JavaScript即可完成动画效果
- **最佳实践**：与JavaScript事件配合使用时效率最高，相比jQuery操作动画更具优势
- **学习建议**：使用全英文资料培养技术文档阅读能力，适应行业最新技术发展

### CSS3的历史兼容性

浏览器前缀机制

```txt
前缀作用：标识浏览器私有属性实现，在标准未完全普及时保证兼容性

前缀规则：
-webkit-：Chrome/Safari等WebKit内核浏览器
-moz-：Firefox浏览器
-ms-：IE浏览器
-o-：Opera浏览器

发展历程：从各家实现私有属性→逐步支持标准写法→最终统一标准
```

## 1. can i use

- [can i use](https://caniuse.com/)

## 2. PostCSS

:::tip
PostCSS是一个用JavaScript工具和插件转换CSS代码的工具,通过js将css解析成抽象语法树，然后通过插件对抽象语法树进行操作，最后将抽象语法树重新生成css代码
:::

### 2.1 核心功能

- 将CSS代码解析为抽象语法树（Abstract Syntax Tree）
- 提供操作AST的API接口

### 2.2 技术实现

- 通过JavaScript构建CSS的AST表示
- 支持插件对AST节点进行增删改查

## 3. 预处理器

:::tip
**预处理器定义**: 先按照特定语法规则编写代码，再将其编译成标准CSS的工具（如Less/Sass）

**解决痛点**:
嵌套选择器书写繁琐（如div span和div p需要重复写父元素）
样式值重复定义（如多处使用color:red时修改困难）
大型项目维护困难（多人协作时样式冲突频发）

**核心优势**: 通过变量、嵌套等特性提升代码可维护性和开发效率
:::

- 有哪些：less、sass、stylus、cssNext
- 功能：扩展CSS语法，提供变量、嵌套等功能

## 4. 后处理器

:::tip
开发者只需编写标准CSS,后处理器**自动处理兼容性问题**
:::

- 有哪些：autoprefixer、cssnano
- 功能：对已编写的CSS进行优化和兼容处理

### 4.1 AutoPrefixer工作原理

- 扫描CSS代码
- 根据caniuse.com的兼容性数据
- 自动添加必要的前缀

## 5. 回流& 重绘

### 5.1 回流（reflow）

**定义**：浏览器重新计算元素位置和几何信息

#### 回流触发场景

- DOM结构变化、样式变化、浏览器窗口大小变化

:::tip
1.改变窗口大小

2.改变字体大小

3.内容的改变，输入框输入文字

4.激活伪类，比如:hover

5.操作class属性

6.脚本操作DOM

7.计算offsetWidth和offsetHeight

8.设置style属性的值
:::

### 5.2 重绘（repaint）

**定义**：浏览器重新绘制元素外观

#### 重绘触发场景

- 颜色、背景色、边框等外观属性变化,不影响布局

## 6. 性能优化

- 减少重绘和回流
- 使用CSS3硬件加速：如transform、opacity等；[well-changed](https://juejin.cn/post/7015387929870598158)属性的使用
- 避免频繁操作DOM
- 使用虚拟DOM
- 使用CSS选择器优化
- 使用CSS3动画代替JavaScript动画
- 使用Web Workers处理复杂计算
