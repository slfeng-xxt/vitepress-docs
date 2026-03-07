# 渲染

- SSR(server side render)-服务端渲染,页面在服务器端生成
- CSR(client side render)-客户端渲染，页面在客户端通过JavaScript生成

:::tip
前端渲染发展史：

- 纯静态页面，没有交互
- 服务器渲染，页面在服务器端生成，有利于SEO，但页面复杂度增加，服务器负载增加，开发成本高
- 客户端渲染，页面在客户端通过JavaScript生成，由于浏览器性能的提升，页面复杂度增加，但是相比服务端渲染开发成本降低（ui + 交互）；缺点：首屏加载慢，不利于SEO
- 同构渲染，首页面在服务器端生成，页面在客户端通过JavaScript生成，有利于SEO，开发成本降低

链接：

- [vue ssr](https://cn.vuejs.org/guide/scaling-up/ssr#client-hydration)

:::

## CSR-客户端渲染

**是在客户端浏览器中使用 JavaScript 动态生成页面内容**
大部分WEB应用都是使用 JavaScript 框架（Vue、React、Angular）进行页面渲染的，也就是说，在执行 JavaScript 脚本的时候，HTML页面已经开始解析并且构建DOM树了，
JavaScript 脚本只是动态的改变 DOM 树的结构，使得页面成为希望成为的样子，这种渲染方式叫**动态渲染**，也可以叫**客户端渲染（client side rende）**；

在传统的客户端渲染中，浏览器首先下载一个空的 HTML 页面，然后通过 JavaScript 请求数据并生成页面内容。这种方式的优点是可以提供更丰富的交互和动态效果
【缺点：例如，搜索引擎爬虫可能无法正确解析和索引页面内容，导致 SEO（搜索引擎优化）问题。同时，初始加载时用户可能会看到空白的页面或者出现闪烁的内容。】

## SSR-服务端渲染

:::tip
**一种将网页内容在服务器端动态生成并发送给客户端的技术**

- 服务端渲染通过在服务器上预先生成完整的 HTML 页面，将其发送给客户端浏览器
- 页面的渲染就是浏览器将HTML文本转化为页面帧的过程

:::

## 1. 定义

 服务端渲染就是在浏览器请求页面URL的时候，服务端将我们需要的HTML文本组装好，并返回给浏览器，这个HTML文本被浏览器解析之后，不需要经过 JavaScript 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。这个服务端组装HTML的过程，叫做**服务端渲染**

案例：vue-server-renderer的服务端渲染实现demo

```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    // 问题： v-model="url" 不会生效
    template: `<div>The visited URL is: {{ url }}<input v-model="url"/></div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

自定义页面模板

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- 插值语法 -->
    <title>{{ title }}</title>
    <!-- 插值语法, 3️⃣大括弧不转义 -->
    {{{ meta }}}
  </head>
  <body>
    <!-- 页面模板挂载节点，不能有空格，如下注释 -->
    <!--vue-ssr-outlet-->
  </body>
</html>
```

```js
const Vue = require('vue')
const server = require('express')()
const template = require('fs').readFileSync('./index.template.html', 'utf-8')
const renderer = require('vue-server-renderer').createRenderer({
  template  
})

server.get('*', async(req, res) => {
    try {
        const app = new Vue({
          data: {
            url: req.url
          },
          template: `<div>The visited URL is: {{ url }}</div>`
        })
        const desc = {
            title: 'hello',
            meta: `
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="hello">
            `
        }
        const html = await renderer.renderToString(app, desc)         
          res.end(html)
    } catch (error) {
        res.status(500).end('Internal Server Error')
    }
})
```

## 2. 由来

在没有AJAX的时候，也就是web1.0时代，几乎所有应用都是服务端渲染

## 3. 优缺点

### 优点

- 利于SEO
- 白屏时间更短

### 缺

- 代码复杂度增加
- 需要更多的服务器负载均衡
- 涉及构建设置和部署的更多要求

## 4. vue的应用框架

- <https://cn.vuejs.org/guide/scaling-up/ssr#higher-level-solutions>

### Nuxt

:::tip
需求场景：Vue.js 应用需要支持 SEO，并且需要更快的首屏加载速度。
:::

**nuxt基本上是由vue2，webpack，babel这三个构成的**
Nuxt 是一个构建于 Vue 生态系统之上的全栈框架，它为编写 Vue SSR 应用提供了丝滑的开发体验。更棒的是，你还可以把它当作一个静态站点生成器来用！

- [中文版文档](https://nuxt.zhcndoc.com/docs/4.x/getting-started/introduction)
- [英文版文档](https://nuxt.com/docs/4.x/getting-started/introduction)

**TODO**
实践： github action部署一个nuxt项目<https://nuxtjs.org.cn/deploy/github-pages>

### Quasar

**Quasar 是一个基于 Vue 的完整解决方案**
它可以让你用同一套代码库构建不同目标的应用，如 SPA、SSR、PWA、移动端应用、桌面端应用以及浏览器插件。除此之外，它还提供了一整套 Material Design 风格的组件库。
(只写一次代码的情况下发布到多个平台 website, PWA ,Mobile App 和 Electron App ，用起来表示十分满意。)

### Vite SSR

Vite 提供了内置的 Vue 服务端渲染支持，但它在设计上是偏底层的。如果你想要直接使用 Vite，可以看看 vite-plugin-ssr，一个帮你抽象掉许多复杂细节的社区插件。

## 5. React的应用框架

### Next

**Next一个开源的 React 框架**
用于构建服务器渲染（SSR）和静态生成（SSG）的应用程序。它结合了 React 的声明性和灵活性以及服务器端渲染的性能优势，使得构建高性能的应用变得更加简单。

## 6. Node的应用框架

### * Nest

**Nest.js 是一个用于构建 Node.js 服务器端应用的框架**
基于 TypeScript 的框架，用于构建可扩展和模块化的服务器端应用程序。它结合了 Angular 的依赖注入和模块化、Express 的灵活性和 Node.js 的性能优势，使得构建高性能的应用变得更加简单。构建服务器端应用程序
Nest.js 基于模块化的架构设计，提供了丰富的功能和插件，包括路由管理、中间件支持、数据库集成等。

## 7. 相关框架问题

- [Nuxt.js，Next.js，Nest.js傻傻分不清？](https://cloud.tencent.com/developer/article/2361386)
- [15 个 JavaScript 框架的全面概述](https://cloud.tencent.com/developer/article/2297791)
