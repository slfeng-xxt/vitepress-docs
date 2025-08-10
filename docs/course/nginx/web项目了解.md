# web服务

## 1、web介绍

### 1.0 web全称：world wide web,全球广域网，万维网

### 1.1 web项目架构

1. C/S架构（客户端服务端架构）- Client/Server
** 例如 qq 微信 淘宝等应用的客户端程序。服务端处理数据、客户端展示数据。成本高，几百万
2. B/S架构（浏览器服务端架构）- Brower/Server （C/S架构的一种）
** 例如 淘宝网站、博客园网站等。基于浏览器访问的网站都是。成本低
3. web发展阶段

* web1.0:纯静态页面
* web2.0:可交互，支持上传下载互动
* web3.0:移动互联网，需要客户端app（安卓、iOS）,例如：支付宝

## 2、http协议介绍

超文本传输协议（Hyper Text Transfer Protocol, HTTP）--- 发明者：蒂姆·伯纳斯·李 1990

### 2.1 网络模型

两个程序之间如何进行数据交换

1.应用层 HTTP/FTP/DNS/SMTP (具体应用相关的消息格式)
2.传输层 TCP/UDP (消息可靠)
3. 网络层 IP/路由器 （互联网中找到对方）
4. 数据链路层 MAC/交换机 （子网中找到对方）
5. 物理层 光纤、双绞线、同轴电缆 （以上信息用信号表达传递）

### 2.2 HTTP

1. 传递消息的模式（client -> request -> server）(client <- response <- server)
2. 传递消息的格式

```js
    请求协议
    请求行
    请求头
    
    请求体
    
    响应协议
    响应行
    响应头
    
    响应体
```

3.请求方法（put/get/post...）
4.媒体类型（content-type）详见MDN
    text 文本  text/plain 纯文本  text/html text/javascript
    image 图像
    audio 音频文件
    video 视频文件

### 2.3 抓包

抓包工具：Wireshark

## 3、html介绍

超文本标记语言（Hyper Text Markup Language, HTML）

## 4、nginx了解

apache nginx是叫做web服务应用软件，其实就是web服务端程序，也叫web服务器软件，web server.
