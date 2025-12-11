---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Vue Monorepo
  text: 企业级前端解决方案
  tagline: 基于 Vue 3 + TypeScript 的现代化 Monorepo 项目架构
  image:
    src: /logo.svg
    alt: Vue Monorepo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/Elias-cug/vue-monorepo

features:
  - icon: 🎨
    title: 主题系统
    details: 12 种预设主题，支持明暗模式切换，完整的 CSS 变量系统和设计 Token
    link: /theme/
    linkText: 了解更多

  - icon: 🧩
    title: UI 组件库
    details: 丰富的组件库，完全响应主题变化，提供优雅的视觉效果和交互体验
    link: /ui/
    linkText: 组件文档

  - icon: 📦
    title: Monorepo 架构
    details: 使用 pnpm workspace 管理，模块化设计，包之间依赖清晰，易于维护和扩展

  - icon: ⚡️
    title: 开发体验
    details: 基于 Vite 构建，支持热更新，TypeScript 类型安全，ESLint + Prettier 代码规范

  - icon: 🔧
    title: 基础设施
    details: 完善的路由系统、状态管理、请求封装、布局组件等企业级基础设施
    link: /base/
    linkText: 基础架构

  - icon: 🚀
    title: 生产就绪
    details: 包含请求重试、缓存管理、错误处理、安全模式等企业级功能
    link: /base/service
    linkText: Service 模块
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 可以在这里添加一些首页的特效或初始化逻辑
  console.log('Welcome to Vue Monorepo Documentation!')
})
</script>

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

.dark {
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #41d1ff 50%);
}
</style>
