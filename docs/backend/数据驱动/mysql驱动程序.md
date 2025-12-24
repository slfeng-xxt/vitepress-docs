# mysql驱动程序

:::tip
什么是驱动程序？

驱动程序是操作系统和硬件之间的接口，操作系统通过驱动程序来控制硬件设备。驱动程序是操作系统的一部分，它允许操作系统与硬件设备进行通信。驱动程序是操作系统的一部分，它允许操作系统与硬件设备进行通信。驱动程序是操作系统的一部分，它允许操作系统与硬件设备进行通信。
:::

## 1. mysql驱动程序

### 1.1. mysql驱动程序简介

mysql驱动程序是连接内存数据库和mysql数据库的桥梁，它允许内存数据库中的数据被存储到mysql数据库中。

### 1.2. mysql驱动程序有哪些？

- mysql
- mysql2

## 2. mysql2的使用

- doc: <https://sidorares.github.io/node-mysql2/zh-CN/docs>

### 注意事项

- 防止sql注入
- 建立连接池，避免频繁建立连接或忘记关闭连接

## 3. ORM

:::tip
什么是ORM？介于数据库和应用程序之间的一个中间件，将数据库中的表和字段映射为对象和属性，通过操作对象和属性来操作数据库中的表和字段。

ORM（Object-Relational Mapping，对象关系映射）是一种将对象模型映射到关系数据库的技术。它允许开发人员使用面向对象的方式来操作数据库，而不需要直接编写SQL语句。ORM框架将对象模型中的类和属性映射到数据库中的表和列，并提供了一组API来操作这些对象和关系。ORM框架可以自动生成SQL语句，并执行它们，从而简化了数据库操作。
:::

Node.js中常用的ORM框架有：

- sequelize： <https://www.sequelize.com.cn/>
- TypeORM： <https://typeorm.io/>
- Objection.js： <https://vincit.github.io/objection.js/>

### 3.1 mysql2和sequelize的区别

- mysql2是mysql的驱动程序，sequelize是mysql的ORM框架。
