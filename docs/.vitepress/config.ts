import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';

export default defineConfig({
  base: "/vitepress-docs/",
  title: "fsl", //站点标题
  description: "公司项目总结", //mate标签description，多用于搜索引擎抓取摘要
  head: [
    ["link", { rel: "icon", href: "/vitepress-docs/favicon.ico" }], // 添加图标
  ],
  themeConfig: {
    siteTitle: "开博📝",
    logo: "/logo.png",
    nav: [
      { text: "博客", link: "/articles/组件库环境搭建" }, // 内链
      { text: "需求", link: "/requiredoc/" },
      {
        text: "Drop Menu", // 下拉菜单
        items: [
          {
            items: [
              { text: "Item A", link: "/item-1" },
              { text: "Item B", link: "/item-2" },
              { text: "Item C", link: "/item-3" },
            ],
          },
          {
            items: [
              { text: "Item B1", link: "/item-B1" },
              { text: "Item B2", link: "/item-B2" },
            ],
          },
        ],
      },
      { text: "gitlab76", link: "http://192.168.20.76/dashboard/projects" }, // 外链
      { text: "gitlab145", link: "http://192.168.20.145/dashboard/projects" }, // 外链
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/slfeng-xxt/vitepress-docs" },
      // { icon: 'qq', link: '...' },
      // You can also add custom icons by passing SVG as string:
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="SVG namespace"><title>Dribbble</title><path d="M12...6.38z"/></svg>',
        },
        link: "...",
      },
    ],
    sidebar: [
      {
        text: "项目汇总",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "南信大",
            link: "/projects/南信大",
          },
          {
            text: "开博框架",
            link: "/projects/开博框架",
          },
          {
            text: "crm系统迁移",
            link: "/projects/crm系统迁移",
          },
          {
            text: "监控平台",
            link: "/projects/监控平台",
          },
          {
            text: "数据资产",
            link: "/projects/数据资产",
          },
          {
            text: "BMS系统",
            link: "/projects/云能管理系统",
          },
          {
            text: "H5",
            link: "/projects/清陶H5",
          },
          {
            text: "小程序",
            link: "/projects/瑞易保小程序",
          },
          {
            text: "大屏",
            link: "/projects/大屏",
          },
          {
            text: "云能管理系统",
            link: "/projects/云能管理系统",
          }
        ],
      },
      {
        text: "组件库",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "小程序组件库",
            link: "/componentlib/小程序组件库",
          },
          { text: "pc组件", link: "/componentlib/pc组件" },
        ],
      },
      {
        text: "插件",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "HBuilderX", link: "/plugin/HBuilderX/HBuilderX"},
          { text: "vite", link: "/plugin/vite/vite"},
        ]
      },
      {
        text: "碎片",
        collapsible: true,
        collapsed:true,
        items: [
          { text: "css", link: "/splinter/css/index" },
          { text: "js", link: "/splinter/js/index" },
          { text: "vite", link: "/splinter/vite/index" },
        ],
      },
      {
        text: "前端笔记",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "javascript",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "原型&原型链", link: "/course/javascript/原型&原型链" },
              { text: "作用域", link: "/course/javascript/作用域" },
              { text: "执行上下文", link: "/course/javascript/执行上下文" },
              { text: "this", link: "/course/javascript/this" },
              { text: "闭包", link: "/course/javascript/闭包" },
              { text: "call、apply、bind", link: "/course/javascript/call" },
              { text: "new", link: "/course/javascript/new" },
              { text: "promise", link: "/course/javascript/promise" },
              { text: "浏览器事件", link: "/course/javascript/浏览器事件" },
              { text: "浏览器请求", link: "/course/javascript/浏览器请求" },
              { text: "模块化", link: "/course/javascript/模块化" },
              { text: "垃圾回收", link: "/course/javascript/GC" },
              { text: "运行机制", link: "/course/javascript/运行机制" },
              { text: "函数式编程", link: "/course/javascript/函数式编程" },
              { text: "es6", link: "/course/javascript/ES6" },
              { text: "babel", link: "/course/javascript/编译器" },
              { text: "TS", link: "/course/javascript/TS" },
            ],
          },
          {
            text: "TypeScript",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "TypeScript", link: "/course/typescript/typescript" },
            ]
          },
          {
            text: "css",
            collapsible: true,
            collapsed: true,
            items: [{ text: "codepen", link: "/course/css/codepen" }],
          },
          {
            text: "vue",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "vue2", link: "/course/vue/vue2" },
              { text: "vue3", link: "/course/vue/vue3" },
              { text: "vue状态管理", link: "/course/vue/状态管理" },
              { text: "vue-cli", link: "/course/vue/cli" },
              { text: "vue-Router", link: "/course/vue/Router" },
              { text: "SSR", link: "/course/vue/SSR" },
              { text: "vue2源码解析", link: "/course/vue/vue2源码" },
              { text: "vue3源码解析", link: "/course/vue/vue3源码" },
            ],
          },
          {
            text: "react",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "react基础", link: "/course/react/react基础" },
              { text: "react高级用法", link: "/course/react/react高级用法" },
              { text: "react状态管理", link: "/course/react/react状态管理" },
              { text: "CRA", link: "/course/react/CRA" },
              { text: "react-router", link: "/course/react/react-router" },
              { text: "react源码解析", link: "/course/react/react源码" },
            ],
          },
          {
            text: "Dart",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "Dart", link: "/course/dart/dart" },
            ]
          },
          {
            text: "Flutter",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "Flutter", link: "/course/flutter/flutter" },
            ]
          },
          {
            text: "前端工程化",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "AST", link: "/course/前端工程化/AST" },
              { text: "工程化", link: "/course/前端工程化/工程化" },
              { text: "wbebpack", link: "/course/前端工程化/wbebpack" },
              { text: "打包工具", link: "/course/前端工程化/打包工具" },
              { text: "自动化", link: "/course/前端工程化/自动化" },
              { text: "微前端", link: "/course/前端工程化/微前端" },
              { text: "ESlint9", link: "/course/前端工程化/ESlint" },
              { text: "代码质量检测工具", link: "/course/前端工程化/代码质量检测工具" },
            ],
          },
          {
            text: "前端性能优化",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "缓存", link: "/course/前端性能优化/缓存" },
              { text: "vue性能优化", link: "/course/前端性能优化/vue" },
              { text: "react性能优化", link: "/course/前端性能优化/react" },
            ],
          },
          {
            text: "内功升级",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "设计模式", link: "/course/前端升级/设计模式" },
              { text: "数据结构", link: "/course/前端升级/数据结构" },
              { text: "算法", link: "/course/前端升级/算法" },
            ],
          },
          {
            text: "生态库",
            collapsible: true,
            collapsed: true,
            items: [
              {
                text: "vue-router源码解析",
                link: "/course/前端生态库/vueRouter",
              },
              { text: "vue-cli源码解析", link: "/course/前端生态库/vueCli" },
            ],
          },
          {
            text: "组件库开发",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "初级", link: "/course/组件库开发/初级" },
              { text: "中级", link: "/course/组件库开发/中级" },
              { text: "高级", link: "/course/组件库开发/高级" },
            ]
          },
          {
            text: "git",
            collapsible: true,
            collapsed: true,
            items: [{ text: "git", link: "/course/git/git" }],
          },
          {
            text: "nginx",
            collapsible: true,
            collapsed: true,
            items: [{ text: "nginx", link: "/course/nginx/nginx" }],
          },
          {
            text: "vite",
            collapsible: true,
            collapsed: true,
            items: [{ text: "vite", link: "/course/vite/vite" }],
          },
          {
            text: "nodejs",
            collapsible: true,
            collapsed: true,
            items: [{ text: "nodejs", link: "/course/nodejs/nodejs" }],
          },
        ],
      },
      {
        text: "后端笔记",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "java",
            collapsible: true,
            collapsed: true,
            items: [{ text: "java基础", link: "/course/java/java基础" }],
          },
          {
            text: "数据库",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "mysql", link: "/course/数据库/mysql" },
              { text: "redis", link: "/course/数据库/redis" },
              { text: "mongodb", link: "/course/数据库/mongodb" },
              { text: "oracle", link: "/course/数据库/oracle" },
            ],
          },
        ],
      },
      {
        text: "web3.0",
        collapsible: true,
        collapsed: true,
        items: [{ text: "web3.0", link: "/course/web3/web3.0" }],
      },
      {
        text: "AI",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "MCP",
            link: "/AI/MCP.md",
          },
        ],
      },
    ],
    outline: "deep",
    outlineTitle: "目录",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    search: {
      provider: "local",
      options: {
        locales: {
          "/": {
            placeholder: "搜索文档",
            noResults: "没有找到结果",
            buttonLabel: "搜索",
          },
        },
      },
    },
  },
  markdown: { 
    config(md) { 
      md.use(vitepressDemoPlugin); 
    }, 
  },
});
