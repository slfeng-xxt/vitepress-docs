# step4

## 7.nginx的SSL证书配置

- **http协议访问的网站默认会显示不安全，因为数据默认明文传输**

https = http + ssl(加密协议)，通过证书来加密，安装证书的网站才用https协议
例如浏览器地址栏起始位有小锁的图标和不安全的提示
申请证书流程：先申请一个域名（阿里云、腾讯云），再去申请证书

```js
搜索SSL证书 -> 证书管理平台 -> SSL证书 -> 免费证书 -> 创建证书 -> 提交申请 -> 审核通过下载证书 
```

- **相关配置如下：**

```js
// nginx.conf 文件
worker_processes 1;  #启动一个工作进程，根据cpu核数设置，几核设置几
events {
    worker_connections 1024; #一个线程同时可以处理请求的数量
}
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    charset    utf-8;  #指定字符集
    server {
        listen         443 ssl;  #监听端口(http默认80 https默认443)
        server_name     <yourdomain>; #证书绑定的域名
        
        ssl_certificate cert/<cert-file-name>.pem #证书文件名称
        ssl_certificate_key cert/<cert-file-name>.key #证书私钥文件名称
        ssl_session_timeout 5m
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256 #加密套件类型
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3
        ssl_prefer_server_ciphers on
        location / {   
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    } 
}
```

## 8.nginx的return跳转

- **http跳转到Https**

```js
// nginx.conf 文件
worker_processes 1;  #启动一个工作进程，根据cpu核数设置，几核设置几
events {
    worker_connections 1024; #一个线程同时可以处理请求的数量
}
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    charset    utf-8;  #指定字符集
    server {
        listen         443 ssl;  #监听端口(http默认80 https默认443)
        server_name     <yourdomain>; #证书绑定的域名
        location / {   
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    } 
    // 配置return跳转
    server {
        listen   80;
        server_name www.kx.com;
        loction / {
            return  302 https://www.kx.com$request_uri;
        }
    }
}
```

### 8.nginx的rewrite跳转

```js
// nginx.conf 文件
worker_processes 1;  #启动一个工作进程，根据cpu核数设置，几核设置几
events {
    worker_connections 1024; #一个线程同时可以处理请求的数量
}
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    charset    utf-8;  #指定字符集
    server {
        listen         443 ssl;  #监听端口(http默认80 https默认443)
        server_name     <yourdomain>; #证书绑定的域名
        location / {   
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    } 
    // 配置rewrite跳转
    server {
        listen   80;
        server_name www.kx.com;
        loction / {
            rewite  ^/(.*) https://www.kx.com/$1 redirect;
        }
    }
}
```
