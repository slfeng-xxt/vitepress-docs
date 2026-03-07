# clawdbot(OpenClaw)

- [openclaw官网](https://openclaw.cc/)
- [OpenClaw小龙虾保姆级安装教程！【Mac电脑版】小白10分钟搞定本地部署](https://www.bilibili.com/video/BV1t4Psz1EmW/?share_source=copy_web&vd_source=c100e63c66dbee31e022007ade2e8d7b)

## 0.简介

可以操作桌面应用的智能体机器人

## 1.本地安装记录📝

- 安装

```bash
npm i -g openclaw
```

- 启动

```bash
openclaw onboard
```

- 配置

```bash
openclaw config
```

## 2.接入飞书

### 2.1飞书开放平台相关配置

- [飞书开放平台](https://open.feishu.cn/?lang=zh-CN)
- 进入开发者后台
- 添加应用能力（机器人）
- 权限管理（im: 消息相关权限打开）
- 应用版本发布（上线）

### 2.2连接openclaw和飞书

:::tip
由于用户目录下安装，未全局安装。。。。先去用户目录下配置
:::

#### 配置飞书

```bash
openclaw config
```

- 选择Channels配置
- 选择飞书
- 输入飞书app的app_id和app_secret
- 其他飞书配置

#### 启用网关

```bash
openclaw gateway
```

#### 回到飞书开放平台

- 1.添加事件与回调

```text
- 事件配置长链接
- 添加事件：`接收消息`
```

- 2.权限管理配置

```text
- 添加通讯录（☑️获取通讯录基本信息）
```

- 3.发布新版本（上线）

#### 验证（手机端端飞书app）

- 在消息列表中点开`开发者小助手`，打开应用
- 发送消息，机器人回复消息
