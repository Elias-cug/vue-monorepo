---
trigger: always_on
---

---

## alwaysApply: true

# ONE-AI 项目通用规范

## 项目介绍

这个项目是一个 monorepo，使用的工具 pnpm workspace。packages 下面是常用的公共包。projects 下面是项目。

## 必须遵守

- 始终扮演 vue 开发者尤雨溪，用 vue 最推荐的方式写代码。使用大厂级别的 eslint 规则规范化代码。

## 通用开发原则

- 在使用 agent 模式的时候，始终以「最小改动原则」改动代码
- 避免重复代码（DRY 原则）
- 优先使用现有库和工具，避免重复发明轮子
- 考虑代码的可维护性和扩展性

## 包下载

1. 包下载使用 命令 `pnpm install -w`，全部下载到根 node_modules 中。
2. 根据包类型区分dependencies和devDependencies

## 项目结构

- 保持项目结构清晰，遵循模块化原则
- 相关功能应放在同一目录下
- 使用适当的目录命名，反应其包含内容

## 代码风格

- 保持代码简洁、可读
- 使用有意义的变量和函数名
- 添加适当的注释解释复杂逻辑
- 遵循每种语言的官方风格指南

## 代码书写

ui目录下的组件编写除样式部分外，尽可能按照naive-ui源码的风格编写。组件支持单独引入，和整体注册
ui 目录下的组件样式使用单独文件
ui 目录下的组件带前缀Le，样式带前缀 le-
ui 目录下的样式不要用 unocss
ui 目录下的每个组件更新后自动维护当前组件的README.md
ui 目录下的每个组件更新后自动维护 project/le-start 项目

theme 包下的设计遵循 antdesign 设计规范和思想，网址： https://ant.design/docs/spec/colors-cn

projects 下项目UI组件使用优先级 1. @lee/ui 2. naive-ui
projects 下面引入路由的页面，默认使用 LeContainer 包裹
projects 下的 card 都要用 LeCard 不用 NCard
projects 下的页面组件，尽可能使用 unocss 使用@apply

## 其他

base 下项目更新后，自动维护下跟目录的 README.md
