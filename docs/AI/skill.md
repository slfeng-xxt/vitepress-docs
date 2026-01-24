# agent skill

:::tips
agent skill  大模型要干什么的说明文档,提前订好规矩与输出边界并在使用的时候按需加载,达到节省token的目的
:::

## 1. agent skill使用过程(按需加载)

```txt
用户发送需要处理的内容 -》 client -》 agent skill 列表清单 -》 model分析 -》 选择需要的skill进行处理并回答  -》 client返回 -》 用户

```

## 2. reference,其中还能根据使用条件和情况构建使用引用的其他skill,类似node_modules库的引用(**读取**)

- 读文件内容到模型,会消耗token

## 3. script, 在skill文档说明中可以执行的脚本文件,当符合条件的情况时候自动读取并执行该文件拿到执行的结果,使用的token几乎为零(**执行**)

- 仅执行对应到脚步,不消耗token

## 4. skill文件内容说明

- 元数据(包含名称和描述,始终加载)
- 指令层(当大模型判断踢到该agent skill相关的名称和描述时候加载)按需加载
- 资源层(含reference和script,与引用相关的内容时会调用对应的应用和脚本的执行)

## 5. skill与MCP的区别

:::tip
MCP connects Claude to data
SKILL teach Claude what to do with that data
:::

- MCP,给大模型提供数据,例如:读取桌面表格中的数据(本质: 程序)
- SKILL,告诉大模型如何处理这些数据,例如:告诉大模型如何处理整理这些数据(本质: 说明文档)
