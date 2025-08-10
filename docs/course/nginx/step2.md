# step2

## 4.include配置文件

方便维护管理多个站点,将server配置的*.conf文件放在 nginx/conf.d 目录下，并在nginx.conf文件中include（引入该目录下的*.conf配置文件）

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
    include    /etc/nginx/conf.d/*.conf  #include配置文件
}
```

```js
// a.conf
server {
    listen         80;        #监听端口
    server_name     a.kx.com; #域名
    location / {   
        root     html;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
    }
}
```

```js
// default.conf 默认配置文（当访问nginx中没有的server时候，include 中默认文件）
server {
    listen         80 default_server;        #监听端口-指定为默认配置文件
    server_name     a.kx.com; #域名
    location / {   
        root     html;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
    }
}
```

## 5.nginx日志功能

**网络安全法规定：web服务器必须要开启日志记录功能，并且记录必须不少于6个月**
ls /var/log/nginx
access.log access.log-20240806 error.log error.log-20240806
cat access.log 查看今日日志

定制日志访问格式  log_format

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
        listen         80;        #监听端口
        server_name     a.kx.com; #域名
        access_log   /opt/nginx/a.kx.com_log compression #日志存放地址 日志格式
        location / {   
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
    log_format compression '$remote_addr - $remote_user [$time_local]'
                         '"$request" $status $bytes_sent'
                         '"$http_referer" "$http_user_agent" "$gzip_ratio"' 
}
```

（compression为log_format的key，在server中配置access_log的时候使用该格式key名）
compression 配置说明：   客户端的ip地址  客户端的用户名  当前时间
                     请求起始行   http状态码  响应资源的大小
                     记录资源的跳转地址  用户的终端信息  gzip的压缩级别

创建 /opt/nginx 存放目录，并授权nginx
chown nginx:nginx /opt/nginx/
systemctl restart nginx
****
**总结**
a. 定制日志格式 log_format ，该信息放在nginx.conf文件中
b. 每个server配置access_log(日志存放目录+日志格式)
c. nginx授权，重启
d. cat access_log 查看日志

## 6.nginx开启basic认证

- **basic认证，http基本认证，给网站添加锁功能，防止恶意访问**

### 6.1 生成htpasswd账号密码

使用[在线生成htpasswd工具](https://tools.jb51.net/password/htpasswd)

### 6.2 把生成的上述文件存放到 /etc/nginx/htpasswd

vim /etc/nginx/htpasswd

### 6.3 给某个server网站的配置文件添加

**例如：**

```js
// a.conf
server {
    listen         80;        #监听端口
    server_name     a.kx.com; #域名
    location / {   
        root     html;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
        auth_basic "a.kx.com"                   #开启认证 备注信息
        auth_basic_user_file /etc/nginx/htpasswd  #账号密码存放目录
    }
}
```

### 6.4 重启nginx

systemctl restart nginx
