# node第二节

## 1. [net模块🔗](https://www.nodejs.com.cn/api/net.html)

### 1.1 回顾http请求

- 普通模式：三次握手 -> 请求 -> 响应 -> 四次挥手
- 长链接模式: 三次握手 -> 数据传递 -> 四次挥手 （connection: keep-alive）

### 1.2 net模块

:::tip
TCP/IP: 网络通讯协议

IPC: 进程间通讯协议
:::

- net模块是node中用于创建基于流的TCP或IPC的服务器（`net.createServer()`）和客户端（`net.createConnection()`）的模块。
- net模块提供了异步的网络通信功能，包含创建服务器端和客户端的方法。

### 1.3 创建客户端

```js
const net = require('net')

/* client: 客户端，这是个特殊的文件 socket，可以用来连接服务器
    在node中表现为一个双工流对象，
    通过向流写入数据，可以发送消息给服务器，
    通过监听流的事件，可以接收服务器的响应
*/
const client = net.createConnection({
  host: '127.0.0.1',
  port: 3000
}, () => {
  console.log('客户端已连接')
  // http模式
//   client.write('GET / HTTP/1.1\r\nHost: localhost\r\n\r\n') // 发送数据给服务器
  // tcp模式
  client.write('hello world') // 发送数据给服务器
})

client.on('data', (data) => {
  console.log('客户端收到数据', data.toString()) // 接收服务器的响应
  client.end() // 关闭客户端
})


client.on('end', () => {
  console.log('客户端已断开连接')
})
```

### 1.4 创建服务器

```js
const net = require('net')

const server = net.createServer((socket) => {
  console.log('客户端已连接')
  socket.write('hello world')
  socket.on('data', (data) => {
    console.log('服务器收到数据', data.toString())
  })
  socket.on('end', () => {
    console.log('客户端已断开连接')
  })
})

server.listen(3000, () => {
  console.log('服务器已启动')
})
```

## 2.[http模块🔗](https://www.nodejs.com.cn/api/http.html)

:::tip
http模块是建立在net模块之上的，它提供了更高级的API，用于处理HTTP请求和响应。

1. 无需手动管理socket连接，http模块会自动处理连接的建立和关闭。

2. 无需手动组装消息格式，http模块会自动解析请求和响应的消息格式。

:::

- `http.createServer()`方法用于创建一个HTTP服务器，它接受一个回调函数作为参数，该回调函数会在每次有新的HTTP请求到达时被调用。

```js
const http = require('http')
// 创建一个HTTP服务器，监听3000端口
const server = http.createServer((req, res) => {
  console.log('收到请求', req.method, req.url)
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('hello world')
})

server.listen(3000, () => {
  console.log('服务器已启动')
})
```

- `http.request`对象包含了客户端发送的HTTP请求的所有信息，如请求方法、请求头、请求体等。[🔗](https://www.nodejs.com.cn/api/http.html#httprequesturl-options-callback)

```js
const http = require('http')
// 创建一个http客户端，发送一个GET请求
const resp = http.request({
    host: 'www.baidu.com',
    port: 80,
    path: '/',
    method: 'GET'
  }, (res) => {
    console.log('状态码', res.statusCode)
    console.log('响应头', res.headers)
    res.on('data', (data) => {
      console.log('响应体', data.toString())
    })
})
resp.end() // 表示请求结束
```

## 3.[https模块🔗](https://www.nodejs.com.cn/api/https.html)

- `https`模块是`http`模块的加密版本，它使用SSL/TLS协议来加密HTTP请求和响应。

- `https.createServer`方法用于创建一个HTTPS服务器，它接受一个回调函数作为参数，该回调函数会在每次有新的HTTPS请求到达时被调用。

```js
const https = require('https')
const fs = require('fs')

const options = {
  key: fs.readFileSync('./key.pem'), // 私钥
  cert: fs.readFileSync('./cert.pem') // 证书
}

const server = https.createServer(options, (req, res) => {
  console.log('收到请求', req.method, req.url)
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('hello world')
})

server.listen(3000, () => {
  console.log('服务器已启动')
})
```
