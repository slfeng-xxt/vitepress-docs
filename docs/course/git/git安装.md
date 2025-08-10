# 安装流程步骤说明

## 1. Information

GNU General Public License (GNU通用公共许可证)

## 2. select Destination Location

## 3. Select Components

## 4. Chooseing the default editor used by Git

## 5. Adjusting the name of the initial bbranch in new repositories(调整新存储库中初始分支的名称)

选项：

* 让Git自行设置，Git的默认主分支名称是main
* 自定义名称

## 6. Adjusting your PATH environment

选项：

* 只有git bash 能运行Git
* 命令行（CMD PowerShell 第三方软件）
* 使用Git并安装一些类Unix 软件工具，例如：find curl grep awk sed 等

## 7. Chooseing the SSH executable

选项：

* Git自带的SSH工具
* 系统已安装的SSH程序

补充说明：

1. SSH-secure shell 用于在不安全的网络中进行安全的远程访问和数据传输
2. 不安全的网络是什么？互联网就是、无线局域网、蓝牙

## 8. Chooseing HTTPS transport backend(选择HTTPS传输后端)

选项：

* 使用OpenSSl库
* 使用Windows自带的安全通信库

backend 计算机术语，通常用于描述软件系统或应用程序中的后端部分。它主要指用于用户直接交换无关的、在服务器运行的程序代码和逻辑，包括数据存储、业务逻辑处理、安全认证、API接口等功能

## 9. configuring the line ending conversions(选择行尾符合处理方式)

* 在检出文件时将行尾转换为Windows样式（CRLF）
* 不进行行尾转换，文件将按照原样从版本库中检出，并在提交文件时转换为Unix样式（LF）
* 不进行行尾转换，文件将按照原样从版本库中检出并提交、适用于不需要处理尾行转换的项目

说明：Windows使用CRLF（回车换行）作为行尾，Linux macOS 使用LF(换行)作为行尾，这可能会导致不同操作系统之间文本在Git版本控制中出现行尾不一致问题----***遇到过类似问题，拉下新代码格式校验标红***

## 10. Configuring the terminal emulator to use with Git Bash(配置Git Bash终端模拟器)

选项：

* 使用程序自带的终端 Mintty
* 使用Windows默认的控制窗口

## ***11. Choose the default behavior of 'git pull'（选择拉取远程仓库的默认方式）***

选项：

* 默认选项、快速合并
* 覆盖合并 ---- Rebase
* 只使用 快速合并

## 12. Choose a credential helper(个人凭证认证辅助工具)

* Git凭据管理器覆盖合并
* 不需要任何凭据辅助工具

## 13. Configuring extra options

* 文件缓存
* 软链接或者符合链接

## 14. Configuring experimental options(实验选项)

* 控制台支持
* 文件监控

## 15.配置

### 初始配置

#### 1.查看所有的配置以及他们文件所在位置

```js
git config --list --show-origin
```

* 全局配置文件 /etc/gitconfig
* 用户配置文件 /.gitconfig
* 仓库配置文件 /.git/config

ps:**配置文件**是一种用于存储应用程序、系统或服务配置信息的文件

#### 2.账号配置

```js
git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"
```

#### 3.设置文本编辑器

```js
git config --global core.editor "code --wait"
```

#### 4. 查看配置

```js
git config --list
```
