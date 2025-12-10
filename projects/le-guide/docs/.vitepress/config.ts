import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue Monorepo 文档',
  description: '基于 Vue 3 + TypeScript 的企业级前端 Monorepo 项目文档',
  base: '/le-guide/',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '基础架构', link: '/base/' },
      { text: 'UI 组件', link: '/ui/' },
      { text: '主题系统', link: '/theme/' },
      { text: 'API 参考', link: '/api/' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            { text: '什么是 Vue Monorepo', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
            { text: '开发规范', link: '/guide/development-guide' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: 'Monorepo 架构', link: '/guide/monorepo' },
            { text: '包管理策略', link: '/guide/package-management' },
            { text: '构建配置', link: '/guide/build-config' },
            { text: '部署指南', link: '/guide/deployment' },
          ],
        },
      ],
      '/base/': [
        {
          text: '基础架构',
          items: [
            { text: '概览', link: '/base/' },
            { text: '路由系统', link: '/base/router' },
            { text: '状态管理', link: '/base/store' },
            { text: '请求封装', link: '/base/service' },
            { text: '布局系统', link: '/base/layout' },
            { text: '工具函数', link: '/base/utils' },
          ],
        },
        {
          text: 'Service 模块',
          items: [
            { text: '请求配置', link: '/base/service/config' },
            { text: '重试机制', link: '/base/service/retry' },
            { text: '缓存管理', link: '/base/service/cache' },
            { text: '请求管理器', link: '/base/service/manager' },
            { text: '安全模式', link: '/base/service/safe-mode' },
          ],
        },
      ],
      '/ui/': [
        {
          text: 'UI 组件',
          items: [
            { text: '概览', link: '/ui/' },
            { text: '安装使用', link: '/ui/installation' },
            { text: '主题定制', link: '/ui/theming' },
          ],
        },
        {
          text: '基础组件',
          items: [
            { text: 'LeCard 卡片', link: '/ui/components/card' },
            { text: 'LeContainer 容器', link: '/ui/components/container' },
            { text: 'LeSvgIcon 图标', link: '/ui/components/svg-icon' },
            { text: 'LeCodeViewer 代码查看器', link: '/ui/components/code-viewer' },
          ],
        },
      ],
      '/theme/': [
        {
          text: '主题系统',
          items: [
            { text: '概览', link: '/theme/' },
            { text: '快速开始', link: '/theme/getting-started' },
            { text: '主题配置', link: '/theme/configuration' },
            { text: 'CSS 变量', link: '/theme/css-variables' },
          ],
        },
        {
          text: '高级功能',
          items: [
            { text: '动态主题', link: '/theme/dynamic-theme' },
            { text: '主题编辑器', link: '/theme/theme-editor' },
            { text: '色阶系统', link: '/theme/color-palette' },
            { text: '设计 Token', link: '/theme/design-tokens' },
            { text: 'Naive UI 集成', link: '/theme/naive-integration' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: 'Base API', link: '/api/base' },
            { text: 'UI API', link: '/api/ui' },
            { text: 'Theme API', link: '/api/theme' },
            { text: 'Utils API', link: '/api/utils' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-repo/vue-monorepo' }],

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © ${new Date().getFullYear()} Vue Monorepo`,
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-repo/vue-monorepo/edit/main/projects/le-guide/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 大纲
    outline: {
      level: [2, 3],
      label: '页面导航',
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',

    // 外部链接图标
    externalLinkIcon: true,

    // 暗黑模式切换
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',

    // 语言切换
    langMenuLabel: '多语言',

    // 404 页面
    notFound: {
      title: '页面未找到',
      quote: '看起来我们进入了错误的链接',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
  },

  // 头部标签
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1f77f2' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  // Markdown 配置
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
  },

  // Vite 配置
  vite: {
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('../', import.meta.url)),
        },
        {
          find: '@lee/base',
          replacement: fileURLToPath(new URL('../../../../packages/base/src', import.meta.url)),
        },
        {
          find: '@lee/ui',
          replacement: fileURLToPath(new URL('../../../../packages/ui/src', import.meta.url)),
        },
        {
          find: '@lee/theme',
          replacement: fileURLToPath(new URL('../../../../packages/theme/src', import.meta.url)),
        },
        {
          find: '@lee/utils',
          replacement: fileURLToPath(new URL('../../../../packages/utils/src', import.meta.url)),
        },
      ],
    },
  },
});
