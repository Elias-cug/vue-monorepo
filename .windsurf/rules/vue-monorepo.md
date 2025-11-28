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

## 包下载

包下载使用 pnpm ，全部下载到根 node_modules 中。根据包类型区分dependencies和devDependencies
pnpm install -w

## 技术栈

- 开发语言：typescript scss
- js 框架 vue@3.5.24 vue-router4.6.3 和 状态管理工具 pinia
- 组件库：naive-ui
- 使用 unocss 书写布局样式，以 @apply 的形式插入
- 使用 lodash 作为工具库
- 使用 dayjs 作为时间处理工具库

## 项目结构

- 保持项目结构清晰，遵循模块化原则
- 相关功能应放在同一目录下
- 使用适当的目录命名，反应其包含内容

## 代码风格

- 保持代码简洁、可读
- 使用有意义的变量和函数名
- 添加适当的注释解释复杂逻辑
- 遵循每种语言的官方风格指南

## 通用开发原则

- 在使用 agent 模式的时候，始终以「最小改动原则」改动代码
- 避免重复代码（DRY 原则）
- 优先使用现有库和工具，避免重复发明轮子
- 考虑代码的可维护性和扩展性

## 代码书写

ui目录下的组件使用naive-ui源码的方式，支持单独引入，和整体注册

## 其他

- 所有新文件必须包含包级注释解释用途。
- 大型功能请在 `docs/` 或 `README` 中补充设计说明。
- 始终使用中文回复用户
