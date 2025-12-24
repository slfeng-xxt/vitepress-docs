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

