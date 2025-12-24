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

:::tip
DDL（Data Definition Language）数据定义语言，用于创建或删除存储数据用的数据库以及数据库中的表等对象。
:::

### 3.3 管理表

#### 3.3.1 创建表

- 字段类型：int/varchar/char/text/enum/set/decimal/float/datetime/timestamp
- 自增
- 默认值

### 3.4 主键和外键

:::tip
主键：唯一标识一条记录，不能重复，不能为空
外键：建立表与表之间的关系，外键列的值引用另一张表的主键列的值
:::

### 3.5 表关系

- 一对一：一张表中的一条记录对应另一张表中的一条记录，如：学生和身份证
- 一对多：一张表中的一条记录对应另一张表中的多条记录，如：部门和员工
- 多对多：一张表中的多条记录对应另一张表中的多条记录，如：学生和课程

### 3.6 三大设计范式

- 第一范式：确保每列的原子性，即列不可再分
- 第二范式：在第一范式的基础上，确保表中的每列都和主键相关，而不能只与主键的某一部分相关
- 第三范式：在第二范式的基础上，确保表中的每列都和主键列直接相关，而不是通过其他列间接相关

## 4. 表记录的操作（DML）

:::tip
CRUD：Create、Retrieve、Update、Delete
:::

## 5. 单表基本查询

:::tip
运行顺序：from -> join ... on -> where -> group by -> having -> select -> order by -> limit
:::

where有哪些条件：=、!=、<>、<、<=、>、>=、between...and、is null、and、or、in、not in、like、not like

```sql
-- 查询所有记录
select * from 表名 where 条件 group by 分组 having 过滤 order by 排序 limit 限制;

-- case: 用于实现条件判断，返回一个值
select name, (case sex when 1 then '男' else '女' end) as sex from user;

-- disinct: 用于返回不重复的记录
select distinct name from user;

-- where: 用于指定查询条件，返回满足条件的记录
select * from user where id = 1;

-- group by: 用于将查询结果按照指定的列进行分组，返回每个分组的结果
select * from user group by sex;

-- having: 用于对分组后的结果进行过滤，返回满足条件的分组结果
select * from user group by sex having count(*) > 1;

-- order by: 用于对查询结果按照指定的列进行排序，返回排序后的结果
select * from user order by id desc;

-- limit: 用于限制查询结果的数量，返回指定数量的记录
select * from user limit 1;
-- limit N,M : 相当于 limit M offset N , 从第 N 条记录开始, 返回 M 条记录
-- 分页：page: 页码 ; page_size: 每页显示的记录数
select * from _table limit (page-1)*page_size, page_size
```

## 6. 联表查询

- 全连接（笛卡尔积）：将两个表的所有记录进行组合，返回所有可能的组合结果。
- 左连接： 以左表为基准，返回左表的所有记录，以及右表中与左表匹配的记录。如果右表中没有匹配的记录，则返回 NULL。
- 右连接：以右表为基准，返回右表的所有记录，以及左表中与右表匹配的记录。如果左表中没有匹配的记录，则返回 NULL。
- 内连接：只返回两个表中匹配的记录，不返回不匹配的记录。

```sql
-- 全连接
select * from user u, order o on u.id = o.user_id;

-- 左连接
select * from user u left join order o on u.id = o.user_id;

-- 右连接
select * from user u right join order o on u.id = o.user_id;

-- 内连接
select * from user u inner join order o on u.id = o.user_id;
```

## 7. 函数

- 内置函数：MySQL 提供了一些内置函数，如字符串函数、数学函数、日期函数等，可以直接使用。
- 自定义函数：用户可以根据自己的需求，自定义函数，并在查询中使用。

### 7.1 内置函数

- 数学：abs、ceil、floor、round、sqrt、pow、mod、rand、sin、cos、tan 等。
- 聚合: count、sum、avg、max、min 等。
- 字符: concat、length、substring、upper、lower、trim、replace 等。
- 日期: now、curdate、curtime、date、time、year、month、day、hour、minute、second、datediff、date_add、date_sub 等。

```sql
-- 聚合
select count(id) as 总数,
       sum(id) as 总和,
       avg(id) as 平均数,
       max(id) as 最大值,
       min(id) as 最小值
from user;

-- 日期
select *,
timestampdiff(now(), create_time) as 时间差,
from user;
```

### 7.2 自定义函数

```sql
-- 创建函数
create function add(a int, b int) returns int
begin
    return a + b;
end;

-- 调用函数
select add(1, 2);
```

## 8. 分组

:::tip
分组：将数据按照指定的条件进行分组，然后对每组数据进行聚合操作。

注意：分组后，只能使用聚合函数，或者分组条件列，其他列不能使用。
:::

```sql
-- 按照性别分组，统计每个性别的用户数量，使用concat函数拼接字符串
select gender, concat('性别为', gender, '的用户数量为', count(id)) as 数量
from user
group by gender;

-- 按照性别分组，统计每个性别的用户数量，并且只显示数量大于1的性别
select gender, count(id) as 数量
from user
group by gender
having count(id) > 1;
```

## 9. 视图

:::tip
视图：将查询结果保存为一个虚拟表，可以在查询时直接使用。属于DDL（数据定义语言）。

应用具体场景：在查询时，如果需要使用到复杂的查询语句，可以将查询结果保存为一个视图，然后在查询时直接使用视图。这个视图存在于内存中，所以查询速度非常快。
:::

```sql
-- 创建视图
create view user_view as
select id, name, gender
from user;

-- 查询视图
select *
from user_view;
```
