export default {
    base: '/vitepress-docs/',
    title: 'fsl', //站点标题
    description: '公司项目总结',//mate标签description，多用于搜索引擎抓取摘要
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }], // 添加图标
    ],
    themeConfig: {
        siteTitle: "开博前端项目汇总",
        logo: "/logo.png",
        nav: [
          { text: "博客", link: "/articles/组件库环境搭建" }, // 内链
          { text: "需求", link: "/requiredoc/" },
          { text: "GuideTest", link: "/guide/test" },
          {
            text: "Drop Menu", // 下拉菜单
            items: [
              {
                items: [
                  { text: 'Item A', link: '/item-1' },
                  { text: 'Item B', link: '/item-2' },
                  { text: 'Item C', link: '/item-3' }
                ]
              },
              {
                items: [
                  { text: "Item B1", link: "/item-B1" },
                  { text: "Item B2", link: "/item-B2" },
                ],
              },
            ]
          },
          { text: "gitlab76", link: "http://192.168.20.76/dashboard/projects" }, // 外链
          { text: "gitlab145", link: "http://192.168.20.145/dashboard/projects" }, // 外链
        ],
        socialLinks: [
          { icon: "github", link: "https://gitee.com" },
          { icon: 'qq', link: '...' },
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
            collapsed:true,
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
                text: "雨燕2.0监控平台",
                link: "/projects/监控平台",
              },
              {
                text: "数据资产",
                link: "/projects/数据资产",
              },
              {
                text: "云能管理系统",
                link: "/projects/云能管理系统",
              },
              {
                text: "清陶H5",
                link: "/projects/清陶H5",
              },
              {
                text: "瑞易保小程序",
                link: "/projects/瑞易保小程序",
              },
            ],
          },
          {
            text: "组件库",
            collapsible: true,
            collapsed:true,
            items: [
              {
                text: "小程序组件库",
                link: "/componentlib/小程序组件库",
              },
              { text: "pc组件", link: "/componentlib/pc组件" },
            ],
          },
          {
            text: "开发中遇到的问题",
            collapsible: true,
            collapsed:true,
            items: [
              { text: "pc", link: "/issue/pc" },
              { text: "h5", link: "/issue/h5" }, {
                text: "小程序",
                link: "/issue/小程序",
              },
            ],
          },
          {
            text: "前端教程",
            collapsible: true,
            collapsed:true,
            items: [
              {
                text: "vue",
                link: "/course/vue",
              },
              {
                text: "react",
                link: "/course/react",
              },
              {
                text: "状态管理库",
                link: "/course/状态管理库",
              },
              {
                text: "构建工具",
                link: "/course/构建工具",
              },
              {
                text: "前端工程化",
                link: "/course/前端工程化",
              },
              {
                text: "前端安全",
                link: "/course/前端安全",
              },
              {
                text: "前端性能优化",
                link: "/course/前端性能优化",
              }
            ],
          },
        ],
      }
  }