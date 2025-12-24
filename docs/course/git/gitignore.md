# .gitignore 学习笔记

## 什么是 .gitignore

`.gitignore` 是一个特殊的文本文件，用于告诉 Git 哪些文件或目录应该被忽略，不纳入版本控制。这对于排除临时文件、构建产物、敏感信息等非常有用。

## 基础语法

### 1. 基本规则

```text
# 忽略单个文件
temp.txt

# 忽略所有 .log 文件
*.log

# 忽略整个目录
node_modules/
build/

# 忽略特定路径下的文件
src/config/secret.json
```

### 2. 通配符

```text
# * 匹配零个或多个字符
*.txt           # 所有 .txt 文件
temp*           # 以 temp 开头的文件

# ? 匹配单个字符
temp?.txt       # temp1.txt, tempA.txt 等

# [] 匹配括号内的任意字符
temp[0-9].txt   # temp0.txt 到 temp9.txt
temp[abc].txt   # tempa.txt, tempb.txt, tempc.txt
```

### 3. 路径匹配

```text
# 以 / 开头表示根目录
/README.md      # 只忽略根目录下的 README.md

# 以 / 结尾表示目录
logs/           # 忽略所有名为 logs 的目录

# ** 匹配多级目录
**/logs         # 忽略任何位置的 logs 目录
logs/**         # 忽略 logs 目录下的所有内容
```

### 4. 否定模式

```text
# ! 表示不忽略（白名单）
*.log           # 忽略所有 .log 文件
!important.log  # 但不忽略 important.log

# 复杂的否定模式
build/          # 忽略 build 目录
!build/static/  # 但保留 build/static 目录
```

## 常用模式

### 1. Node.js 项目

```text
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 构建产物
dist/
build/
.next/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 缓存
.npm
.yarn/cache
.pnp
.pnp.js

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db
```

### 2. Python 项目

```text
# 字节码文件
__pycache__/
*.py[cod]
*$py.class

# 分发/打包
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/

# 虚拟环境
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# 测试覆盖率
htmlcov/
.coverage
.pytest_cache/
```

### 3. Java 项目

```text
# 编译文件
*.class
*.jar
*.war
*.ear

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next

# Gradle
.gradle/
build/

# IDE
.idea/
*.iml
.eclipse/
.metadata/
.vscode/

# 日志
*.log
```

### 4. 前端项目通用

```text
# 依赖
node_modules/
bower_components/

# 构建输出
dist/
build/
out/

# 缓存
.cache/
.parcel-cache/
.nuxt/
.next/

# 环境配置
.env
.env.local
.env.*.local

# 测试
coverage/
.nyc_output/

# 编辑器/IDE
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# 操作系统
.DS_Store
Thumbs.db
```

## 最佳实践

### 1. 文件放置位置

```bash
# 全局 gitignore（影响所有仓库）
~/.gitignore_global

# 项目级 gitignore（只影响当前仓库）
.gitignore

# 目录级 gitignore（影响子目录）
src/.gitignore
```

### 2. 配置全局 gitignore

```bash
# 设置全局 gitignore 文件
git config --global core.excludesfile ~/.gitignore_global

# 创建全局 gitignore 文件
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
echo "*.swp" >> ~/.gitignore_global
```

### 3. 处理已追踪的文件

```bash
# 停止追踪已被 git 管理的文件
git rm --cached filename

# 停止追踪目录
git rm -r --cached directory/

# 更新 .gitignore 后，清除缓存重新应用
git rm -r --cached .
git add .
git commit -m "update .gitignore"
```

### 4. 检查 gitignore 规则

```bash
# 检查文件是否被忽略
git check-ignore filename

# 显示匹配的规则
git check-ignore -v filename

# 查看所有被忽略的文件
git status --ignored
```

## 实际案例

### 案例1：Vue.js 项目

```text
# 依赖
node_modules/
jspm_packages/

# 生产构建
/dist
/build

# 本地环境变量
.env
.env.local
.env.*.local

# 日志文件
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器目录和文件
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# 操作系统生成的文件
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

### 案例2：React + TypeScript 项目

```text
# 依赖
node_modules/
/.pnp
.pnp.js

# 测试
/coverage

# 生产构建
/build

# 杂项
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# TypeScript
*.tsbuildinfo

# IDE
.vscode/
.idea/

# Storybook
storybook-static/
```

### 案例3：全栈项目（前端+后端）

```text
# 前端
client/node_modules/
client/dist/
client/build/

# 后端
server/node_modules/
server/dist/
server/uploads/

# 公共
.env
.env.local
*.log

# 数据库
*.sqlite
*.db

# 缓存
.cache/
.temp/

# IDE
.vscode/
.idea/

# 操作系统
.DS_Store
Thumbs.db
```

## 特殊技巧

### 1. 只忽略根目录下的文件

```text
# 只忽略根目录的 config.json
/config.json

# 不忽略子目录的 config.json
# src/config.json 不会被忽略
```

### 2. 忽略除了特定文件的整个目录

```text
# 忽略 logs 目录的所有内容
logs/*

# 但保留 logs 目录本身和 .gitkeep 文件
!logs/.gitkeep
```

### 3. 条件忽略

```text
# 忽略所有 .txt 文件
*.txt

# 但在 docs 目录下不忽略
!docs/*.txt
```

### 4. 模式匹配示例

```text
# 忽略所有 .a 文件
*.a

# 但跟踪 lib.a，即使你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

## 常见问题

### 1. .gitignore 不生效

**原因**：文件已经被 Git 追踪

**解决方案**：
```bash
# 取消追踪
git rm --cached filename
git commit -m "Remove tracked file"

# 或者清除所有缓存重新应用
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
```

### 2. 忽略已提交的文件

**方案1**：停止追踪但保留本地文件
```bash
git rm --cached filename
```

**方案2**：使用 git update-index
```bash
git update-index --assume-unchanged filename
```

### 3. 临时忽略文件修改

```bash
# 临时忽略文件的修改
git update-index --skip-worktree filename

# 恢复追踪
git update-index --no-skip-worktree filename
```

## 工具推荐

### 1. 在线生成器

- [gitignore.io](https://www.toptal.com/developers/gitignore)
- [GitHub 官方模板](https://github.com/github/gitignore)

### 2. 编辑器插件

- VS Code: `.gitignore Generator`
- JetBrains: 内置 .gitignore 支持
- Sublime Text: GitIgnore 插件

### 3. 命令行工具

```bash
# 使用 gi 命令快速生成
# 安装：npm install -g gitignore
gi node,react,vscode > .gitignore
```

## 总结

`.gitignore` 是 Git 版本控制中的重要工具，正确使用可以：

1. **保持仓库整洁**：排除不必要的文件
2. **保护敏感信息**：避免提交密钥、密码等
3. **提高性能**：减少追踪文件数量
4. **避免冲突**：排除因环境差异产生的文件

记住关键原则：

- 越早配置越好
- 定期更新维护
- 团队保持一致
- 善用模板和工具
