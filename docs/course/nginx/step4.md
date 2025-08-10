# step4

## 10.nginx的gzip压缩

### 目的

为了省流量、加快传输速度。服务端的流量需要money，所有要省钱
压缩完之后再从服务器发送到客户端

**配置如下所示：**

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
            gzip on;                      #开启压缩
            gzip_min_length 1k;            #最小压缩文件
            gzip_buffers 4 32k;            #内存缓冲空间 4个32KB空间
            gzip_http_version 1.1;         #http版本
            gzip_comp_level   9;  #压缩等级， 等级1-9，越高压缩用时越长，但压缩的越小
            gzip_types  text/html text/css application/javascript;
            gzip_vary on;                  #http响应头添加gzip标识
            gzip_disable "MSIE [1-7]\.";    #遇到IE浏览器1-7的取消压缩
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```

## 11.nginx开启目录浏览功能

例如 课程资料网站

**配置如下所示：**

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
        
        autoindex on;   #开启目录浏览功能
        autoindex_exact_size   off; #显示文件大小时候带单位
        
        location / {  
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```

## 12.nginx的访问控制(allow deny)

### **1.控制类型：**

允许（加白名单）、禁止（加黑名单）

### **2.控制方式：**

#### *一种是在OSI模型的传输层（主机防火墙）*

systemctl start firewalld.server  #开启主机防火墙
firewall-cmd --add-rich-rule='rule family=ipv4 source address="xxx.xx.xx.xx" drop' # 禁用访问该地址的主机,任何协议都不行
systemctl stop firewalld.service  #关闭主机防火墙

#### *一种是在OSI模型的应用层（nginx）*

某个网站server配置文件下指定设置（allow deny）

```js
// a.conf
server {
    listen         80;        #监听端口
    server_name     a.kx.com; #域名
    location / {  
        deny  192.168.xx.xx;           #黑名单
        allow 110.2.xx.xx/0;           #白名单
        
        root     html;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
    }
}
```

#### nginx 403 forbidden

1. 上述deny禁止
2. 没有首页html文件
3. 文件没有读取权限 chmod 000 index.html

### 13.nginx的location和符号优先级

#### **location**

nginx网站可以配置多个Location,单独对某些访问路径进行控制

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
    # a目录加basic认证
    location /a {
        auth_basic "a.kx.com";
        auth_basic_user_file /etc/nginx/htpasswd;
    }
}
```

location还可以配置多个站点的根目录

```js
// a.conf
server {
    listen         80;        #监听端口
    server_name     a.kx.com; #域名
    location / {   
        root     /web/xxx;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
        auth_basic "a.kx.com"                   #开启认证 备注信息
        auth_basic_user_file /etc/nginx/htpasswd  #账号密码存放目录
    }
    # 访问a目录下的内容，其实是访问/web/a/index.html
    location /a {
        root /web
    }
}
```

#### **优先级**

```js
// 优先级顺序 = 大于 ~ 大于 ~* 大于 无符号
server {
    listen         80;        #监听端口
    server_name     a.kx.com; #域名
    location / {   
        root     /web/xxx;                #指定网站根目录（nginx/html）
        index    index.html index.htm;  #指定默认打开的页面
        auth_basic "a.kx.com"                   #开启认证 备注信息
        auth_basic_user_file /etc/nginx/htpasswd  #账号密码存放目录
    }
    // 访问txt文件，都返回404状态码（匹配规则）
    location ~* ^.*\.txt$ {
        return 404;
    }
    // 顺序
    location = /jpg {
        return 500;
    }
     location ~ /jpg {
        return 501;
    }
     location ~* /jpg {
        return 502;
    }
     location  /jpg {
        return 503;
    }
}
```
