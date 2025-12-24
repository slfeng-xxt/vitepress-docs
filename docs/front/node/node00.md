# 第一节

## 1. Node概述

### 什么是Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。

Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。

Node.js 的包管理器 npm，是全球最大的开源库生态系统。

## 2. 全局对象（global）

### global对象

在浏览器中，全局对象是window，在Node中，全局对象是global。

### global对象下常见的属性和方法

- __dirname：获取当前文件所在目录的绝对路径
- __filename：获取当前文件的绝对路径
- process：获取当前进程的信息，并对其进行操作
- setTimeout()：用于在指定毫秒数后执行函数
- clearTimeout()：用于停止一个定时器
- setInterval()：用于每隔指定毫秒数执行函数
- clearInterval()：用于停止一个定时器
- console：用于输出信息到控制台
- Buffer：用于处理二进制数据

## 3. 模块化

:::tip
**CommonJS 规范的注意事项:**

1.模块存在缓存机制，第一次加载后模块会被缓存，因此多次重复引用或加载会读取缓存。

2.require 加载模块输出的是 module.exports 的拷贝，因此该值一旦被输出后，模块中值发生改变不会影响导出值。
:::

### 3.1 什么是模块化

模块化是指将一个大的程序拆分成若干个小的程序，每个小的程序完成一个特定的功能，这些小的程序就是模块。

### 3.2 模块的查找

require()函数用于加载模块，模块的查找规则如下：

- 绝对路径
- 相对路径 `./ ../` (相对于当前文件所在目录，最终会转换成绝对路径，加载模块)
- 相对路径 `require('abc')`（检查是否是内置模块，如fs,path;检查是否是当前目录中的node_modules;检查上级目录中的node_modules；。。。；最后转化为绝对路径，加载模块）
- 关于后缀名 `.js` `.json` `.node` `mjs` （默认是`.js`）
- 关于文件名 (如果只提供目录，则默认查找该目录下的index文件，如`require('src')`会查找`src/index.js`；如果导入三方包，则会去找该包的package.json中的main字段，如`require('abc')`会查找`abc/package.json`中的main字段指定的文件)

### 3.3 module对象

记录了当前模块的信息，如文件名、路径、依赖等。

`module对象`下常见的属性

- `id`: 模块的标识符，通常为带有绝对路径的模块文件名
- `module.exports`：用于导出模块
- `exports`：用于导出模块，是module.exports的引用。【模块对外的接口，表示模块对外输出的值】
- `filename`: 带有绝对路径的模块文件名
- `parent`: 返回一个对象，表示调用该模块的模块
- `children`: 返回一个数组，表示该模块使用的其他模块集合
- `loaded`: 返回布尔值，表示模块是否加载完成

### 3.4 require()函数

- [requir()源码解读](https://www.ruanyifeng.com/blog/2015/05/require.html)
- require.resolve()：用于获取模块的绝对路径
- extensions：用于获取模块的扩展名
- cache：用于缓存模块，避免重复加载

## 4. 基本内置模块

### 4.1 [os模块🔗](https://www.nodejs.com.cn/api/os.html)

:::tip
os模块提供了与操作系统相关的实用方法，如获取操作系统信息、获取CPU信息、获取内存信息等。
:::

### 4.2 [path模块🔗](https://www.nodejs.com.cn/api/path.html)

:::tip
path模块提供了与文件路径相关的实用方法，如拼接路径、解析路径、获取文件扩展名等。
:::

### 4.2 [url模块🔗](https://www.nodejs.com.cn/api/url.html)

:::tip
url模块提供了与URL相关的实用方法，如解析URL、格式化URL、获取URL的协议、主机、端口、路径、查询字符串等。
:::

### 4.2 [util模块🔗](https://www.nodejs.com.cn/api/util.html)

:::tip
util模块提供了与实用工具相关的实用方法，如深拷贝、格式化字符串、时间格式化等。
:::

## 5. 文件系统模块I/O

fs模块提供了与文件系统相关的实用方法，如读取文件、写入文件、删除文件、重命名文件等。

### 5.1 练习：读取一个目录中的所有子目录和文件

```js
const fs = require('fs');
const path = require('path');

class File {
    constructor(fileName,name, ext, isFile, size, createTime, updateTime) {
        this.fileName = fileName;
        this.name = name;
        this.ext = ext;
        this.isFile = isFile;
        this.size = size;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    async getFileContent() {
        if (this.isFile) {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            return content;
        }
    }

    async getChildren(recursive = false) {
        if (this.isFile) {
            return [];
        }
        const files = await fs.promises.readdir(this.fileName);
        let children = await Promise.all(files.map(name => File.getFile(path.resolve(this.fileName, name))));
        
        // 如果需要递归获取所有子目录的内容
        if (recursive) {
            const allChildren = [];
            for (const child of children) {
                allChildren.push(child);
                if (!child.isFile) {
                    const subChildren = await child.getChildren(recursive);
                    allChildren.push(...subChildren);
                }
            }
            return allChildren;
        }
        
        return children;
    }
    
    // 打印目录树结构
    static async printTree(file, prefix = '', isLast = true) {
        const connector = isLast ? '└──' : '├──';
        console.log(`${prefix}${connector} ${file.name}`);
        
        if (!file.isFile) {
            const children = await file.getChildren(false);
            const childrenCount = children.length;
            
            for (let i = 0; i < childrenCount; i++) {
                const child = children[i];
                const isLastChild = i === childrenCount - 1;
                const nextPrefix = prefix + (isLast ? '    ' : '│   ');
                await File.printTree(child, nextPrefix, isLastChild);
            }
        }
    }

    static async getFile(fileName) {
        const stats = await fs.promises.stat(fileName);
        const name = path.basename(fileName);
        const ext = path.extname(fileName);
        const isFile = stats.isFile();
        const size = stats.size;
        const createTime = stats.birthtime;
        const updateTime = stats.mtime;
        return new File(fileName,name, ext, isFile, size, createTime, updateTime);
    }
}

async function readDir(dir, recursive = true) {
    const file = await File.getFile(dir);
    const children = await file.getChildren(recursive);
    return children;
}

async function main() {
    // 同目录文件: path.resolve(__dirname, 'node00.md')
    // 上一级目录: path.resolve(__dirname, '..')
    // 获取当前目录 path.resolve(__dirname)
    const filePath = path.resolve(__dirname, '..');
    
    // 方式1: 使用目录树结构显示
    console.log('\n========== 目录树结构 ==========');
    const file = await File.getFile(filePath);
    await File.printTree(file);
    
    // 方式2: 递归获取所有文件（扁平列表）
    console.log('\n========== 递归获取的所有文件 ==========');
    const children = await readDir(filePath);
    children.forEach(child => {
        console.log(`${child.isFile ? '[文件]' : '[目录]'} ${child.fileName}`);
    });
}

main();
```

## 6. 文件流

### 6.1. 什么是流

:::tip
流是指数据的流动，从一个地方流向另一个地方。

流是有方向的：

1. 可读流（Readable）：数据只能从源头流向目标
2. 可写流（Writable）：数据只能从目标流向源头
3. 双工流（Duplex）：数据可以从源头流向目标，也可以从目标流向源头

:::

### 6.2 为什么需要流

- 1.其他介质和内存数据规模不一致，内存和磁盘数据规模不一致

- 2.其他介质和内存数据数据处理能力不一致，内存和磁盘读写速度不一致

### 6.3 文件流（stream）

- 什么是文件流？
内存数据和磁盘数据之间的流动

- 文件流的练习

:::tip
fs.createReadStream(path[, options])
创建可读流

fs.createWriteStream(path[, options])
创建可写流

fs.pipe(source, dest[, options])
将可读流和可写流连接起来
:::

:::warning
`writeStream.write(data[, encoding][, callback])`存在背压问题，如何解决？pipe方法

1. 设置highWaterMark属性，控制每次写入的字节数

2. 监听writeStream的drain事件，当可写流不再背压时触发

:::

```js
const fs = require('fs');

// 创建可读流
const readStream = fs.createReadStream('node00.md', {
    encoding: 'utf-8',
    start: 0, // 开始位置
    end: 10, // 结束位置
    highWaterMark: 3 // 每次读取的字节数
});
// 创建可写流
const writeStream = fs.createWriteStream('node00-copy.md');

// 读取文件内容,每次读取3个字节后，触发data事件
readStream.on('data', chunk => {
    console.log('读取到数据', chunk.toString());
    // 写入文件内容
    writeStream.write(chunk); // 背压问题：如果写入速度慢，读取速度会变慢
    readStream.pause(); // 暂停读取
});

// 暂停
readStream.on('pause', () => {
    console.log('暂停读取');
    setTimeout(() => {
        readStream.resume(); // 恢复读取
    }, 2000);
})

// 恢复
readStream.on('resume', () => {
    console.log('恢复读取');
});

// 读取完成
readStream.on('end', () => {
    console.log('读取完成');
    writeStream.end();
});

// 写入完成
writeStream.on('finish', () => {
    console.log('写入完成');
});
```
