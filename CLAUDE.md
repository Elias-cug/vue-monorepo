# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 + TypeScript and FastAPI enterprise monorepo. Frontend uses pnpm workspace. Backend uses uv workspace with services in `apps-backend/` and shared Python packages in `packages-backend/`.

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

# Backend dependencies
uv sync

# Backend development
uv run --package le-admin-server uvicorn le_admin_server.main:app --reload

# Backend quality
uv run pytest
uv run ruff check apps-backend packages-backend

# Backend database migrations
cd apps-backend/le-admin-server
uv run --package le-admin-server alembic revision --autogenerate -m "message"
uv run --package le-admin-server alembic upgrade head
```

## Architecture

### Packages (`packages-web/`)

- **@lee/base** - Core infrastructure: layouts (AdminLayout, BasicLayout, BlankLayout, HeaderLayout), routing, composables, stores, services
- **@lee/theme** - Theme system with 12 presets, light/dark modes, Naive UI integration, CSS variable generation
- **@lee/ui** - Component library with `Le` prefix (LeContainer, LeCard, LeCodeViewer, LeSvgIcon, LeTable, LeButton, LeFilter, LeDialog, LeLeftRightLayout, LeOperateGroup)
- **@lee/utils** - Utility functions

### Projects (`apps-web/`)

- **le-start** - Demo/starter application
- **le-admin** - Admin application
- **le-guide** - VitePress documentation

### Backend Services (`apps-backend/`)

- **le-admin-server** - FastAPI service for `apps-web/le-admin`

Each backend service uses the Python `src/<package_name>/` layout. Service roots keep operational files such as `pyproject.toml`, `alembic.ini`, `database/migrations/`, `contracts/`, and `tests/`.

### Backend Packages (`packages-backend/`)

- **lee-api-core** - FastAPI primitives: response schemas, exceptions, app factory, health route
- **lee-db** - SQLAlchemy async primitives: `Base`, mixins, engine/session factory
- **lee-auth** - Password hashing, JWT helpers, Bearer token parsing
- **lee-contracts** - Shared error codes and cross-service contract constants

### Path Aliases (defined in `vite.config.base.ts`)

- `@` → `./src`
- `@base` → `./packages-web/base/src`
- `@ui` → `./packages-web/ui/src`
- `@theme` → `./packages-web/theme/src`

## 开发原则

- **始终使用 pnpm，不要使用 npm 或 yarn**
- **后端始终使用 uv，不要使用 poetry、pipenv 或裸 pip 管理项目依赖**
- 始终以 Vue 最推荐的方式写代码，遵循 Vue 官方风格指南
- 使用「最小改动原则」修改代码
- 避免重复代码（DRY 原则）
- 优先使用现有库和工具，避免重复发明轮子
- 考虑代码的可维护性和扩展性

## 代码规范

### UI 组件 (`packages-web/ui/`)

- 组件名使用 `Le` 前缀（如 `LeCard`、`LeContainer`）
- CSS 类名使用 `le-` 前缀
- 样式使用单独文件，**不要使用 UnoCSS**
- 除样式外，尽可能按照 naive-ui 源码风格编写
- 支持单独引入和整体注册两种方式
- 每个组件更新后自动维护当前组件的 README.md
- 每个组件更新后自动维护 `apps-web/le-start` 项目

### 项目开发 (`apps-web/`)

- UI 组件使用优先级：1. `@lee/ui` 2. `naive-ui`
- 路由页面默认使用 `LeContainer` 包裹
- 使用 `LeCard` 而不是 `NCard`
- 页面组件尽可能使用 UnoCSS 的 `@apply`
- 注意支持暗黑模式

### 主题包 (`packages-web/theme/`)

- 设计遵循 Ant Design 设计规范：https://ant.design/docs/spec/colors-cn

```typescript
import { useTheme } from '@lee/theme';
const { theme, mode, setTheme, setMode } = useTheme();
setTheme('blue');  // blue, red, orange, green, purple, etc.
setMode('dark');   // light, dark
```

### 基础包 (`packages-web/base/`)

- 更新后自动维护根目录的 README.md

### 后端服务 (`apps-backend/*-server/`)

- 使用 FastAPI + SQLAlchemy 2.x async + PostgreSQL
- Python import 包名使用下划线，例如 `le-admin-server` 对应 `le_admin_server`
- API 层只做参数解析、依赖注入和响应组织
- 业务逻辑放在 service，数据库访问放在 repository
- repository 不主动提交事务，事务边界由 service 或 unit-of-work 控制
- Alembic 迁移脚本放在服务根目录的 `database/migrations/`
- 项目私有 OpenAPI 输出放在服务根目录的 `contracts/`
- 跨服务公共能力优先抽到 `packages-backend/`

### SVG 图标

- 双层级管理：UI 公共图标 (`ui-*`) + 项目私有图标 (`custom-*`)
- 通过 `vite-plugin-svg-icons` 自动注册
- UI 图标路径：`packages-web/ui/src/assets/svg-icon/`
- 项目图标路径：`<project>/src/assets/svg-icon/`

## Tech Stack

- Vue 3.5, TypeScript, Vite 7, pnpm workspace
- Naive UI (component library), UnoCSS (atomic CSS), SCSS
- Vue Router 4, Pinia
- ESLint + Prettier + Stylelint
- FastAPI, uv workspace, SQLAlchemy async, PostgreSQL, Alembic, pytest
