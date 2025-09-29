# pnpm monorepo 工程管理

```yaml
package:
  - "packages/*"
  - "apps/*"
```

## 1. package.json 构建

工程根目录构建

```bash
pnpm --workspace-root init
```

## 2. 环境版本锁定问题

根目录的 package.json 中配置

```json
{
  "name": "monorepo-demo",
  "version": "1.0.0",
  "description": "",
  "engines": {
    "node": ">=18.20.4",
    "npm": ">=10.7.0",
    "pnpm": ">=10.12.4"
  }
}
```

## 3. 开发依赖安装

**npmrc规范**

- .npmrc文件校验package.json中的engines选项，**小于规定版本报错**

```txt
// .npmrc
engine-strict=true
```

```bash
pnpm i -D --workspace-root typescript

pnpm i -Dw typescript
```

## 4. TypeScript

```bash
pnpm -Dw add typescript @types/node
```

新建 tscofig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "ESNext",
    "target": "ESNext",
    "types": [],
    "lib": ["esnext"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "verbatimModuleSyntax": false,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist"]
}
```

## 5. 代码风格和质量检查

### 5.1 prettier（风格）

- 安装

```bash
pnpm -Dw add prettier
```

- 配置 prettier.config.js

```js
export default {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "none",
  backetSpacing: true,
  backetSameline: false,
  arrowParens: false,
  insertPragma: "avoid",
  requirePragma: false,
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: false,
  endOfLine: "auto",
  rangeStart: 0,
  rangeEnd: Infinity,
};
```

- .prettierignore

```txt
# .prettierignore
dist
public
.local
node_modules
pnpm-lock.yaml
```

- package.json

```json
"scripts": {
    "lint:prettier": "prettier --write \"**/*.{js,ts,mjs,cjs,json,tsx,css,less,less,scss,vue,html,md}\"",
},
```

### 5.2 ESLint(质量)

```bash
pnpm -Dw add eslint@latest @eslint/js globals typescript-eslint eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue
```

| 类别             | 库名                                          |
| ---------------- | --------------------------------------------- |
| 核心引擎         | eslint                                        |
| 官方规则集       | @eslint/js                                    |
| 全局变量支持     | globals                                       |
| TypeScript支持   | typescript-eslint                             |
| 类型定义（辅助） | @types/node                                   |
| Prettier集成     | eslint-plugin-prettier eslint-config-prettier |
| Vue.js支持       | eslint-plugin-vue                             |

- eslint.config.js

```js
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

const ignores = [
  "**/dist/**",
  "**/node_modules/**",
  ".*",
  "scripts/**",
  "**/*.d.ts",
];

export default defineConfig(
  //    通用配置
  {
    ignores,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
    },
    rules: {
      // 自定义
      "no-var": "error",
    },
  },
  // 前端配置
  {
    ignores,
    files: [
      "apps/front/**/*.{ts,js,tsx,jsx,vue}",
      "package/components/**/*.{ts,js,tsx,jsx,vue}",
    ],
    extends: [
      ...eslintPluginVue.configs["flat/recommended"],
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // 后端配置
  {
    ignores,
    files: ["apps/back/**/*.{ts,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
```

- package.json

```json
"scripts": {
    "lint:prettier": "prettier --write \"**/*.{js,ts,mjs,cjs,json,tsx,css,less,less,scss,vue,html,md}\"",
    "lint:eslint": "eslint"
  },
```

### 5.3 拼写检查

- vsCode插件： Code Spell Checker

- 安装

```bash
pnpm -Dw add cspell @cspell/dict-lorem-ipsum
```

- cspell.json

```json
{
  "import": ["@cspell/dict-lorem-ipsum/cspell-ext.json"],
  "caseSensitive": false,
  "dictionaries": ["custom-dictionary"],
  "dictionaryDefinitions": [
    {
      "name": "custom-dictionary",
      "path": "./.cspell/custom-dictionary.txt",
      "addWord": true
    }
  ],
  "ignorePaths": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/lib/**",
    "**/docs/**",
    "**/vendor/**",
    "**/public/**",
    "**/static/**",
    "**/out/**",
    "**/tmp/**",
    "**/*.d.ts",
    "**/package.json",
    "**/*.md",
    "**/stats.html",
    "eslint.config.js",
    ".gitignore",
    ".prettierignore",
    "cspell.json",
    "commitlint.config.js",
    ".cspell"
  ]
}
```

- package.json

```json
"scripts": {
    "lint:prettier": "prettier --write \"**/*.{js,ts,mjs,cjs,json,tsx,css,less,less,scss,vue,html,md}\"",
    "lint:eslint": "eslint",
    "lint:spellcheck": "cspell lint \"{packages|apps}/**/*.{js,ts,mjs,cjs,json,tsx,css,less,less,scss,vue,html,md}\""
  }
  ,
```

## 6. git提交规范

```bash
git init
```

- .gitignore

```txt
# .gitignore
node_modules/
dist/
build/
.env
.env.*
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 6.1 commitizen

```bash
pnpm -Dw add @commitlint/cli @commitlint/config-conventional commitizen cz-git
```

| 类别       | 库名                            |
| ---------- | ------------------------------- |
| 核心引擎   | @commitlint/cli                 |
| 配置       | @commitlint/config-conventional |
| 交互式插件 | commitizen                      |
| 交互式工具 | cz-git                          |

- package.json中配置

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

- 配置 cz-git

```js
// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
  },
};
```

- 操作

```bash
git add .
pnpm commit
```

### 6.2 husky（git hooks 自动化检查）

- 安装

```bash
pnpm -Dw add husky
```

- 初始化

```bash
pnpx husky init
```

- package.json中配置

```json
{
  "scripts": {
    "commit": "git-cz",
    "prepare": "husky"
  }
}
```

- pre-commit中配置

```txt
#!/usr/bin/env sh
pnpm lint:prettier && pnpm lint:eslint && pnpm lint:spellcheck
```

### 6.3 lint-staged(检查暂存区的文件)

- 安装

```bash
pnpm -Dw add lint-staged
```

- package.json中配置

```json
{
  "scripts": {
    "prepare": "husky",
    "pre-commit": "lint-staged"
  }
}
```

- 配置文件

```js
// .lintstagedrc.js
export default {
  "*.{js,ts,mjs,cjs,json,tsx,css,less,less,scss,vue,html,md}": ["cspell lint"],
  "*.{js,ts,vue,md}": ["prettier --write", "eslint"],
};
```

## 7. 公共库打包

## 8. 子包依赖

## 9. 单元测试

## 10. 发布
