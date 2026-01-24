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
    siteTitle: "Alex🍊",
    logo: "/logo.png",
    nav: [
      { text: "博客园", link: "https://www.cnblogs.com/slfeng" }, // 内链
      { text: "vitepress",
        items: [
          {
            items: [
              { text: "vitepress指南", link: "https://vitejs.cn/vitepress/guide/markdown.html" },
              { text: "Vitepress Demo Plugin", link: "https://vitepress-demo.fe-dev.cn/" },
            ]
          }
        ]
      },
      {
        text: "代码地址", // 下拉菜单
        items: [
          {
            items: [
              { text: "gitlab76", link: "http://192.168.20.76/dashboard/projects" },
              { text: "gitlab145", link: "http://192.168.20.145/dashboard/projects" },
            ],
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/slfeng-xxt/vitepress-docs" },
      // { icon: 'qq', link: '...' },
      // You can also add custom icons by passing SVG as string:
      // {
      //   icon: {
      //     svg: '<svg role="img" viewBox="0 0 24 24" xmlns="SVG namespace"><title>Dribbble</title><path d="M12...6.38z"/></svg>',
      //   },
      //   link: "...",
      // },
    ],
    sidebar: [
      {
        text: "项目汇总 🐼",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "项目映射",
            link: "/projects/项目映射",
          },
          {
            text: "大屏",
            link: "/projects/大屏",
          },
          {
            text: "BMS系统",
            link: "/projects/云能管理系统",
          },
          {
            text: "小程序",
            link: "/projects/瑞易保小程序",
          },
          {
            text: "H5",
            link: "/projects/清陶H5",
          },
          {
            text: "监控平台（待补充项目代码）",
            link: "/projects/监控平台",
          },
          {
            text: "数据资产",
            link: "/projects/数据资产",
          },
          {
            text: "开博框架（待补充项目代码）",
            link: "/projects/开博框架",
          },
          {
            text: "crm系统迁移",
            link: "/projects/crm系统迁移",
          },
          {
            text: "南信大",
            link: "/projects/南信大",
          },
          {
            text: "JavaScript Table",
            link: "/projects/JavaScriptTable",
          }
        ],
      },
      {
        text: "前端笔记 🔥",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "JavaScript",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "原型&原型链", link: "/front/javascript/原型&原型链" },
              { text: "作用域", link: "/front/javascript/作用域" },
              { text: "执行上下文", link: "/front/javascript/执行上下文" },
              { text: "this", link: "/front/javascript/this" },
              { text: "闭包", link: "/front/javascript/闭包" },
              { text: "call、apply、bind", link: "/front/javascript/call" },
              { text: "new", link: "/front/javascript/new" },
              { text: "promise", link: "/front/javascript/promise" },
              { text: "浏览器事件", link: "/front/javascript/浏览器事件" },
              { text: "浏览器请求", link: "/front/javascript/浏览器请求" },
              { text: "模块化", link: "/front/javascript/模块化" },
              { text: "垃圾回收", link: "/front/javascript/GC" },
              { text: "运行机制", link: "/front/javascript/运行机制" },
              { text: "函数式编程", link: "/front/javascript/函数式编程" },
              { text: "es6", link: "/front/javascript/ES6" },
              { text: "babel", link: "/front/javascript/编译器" },
            ],
          },
          {
            text: "TypeScript",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "初级-1", link: "/front/typescript/第一章.md" },
              { text: "初级-2", link: "/front/typescript/第二章.md" },
              { text: "初级-3", link: "/front/typescript/第三章.md" },
              { text: "初级-4", link: "/front/typescript/第四章.md" },
              { text: "初级-5", link: "/front/typescript/第五章.md" },
              { text: "练习", link: "/front/javascript/TS" },
            ]
          },
          {
            text: "CSS",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "codepen", link: "/front/css/codepen" },
              { text: "css3", link: "/front/css/css3" },
            ],
          },
          {
            text: "Vue",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "vue2", link: "/front/vue/vue2" },
              { text: "vue3", link: "/front/vue/vue3" },
              { text: "vue3强化", link: "/front/vue/vue3强化" },
              { text: "vue3响应式丢失", link: "/front/vue/vue3响应式丢失" },
              { text: "vue状态管理", link: "/front/vue/状态管理" },
              { text: "vue-cli", link: "/front/vue/cli" },
              { text: "vue-Router", link: "/front/vue/Router" },
              { text: "SSR", link: "/front/vue/SSR" },
              { text: "vue2源码解析", link: "/front/vue/vue2源码" },
              { text: "vue3源码解析", link: "/front/vue/vue3源码" },
            ],
          },
          {
            text: "React",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "react基础", link: "/front/react/react基础" },
              { text: "react高级用法", link: "/front/react/react高级用法" },
              { text: "react状态管理", link: "/front/react/react状态管理" },
              { text: "CRA", link: "/front/react/CRA" },
              { text: "react-router", link: "/front/react/react-router" },
              { text: "react源码解析", link: "/front/react/react源码" },
            ],
          },
          // {
          //   text: "Angular ",
          //   collapsible: true,
          //   collapsed: true,
          //   items: [
          //     { text: "Angular", link: "/front/angular/angular" },
          //   ]
          // },
          {
            text: "包管理工具",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "pnpm", link: "/front/nm/pnpm" },
            ]
          },
          // {
          //   text: "Flutter ",
          //   collapsible: true,
          //   collapsed: true,
          //   items: [
          //     { text: "Flutter", link: "/front/flutter/flutter" },
          //   ]
          // },
          {
            text: "前端工程化",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "AST", link: "/front/前端工程化/AST" },
              { text: "工程化", link: "/front/前端工程化/工程化" },
              { text: "webpack", link: "/front/前端工程化/webpack" },
              { text: "打包工具", link: "/front/前端工程化/打包工具" },
              { text: "自动化", link: "/front/前端工程化/自动化" },
              { text: "微前端", link: "/front/前端工程化/微前端" },
              { text: "ESlint9", link: "/front/前端工程化/ESlint" },
              { text: "代码质量检测工具", link: "/front/前端工程化/代码质量检测工具" },
              { text: "monorepo工程管理", link: "/front/前端工程化/pnpmmonorepo工程管理" },
            ],
          },
          {
            text: "前端脚手架 ",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "脚手架开发流程", link: "/front/前端脚手架/00.md" },
              { text: "构建一个脚手架", link: "/front/前端脚手架/01.md" },
              { text: "脚手架命令注册&参数解析", link: "/front/前端脚手架/02.md" },
              { text: "脚手架原理", link: "/front/前端脚手架/03.md" },
              { text: "Lerna", link: "/front/前端脚手架/04.md" },
            ]
          },
          {
            text: "前端性能优化",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "缓存", link: "/front/前端性能优化/缓存" },
              { text: "vue性能优化", link: "/front/前端性能优化/vue" },
              { text: "react性能优化 ", link: "/front/前端性能优化/react" },
            ],
          },
          {
            text: "内功升级",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "设计模式之前言", link: "/front/前端升级/设计模式0" },
              { text: "设计模式之创建型", link: "/front/前端升级/设计模式1" },
              { text: "设计模式之结构型", link: "/front/前端升级/设计模式2" },
              { text: "设计模式之行为型", link: "/front/前端升级/设计模式3" },
              { text: "数据结构 ", link: "/front/前端升级/数据结构" },
              { text: "算法 ", link: "/front/前端升级/算法" },
            ],
          },
          {
            text: "生态库 ",
            collapsible: true,
            collapsed: true,
            items: [
              {
                text: "vue-router源码解析",
                link: "/front/前端生态库/vueRouter",
              },
              { text: "vue-cli源码解析", link: "/front/前端生态库/vueCli" },
            ],
          },
          {
            text: "组件库开发",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "初级", link: "/front/组件库开发/初级" },
              { text: "中级", link: "/front/组件库开发/中级" },
              { text: "高级", link: "/front/组件库开发/高级" },
            ]
          },
          {
            text: "Git",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "git", link: "/course/git/git" },
              { text: "安装", link: "/course/git/git安装" },
              { text: "教程", link: "/course/git/git教程" },
              { text: "gitignore", link: "/course/git/gitignore" },
              { text: "git命令", link: "/course/git/git命令" },
            ],
          },
          {
            text: "Nginx",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "web了解", link: "/course/nginx/web项目了解" },
              { text: "step1", link: "/course/nginx/step1" },
              { text: "step2", link: "/course/nginx/step2" },
              { text: "step3", link: "/course/nginx/step3" },
              { text: "step4", link: "/course/nginx/step4" },
            ],
          },
          {
            text: "Vite ",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "前言概览", link: "/front/vite/vite0" },
              { text: "什么是构建工具", link: "/front/vite/vite1" },
              { text: "vite相对于webpack的优势", link: "/front/vite/vite2" },
              { text: "vite脚手架", link: "/front/vite/vite3" },
              { text: "vite配置文件", link: "/front/vite/vite4" },
            ],
          },
          {
            text: "Node",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "第一节", link: "/front/node/node00" },
              { text: "第二节", link: "/front/node/node01" },
              { text: "第三节", link: "/front/node/node02" },
            ],
          },
          {
            text: "chrome ",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "GPU", link: "/front/chrome/GPU" },
              { text: "脚本", link: "/front/chrome/脚本" },
            ]
          },{
            text: "网络",
            collapsible: true,
            collapsed: true,
            items: [
              // { text: "网络基础", link: "/front/网络/网络基础" },
            ]
          },{
            text: "浏览器原理",
            collapsible: true,
            collapsed: true,
            items: [
            ]
          },{
            text: "服务端渲染",
            collapsible: true,
            collapsed: true,
            items: [
            ]
          },
        ],
      },
      {
        text: "后端笔记",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "express",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "express基础", link: "/backend/express/express00" },
            ],
          },
          {
            text: "Java",
            collapsible: true,
            collapsed: true,
            items: [{ text: "java基础", link: "/backend/java/java基础" }],
          },
          {
            text: "数据库",
            collapsible: true,
            collapsed: true,
            items: [
              { text: "mysql", link: "/backend/数据库/mysql" },
              { text: "redis", link: "/backend/数据库/redis" },
              { text: "mongodb", link: "/backend/数据库/mongodb" },
              { text: "oracle", link: "/backend/数据库/oracle" },
            ],
          },
          {
            text: "数据驱动和ORM",
            collapsible: true,
            collapsed: true,
            items: [{ text: "mysql驱动程序", link: "/backend/数据驱动/mysql驱动程序" }],
          }
        ],
      },
      {
        text: "AI",
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "规划与思考🤔",
            link: "/AI/规划与思考.md",
          },
          {
            text: "agent",
            link: "/AI/agent.md",
          },
          {
            text: "MCP",
            link: "/AI/MCP.md",
          },
          {
            text: "skill",
            link: "/AI/skill.md",
          }
        ],
      },
      // {
      //   text: "web3.0",
      //   collapsible: true,
      //   collapsed: true,
      //   items: [{ text: "web3.0", link: "/course/web3/web3.0" }],
      // },
      // {
      //   text: "PLC",
      //   collapsible: true,
      //   collapsed: true,
      //   items: [
      //     {
      //       text: "PLC",
      //       link: "/course/PLC/PLC",
      //     },
      //   ]
      // },
      // {
      //   text: "组件库",
      //   collapsible: true,
      //   collapsed: true,
      //   items: [
      //     {
      //       text: "小程序组件库",
      //       link: "/componentlib/小程序组件库",
      //     },
      //     { text: "pc组件", link: "/componentlib/pc组件" },
      //   ],
      // },
      {
        text: "插件",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "HBuilderX", link: "/plugin/HBuilderX/HBuilderX"},
          { text: "vite", link: "/plugin/vite/vite"},
          { text: "vue", link: "/plugin/vue/vue"},
        ]
      },
      {
        text: "碎片",
        collapsible: true,
        collapsed:true,
        items: [
          { text: "css", link: "/splinter/css/index" },
          // { text: "js", link: "/splinter/js/index" },
          { text: "vite", link: "/splinter/vite/index" },
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
    }
  }
});
