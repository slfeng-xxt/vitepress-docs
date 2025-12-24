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
    writeStream.write(chunk);
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