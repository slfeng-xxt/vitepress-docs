# step1

## 1.安装启动

### 1.1 安装

 虚拟机安装配置
 更改主机名 hostnamectl set-hostname web01
 使用epel源安装（具体步骤如下）
 yum repolist 查看当前系统的yum仓库有哪些软件包
 yum install epel-release -y 安装yum的扩展包
 yum install nginx -y
 systemctl start nginx.service
 systemctl enable nginx.service
 查看端口占用情况(nginx默认80端口) netstat -lntup
 查看进程 ps -ef|grep nginx

 安装一个apache的httpd（默认端口80）
 yum install httpd -y
 systemctl start httpd
 查看启动状态 systemctl status httpd

 查看当前地址 ip addr
 到浏览器输入 ip:80

## 2.配置及说明

nginx.conf
nginx.conf.default 备份文件

过滤配置文件注释
cd /etc/nginx/
grep -Ev '#|^$' nginx.conf.default > nginx.conf
编辑配置文件
vim nginx.conf

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
        server_name     localhost; #域名
        location / {   
            root     html;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```

修改后，检测nginx.conf语法
nginx -t
重启nginx
systemctl restart nginx

## 3.多端口部署多站点

一个nginx上可以运行多个网站，有多种方式：

### **1. 多端口**

nginx.conf中配置多个server,并设定不同的listen端口

```js
//...
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    server {
        listen         80;        #监听端口
        server_name     localhost; #域名
        location / {   
            root     /html/web1;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
     server {
        listen         81;        #监听端口
        server_name     localhost; #域名
        location / {   
            root     /html/web2;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```

### **2. 多IP**

2.1 windows系统中有nginx
部署nginx的系统中配置多ip地址之后，通过ipconfig 查看有多组ipv4；nginx端口用同一个；
例如：192.168.6.127、192.168.6.128、192.168.6.129  端口： 80
则 访问以上的ip可以得到相同的网页资源（nginx中的）
2.2 linux
ip addr 查看
networ-scripts中添加配置
IPADDR1=
IPADDR2=
IPADDR3=
NETMASK=255.255.255.0
GATEWAY=
systemctl restart network 重启网卡

```js
//...
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    server {
        listen         192.168.6.127:80;        #监听端口
        server_name     localhost; #域名
        location / {   
            root     /html/web1;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
     server {
        listen         192.168.6.128:80;        #监听端口
        server_name     localhost; #域名
        location / {   
            root     /html/web2;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```

#### **2. 多域名**

```js
//...
http {
    include       mine.types; #加载文件类型，nginx支持的文件
    defaullt_type  application/octet-stream; #默认以八进制流的方式输出
    server {
        listen         80;        #监听端口
        server_name     a.kx.com; #域名
        location / {   
            root     /html/web1;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
     server {
        listen         80;        #监听端口
        server_name     b.kx.com; #域名
        location / {   
            root     /html/web2;                #指定网站根目录（nginx/html）
            index    index.html index.htm;  #指定默认打开的页面
        }
    }
}
```
