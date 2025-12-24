# CRA

说明： create-react-app 是一个官方支持的创建 React 应用程序的命令行工具。

## 原理

1. 使用 `react-scripts` 包来管理依赖和构建配置
2. 使用 `react-app-rewired` 来覆盖默认配置
3. 使用 `customize-cra` 来扩展 `react-app-rewired` 的功能

## 使用

```bash
npx create-react-app my-app
cd my-app
npm start
```

## 配置

```bash
npm install react-app-rewired customize-cra --save-dev
```

```js
// config-overrides.js
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
);
```

```js
// package.json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

## 参考

- [create-react-app](https://create-react-app.dev/docs/getting-started)
