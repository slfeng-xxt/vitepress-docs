# MySQL

## 1. 数据库简介

### 1.1 数据库能干什么

- 持久的存储数据，数据存储在硬盘上
- 备份和恢复数据
- 快速存取数据
- 权限控制

### 1.2 数据库的类型

#### 1.2.1 关系型数据库

- 特点：数据以表格的形式存储，表与表之间有关系
- 优点：能表达复杂的数据关系，**强大的查询语言，能精准的查询数据**
- 缺点：读写性能差，数据结构比较死板，扩展性差
- 用途：**存储关系复杂的数据**，如：电商、博客、论坛、OA系统、CRM系统、ERP系统
- 代表：MySQL、Oracle、SQL Server、SQLite、PostgreSQL

#### 1.2.2 非关系型数据库

- 特点：数据以**文档的形式**存储，键值对形式存储
- 优点：读写性能高，数据结构灵活，扩展性好
- 缺点：不能表达复杂的数据关系，查询语言比较弱
- 用途：**存储关系简单的数据**，如：缓存、日志、排行榜、消息队列
- 代表：Redis、MongoDB、Memcached

### 1.3 常用术语

- DB: 数据库（database），存储数据的容器
- DBA: 数据库管理员（database administrator）
- DBMS: 数据库管理系统（database management system），管理DB的软件
- DBS: 数据库系统（database system），DB、DBMS、DBA的集合

## 2. MySQL安装

### 2.1 下载

- 官网下载：<https://dev.mysql.com/downloads/mysql/>

### 2.2 使用

查看编码格式：

```sql
show variables like 'character%';
```

修改编码格式：

```sql
set character_set_server=utf8;
```

常用命令：

- 查看MySQL版本：`mysql --version`
- 启动MySQL服务：`net start mysql`
- 停止MySQL服务：`net stop mysql`
- 登录MySQL：`mysql -uroot -p`，默认密码为空
- 退出MySQL：`exit`

### 2.3 Navicat下载安装

## 3. 数据库设计

### 3.1 SQL

Structured Query Language，结构化查询语言，用于访问和操作数据库

#### 3.1.1 DDL（Data Definition Language）

数据定义语言，用于创建或删除存储数据用的数据库以及数据库中的表等对象

- 创建数据库：`create database 数据库名;`
- 删除数据库：`drop database 数据库名;`
- 创建表：`create table 表名(列名1 数据类型1, 列名2 数据类型2, ...);`，如：`create table user(id int, name varchar(20), age int);`
- 删除表：`drop table 表名;`
- 修改表：`alter table 表名 add 列名 数据类型;`，如：`alter table user add gender varchar(10);`
- 查看表结构：`desc 表名;`
- 查看表数据：`select * from 表名;`，如：`select * from user;`
- 查看数据库：`show databases;`
- 使用数据库：`use 数据库名;`

#### 3.1.2 DML（Data Manipulation Language）

数据操作语言，SQL中用于查询和更新数据库中数据的操作

- 插入数据：`insert into 表名(列名1, 列名2, ...) values(值1, 值2, ...);`，如：`insert into user(id, name, age) values(1, '张三', 20);`
- 更新数据：`update 表名 set 列名1=值1, 列名2=值2, ... where 条件;`，如：`update user set age=21 where id=1;`
- 删除数据：`delete from 表名 where 条件;`，如：`delete from user where id=1;`
- 查询数据：`select * from 表名;`，如：`select * from user;`
- 查询指定列：`select 列名1, 列名2, ... from 表名;`，如：`select name, age from user;`
- 查询指定条件：`select * from 表名 where 条件;`，如：`select * from user where age>20;`
- 查询指定条件且指定列：`select 列名1, 列名2, ... from 表名 where 条件;`，如：`select name, age from user where age>20;`

#### 3.1.3 DCL（Data Control Language）

数据控制语言，用于控制数据库的访问权限和安全等

- 创建用户：`create user '用户名'@'主机名' identified by '密码';`，如：`create user 'zhangsan'@'localhost' identified by '123456';`
- 授予权限：`grant 权限 on 数据库名.表名 to '用户名'@'主机名';`，如：`grant all on mydb.* to 'zhangsan'@'localhost';`
- 撤销权限：`revoke 权限 on 数据库名.表名 from '用户名'@'主机名';`，如：`revoke all on mydb.* from 'zhangsan'@'localhost';`
- 删除用户：`drop user '用户名'@'主机名';`，如：`drop user 'zhangsan'@'localhost';`

### 3.2 管理库

### 3.2 管理表

### 3.2 主键和外键

### 3.2 表关系

### 3.2 三大设计范式
