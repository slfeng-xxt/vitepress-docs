# Vibe Coding

:::tip
Vibe Coding下需要工程规范/方案设计/代码审查

氛围编程（意念编程），大脑中装了各种方案/设计的知识，用自然语言与ai沟通来让AI实现代码编程的工作
:::

## 1.进化路线

- tab补全功能
- 聊天窗口模式对话
- 项目文件的控制权限交给ai

## 2. 模型和工具

模型：

- Claude Code
- Codex
- Deepseek V3

工具：

- trae
- codebuddy
- cursor

## 3.ai代码混乱问题

:::tip
上下文清晰的规划

约束开发规范/清晰的规划/具体实施步骤/风险控制/测试/反思复盘
:::

- 拿到需求，调研方案和评审
- 设计具体步骤拆分
- 稳定性
- 测试驱动
- 优化

## 4.Vibe Check, Ai开发SOP

:::tip
SOP(standard Operating Procedure)标准操作程序
:::

- Plan 策划
- Coding 开发
- Lint 规范
- scope 隔离，单独文件开发

## 5.工具选择

Claude + Codex
deepseek + trea
chatgpt + cursor

## 6.实践（飞书协同操作表格）

:::tip
`STAR-L 法则`是一种结构化表达工具，通过情境、任务、行动和结果四个步骤，帮助个人清晰、有逻辑地展示经历和能力。

STAR原则是情境（Situation）、任务（Task）、行动（Action）和结果（Result） 学习（Learn）
:::

### 6.1 全局约束

.clauderules 约束AI编码技术实现

```text
1.plan「STAR-L 法则」

需求 ->  方案 -> 步骤拆分 -> 风险预估（性能问题） -> 反思优化

核心数据协议设计 -> 顶层数据协议抽象
```

### 6.2 功能拆分

.features 新特性

```text
拆解完整需求，按新特性逐步开发实现

1.表格渲染引擎：（10亿数据渲染不卡顿），沉淀到monorepo子包中

2.公式引擎： webWorker 多线程架构

3.协同实现：crdt/ot协同算法，基于yjs实现-> 协同服务实现 -> 协同层传输协议实现

4.界面：登录 -> 表格渲染实现
```

## 7.Vibe Coding 工作流开发的SOP

- 规范
- 代码生成
- 测试用例编写
- 测试 + lint
- 验收
- 反思 + 优化

### 7.1 工具

:::tip
ZCF（Zero-Config Code Flow）是一个面向专业开发者的 CLI 工具，目标是在几分钟内完成 Claude Code 与 Codex 的端到端环境初始化。
通过 npx zcf 可以一站式完成配置目录创建、API/代理接入、MCP 服务接入、工作流导入、输出风格与记忆配置，以及常用工具安装。
:::

- [ZCF](https://zcf.ufomiao.com/zh-CN/)
- `MCP`：通用工具协议，用来调用其他工具（查资料/）
- `Skill`：约束开发规范，和AI约定输出边界

### 7.2 实践

- 工具：[codebuddy](https://www.codebuddy.cn/home/)
- 创建命令： .codebuddy/commands/fsl.plan.md (计划规划命令)
- 创建命令： .codebuddy/commands/fsl.feature.md (新特性开发命令)
- 对话中使用 `/`快捷命令唤起 `commands/fsl.plan`生成计划并写入 .plan文件夹
- 输入要实现的功能：实现一个diff功能

fsl.plan.md

```markdown
# 项目规划

## 功能拆分

尽可能详细的拆分功能，并按照新特性逐步实现

## 性能优化

在设计需求实现的时候，尽量考虑性能优化，并给出优化方案

## 产出

规划完后，将规划文档输出到.plan文件夹中
```

fsl.feature.md

```markdown
# 具体新特性开发

基于 .plan 文件，逐步开发具体的功能

严格按照当前项目的规范

- eslint 规范
- prettier 规范
- commitlint 规范
- cspell 规范
- 单元测试
- 文档
- 代码 review
```
