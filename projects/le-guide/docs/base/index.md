# Base 基础架构

Vue Monorepo 提供了一套完整的企业级基础架构，涵盖了现代前端应用开发的各个方面。

## 核心模块

### [布局系统](/base/layout)

灵活的布局组件，支持多种布局模式：

- **GlobalHeader** - 全局顶部导航
- **GlobalSider** - 侧边栏菜单
- **GlobalTabs** - 多标签页管理
- 支持响应式布局和主题切换

### [路由系统](/base/router)

强大的路由管理能力：

- 动态路由和权限控制
- 完整的导航守卫
- 路由 Hook 和生命周期
- 路由缓存和预加载

### [状态管理](/base/state)

基于 Pinia 的状态管理方案：

- 模块化 Store 设计
- 状态持久化
- Store 间通信
- DevTools 集成

### [Service 模块](/base/service)

企业级的请求封装：

- 请求/响应拦截
- 自动重试机制
- 请求缓存
- 安全模式
- 请求优先级管理

### [持久化存储](/base/storage)

增强的本地存储方案：

- 支持加密存储
- 过期时间管理
- 命名空间隔离
- 响应式存储
- 容量监控

### [内置页面](/base/builtin-pages)

开箱即用的系统页面：

- 登录页面
- 错误页面（403、404、500）
- 结果页面
- 维护页面

## 架构特点

### 模块化设计

```typescript
// 每个模块独立维护
packages/
  base/          # 基础架构
    layout/      # 布局系统
    router/      # 路由系统
    service/     # 请求模块
    store/       # 状态管理
    storage/     # 存储方案
```

### 类型安全

所有模块都提供完整的 TypeScript 类型定义：

```typescript
import type { RouteConfig, ServiceConfig, StorageOptions } from '@lee/base';
```

### 插件化扩展

支持通过插件扩展功能：

```typescript
// 注册插件
app.use(BasePlugin, {
  router: routerConfig,
  service: serviceConfig,
  storage: storageConfig,
});
```

## 最佳实践

### 1. 按需引入

只引入需要的模块，减少打包体积：

```typescript
// ✅ 好的做法
import { createService } from '@lee/base/service';

// ❌ 避免
import * as Base from '@lee/base';
```

### 2. 统一配置

将配置集中管理：

```typescript
// config/base.config.ts
export const baseConfig = {
  router: {
    mode: 'hash',
    strict: true,
  },
  service: {
    timeout: 10000,
    retry: 3,
  },
  storage: {
    prefix: 'app_',
    encrypt: true,
  },
};
```

### 3. 错误处理

统一的错误处理机制：

```typescript
// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  // 上报错误
  reportError(err, info);
};
```

## 开发指南

### 环境要求

- Node.js >= 16
- pnpm >= 8
- Vue >= 3.3

### 安装使用

```bash
# 安装依赖
pnpm install

# 引入基础架构
import { setupBase } from '@lee/base';

// 初始化
const base = await setupBase(app, {
  // 配置项
});
```

## 迁移指南

从其他框架迁移到 Vue Monorepo：

1. **评估现有架构** - 分析当前项目结构
2. **模块映射** - 确定模块对应关系
3. **逐步迁移** - 按模块分步迁移
4. **测试验证** - 确保功能正常

## 相关资源

- [快速开始](/guide/getting-started) - 项目快速上手
- [主题系统](/theme/) - 主题配置
- [UI 组件](/ui/) - 组件库
- [工具函数](/utils/) - 工具函数库
