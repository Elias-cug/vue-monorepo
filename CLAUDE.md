# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 + TypeScript enterprise monorepo using pnpm workspace. Contains shared packages (`packages/`) and application projects (`projects/`).

## Commands

```bash
# Install dependencies (always use -w flag to install to root)
pnpm install -w

# Development
pnpm start:le-start    # Start le-start project
pnpm start:le-admin    # Start le-admin project
pnpm start:le-guide    # Start documentation (VitePress)

# Build
pnpm build:le-start
pnpm build:le-admin

# Code quality
pnpm lint              # ESLint fix
pnpm lint:check        # ESLint check only
pnpm format            # Prettier format
pnpm format:check      # Prettier check only
pnpm type-check        # TypeScript check (le-start)

# Run single project dev server directly
pnpm --filter <project-name> dev
```

## Architecture

### Packages (`packages/`)

- **@lee/base** - Core infrastructure: layouts (AdminLayout, BasicLayout, BlankLayout, HeaderLayout), routing, composables, stores, services
- **@lee/theme** - Theme system with 12 presets, light/dark modes, Naive UI integration, CSS variable generation
- **@lee/ui** - Component library with `Le` prefix (LeContainer, LeCard, LeCodeViewer, LeSvgIcon, LeTable, LeButton, LeFilter, LeDialog, LeLeftRightLayout, LeOperateGroup)
- **@lee/utils** - Utility functions

### Projects (`projects/`)

- **le-start** - Demo/starter application
- **le-admin** - Admin application
- **le-guide** - VitePress documentation

### Path Aliases (defined in `vite.config.base.ts`)

- `@` → `./src`
- `@base` → `./packages/base/src`
- `@ui` → `./packages/ui/src`
- `@theme` → `./packages/theme/src`

## 开发原则

- 始终以 Vue 最推荐的方式写代码，遵循 Vue 官方风格指南
- 使用「最小改动原则」修改代码
- 避免重复代码（DRY 原则）
- 优先使用现有库和工具，避免重复发明轮子
- 考虑代码的可维护性和扩展性

## 代码规范

### UI 组件 (`packages/ui/`)

- 组件名使用 `Le` 前缀（如 `LeCard`、`LeContainer`）
- CSS 类名使用 `le-` 前缀
- 样式使用单独文件，**不要使用 UnoCSS**
- 除样式外，尽可能按照 naive-ui 源码风格编写
- 支持单独引入和整体注册两种方式
- 每个组件更新后自动维护当前组件的 README.md
- 每个组件更新后自动维护 `projects/le-start` 项目

### 项目开发 (`projects/`)

- UI 组件使用优先级：1. `@lee/ui` 2. `naive-ui`
- 路由页面默认使用 `LeContainer` 包裹
- 使用 `LeCard` 而不是 `NCard`
- 页面组件尽可能使用 UnoCSS 的 `@apply`
- 注意支持暗黑模式

### 主题包 (`packages/theme/`)

- 设计遵循 Ant Design 设计规范：https://ant.design/docs/spec/colors-cn

```typescript
import { useTheme } from '@lee/theme';
const { theme, mode, setTheme, setMode } = useTheme();
setTheme('blue');  // blue, red, orange, green, purple, etc.
setMode('dark');   // light, dark
```

### 基础包 (`packages/base/`)

- 更新后自动维护根目录的 README.md

### SVG 图标

- 双层级管理：UI 公共图标 (`ui-*`) + 项目私有图标 (`custom-*`)
- 通过 `vite-plugin-svg-icons` 自动注册
- UI 图标路径：`packages/ui/src/assets/svg-icon/`
- 项目图标路径：`<project>/src/assets/svg-icon/`

## Tech Stack

- Vue 3.5, TypeScript, Vite 7, pnpm workspace
- Naive UI (component library), UnoCSS (atomic CSS), SCSS
- Vue Router 4, Pinia
- ESLint + Prettier + Stylelint
