# 智慧储能系统APP

## 1.真机调试

### 1.1 安卓

:::tip
测试机：荣耀v10
:::

#### 说明

- Android设备信任（USB调试模式）
- [HBuilderX检测手机](https://uniapp.dcloud.net.cn/tutorial/run/run-app-faq.html#_4-2-%E6%A3%80%E6%B5%8Bios%E6%89%8B%E6%9C%BA)
- 荣耀手机助手下载
- [Android云端证书](https://dev.dcloud.net.cn/pages/app/list)【构建测试应用apk使用】
- 云打包

#### 兼容问题

- pt-safe不生效
- 多语言切换重载

### 1.2 IOS

:::tip
测试机：iphoneX
:::

#### 说明2

- [真机设备标准基座需要签名证书](https://blog.csdn.net/w1186859682/article/details/137870568)
- [爱思助手 IPA 签名教程](https://www.i4.cn/news_detail_38195.html#B)

#### 兼容问题2

- [刘海屏底部tabbar留白问题](https://www.cnblogs.com/tommymarc/p/14447598.html)

## 2.相关知识扩展

### 2.1 CSS3新单位vw、vh、vmin、vmax使用详解

- <https://zhuanlan.zhihu.com/p/635130763>

## 3. 功能相关

### 3.1 uniapp项目工程化

### 3.2 添加i18n，以及部分json配置，【t方法全局注册】

#### 问题

- Android 真机多语言切换重载，是因为 uni.setLocale() 在 Android 基座中会强制重启 WebView
（📌 官方说明（来自 DCloud 文档）：“在 App 端（尤其是 Android），调用 uni.setLocale() 会重新初始化 JS 引擎，导致当前页面 reload。”）

优化：放弃使用 uni.setLocale() 控制业务语言，改用 Vue 响应式状态 + 本地存储管理语言切换

### 3.3 接口轮询配置（alova 或者 vue-query），以及接口中英文转换配置

### 3.4 ui组件库主题添加配置功能

### 3.5 loading组件构建

### 3.6 echarts引入

### 3.7 约定式路由（只需要在这个目录里新增 .vue 文件，启动时执行脚本插件会自动生成对应的 pages.json 文件。）

### 3.8 登录跳转过程中状态和白名单等拦截

### 3.9 分包

### 3.10 登录退出接口调试

:::warning
问题：
1.启动后登录页跳转两次，
2.退出接口一直循环调用，http.js文件code部分写的有问题
3.启动页配置
:::

## 4. 优化

### 4.1 埋点（分析页面功能使用量）

#### 手动埋点（需要上报的时候调接口）

#### 声明式埋点（dom元素写入【点位】，自动上报）

```txt
上报时机：
1.dom销毁 MutationObserver  观察整个document.body
2.页面dom被点击 document.body.addEventListener("click", callback) && 是否是点击埋点
3.页面关闭 document.body.addEventListener("beforeunload", callback) document.body.addEventListener("visibilitychange", callback)
```
