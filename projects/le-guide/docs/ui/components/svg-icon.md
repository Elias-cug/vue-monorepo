# LeSvgIcon SVG 图标组件

## 概述

LeSvgIcon 是一个高性能的 SVG 图标组件，采用 SVG Sprite 技术，支持双层级图标管理（UI 级别和项目级别），完全响应主题变化。

## 核心特性

- 🚀 **SVG Sprite 技术** - 所有图标合并为一个 sprite，性能优异
- 🎨 **主题响应** - 通过 currentColor 自动适配主题色
- 📦 **双层级管理** - UI 库图标和项目图标分离管理
- 🔧 **灵活配置** - 支持大小、颜色、旋转、动画等
- 📝 **类型安全** - TypeScript 完整支持
- ⚡ **按需加载** - 自动 tree-shaking，只打包使用的图标

## 基础用法

```vue
<template>
  <!-- UI 级别图标（默认） -->
  <LeSvgIcon name="home" />

  <!-- 项目级别图标 -->
  <LeSvgIcon name="download" scope="local" />

  <!-- 自定义大小 -->
  <LeSvgIcon name="user" :size="24" />

  <!-- 自定义颜色 -->
  <LeSvgIcon name="settings" color="var(--le-primary)" />
</template>

<script setup>
import { LeSvgIcon } from '@lee/ui';
</script>
```

## 组件属性

| 属性   | 类型                                   | 默认值           | 说明             |
| ------ | -------------------------------------- | ---------------- | ---------------- |
| name   | `string`                               | -                | 图标名称（必需） |
| scope  | `'ui' \| 'local'`                      | `'ui'`           | 图标作用域       |
| size   | `string \| number`                     | `16`             | 图标大小         |
| color  | `string`                               | `'currentColor'` | 图标颜色         |
| spin   | `boolean`                              | `false`          | 是否旋转         |
| rotate | `number`                               | -                | 旋转角度         |
| flip   | `'horizontal' \| 'vertical' \| 'both'` | -                | 翻转方向         |

## 图标层级系统

### UI 级别图标

位置：`packages/ui/src/assets/svg-icon/`

```vue
<!-- 使用 UI 图标 -->
<LeSvgIcon name="home" />
<LeSvgIcon name="user" />
<LeSvgIcon name="settings" />
```

### 项目级别图标

位置：`projects/[project-name]/src/assets/svg-icon/`

```vue
<!-- 使用项目图标 -->
<LeSvgIcon name="custom-icon" scope="local" />
<LeSvgIcon name="business-icon" scope="local" />
```

## 添加新图标

### 1. 添加 UI 级别图标

将 SVG 文件放入 `packages/ui/src/assets/svg-icon/` 目录：

```svg
<!-- home.svg -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
</svg>
```

### 2. 添加项目级别图标

将 SVG 文件放入 `projects/[project-name]/src/assets/svg-icon/` 目录。

### 3. SVG 文件要求

- 必须有 `viewBox` 属性
- 使用 `currentColor` 作为填充色
- 移除固定的宽高属性
- 简化路径，减少文件大小

## 图标大小

### 使用数字

```vue
<LeSvgIcon name="home" :size="16" />
<!-- 16px -->
<LeSvgIcon name="home" :size="24" />
<!-- 24px -->
<LeSvgIcon name="home" :size="32" />
<!-- 32px -->
```

### 使用字符串

```vue
<LeSvgIcon name="home" size="1em" />
<!-- 相对字体大小 -->
<LeSvgIcon name="home" size="2rem" />
<!-- 相对根字体大小 -->
<LeSvgIcon name="home" size="100%" />
<!-- 相对父元素 -->
```

### 预设大小

```vue
<template>
  <div class="icon-sizes">
    <LeSvgIcon name="home" class="icon-xs" />
    <!-- 12px -->
    <LeSvgIcon name="home" class="icon-sm" />
    <!-- 14px -->
    <LeSvgIcon name="home" class="icon-md" />
    <!-- 16px -->
    <LeSvgIcon name="home" class="icon-lg" />
    <!-- 20px -->
    <LeSvgIcon name="home" class="icon-xl" />
    <!-- 24px -->
  </div>
</template>

<style>
.icon-xs {
  font-size: 12px;
}
.icon-sm {
  font-size: 14px;
}
.icon-md {
  font-size: 16px;
}
.icon-lg {
  font-size: 20px;
}
.icon-xl {
  font-size: 24px;
}
</style>
```

## 图标颜色

### 主题色

```vue
<!-- 使用 CSS 变量 -->
<LeSvgIcon name="home" color="var(--le-primary)" />
<LeSvgIcon name="user" color="var(--le-success)" />
<LeSvgIcon name="alert" color="var(--le-warning)" />
<LeSvgIcon name="close" color="var(--le-error)" />
```

### 继承颜色

```vue
<!-- 默认继承父元素颜色 -->
<div style="color: #1890ff">
  <LeSvgIcon name="home" />  <!-- 蓝色 -->
</div>

<n-button type="primary">
  <LeSvgIcon name="plus" />  <!-- 按钮文字色 -->
  添加
</n-button>
```

### 渐变色

```vue
<template>
  <LeSvgIcon
    name="star"
    :style="{
      fill: 'url(#gradient-1)',
    }"
  />

  <svg width="0" height="0">
    <defs>
      <linearGradient id="gradient-1">
        <stop offset="0%" stop-color="var(--le-primary)" />
        <stop offset="100%" stop-color="var(--le-primary-3)" />
      </linearGradient>
    </defs>
  </svg>
</template>
```

## 动画效果

### 旋转动画

```vue
<!-- 持续旋转 -->
<LeSvgIcon name="loading" spin />

<!-- 自定义旋转速度 -->
<LeSvgIcon name="refresh" spin :style="{ animationDuration: '2s' }" />
```

### 旋转角度

```vue
<LeSvgIcon name="arrow" :rotate="90" />
<!-- 顺时针90度 -->
<LeSvgIcon name="arrow" :rotate="180" />
<!-- 顺时针180度 -->
<LeSvgIcon name="arrow" :rotate="-90" />
<!-- 逆时针90度 -->
```

### 翻转

```vue
<LeSvgIcon name="arrow" flip="horizontal" />
<!-- 水平翻转 -->
<LeSvgIcon name="arrow" flip="vertical" />
<!-- 垂直翻转 -->
<LeSvgIcon name="arrow" flip="both" />
<!-- 双向翻转 -->
```

### 自定义动画

```vue
<template>
  <LeSvgIcon name="heart" class="pulse-icon" />
</template>

<style>
.pulse-icon {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

## 工具函数

```typescript
import { getUiSvgIcons, getLocalSvgIcons, getAllSvgIcons, hasSvgIcon } from '@lee/ui';

// 获取所有 UI 级别图标
const uiIcons = getUiSvgIcons();
console.log(uiIcons); // ['home', 'user', 'settings', ...]

// 获取所有项目级别图标
const localIcons = getLocalSvgIcons();
console.log(localIcons); // ['download', 'upload', ...]

// 获取所有图标
const allIcons = getAllSvgIcons();

// 检查图标是否存在
if (hasSvgIcon('home', 'ui')) {
  // 图标存在
}
```

## Vite 配置

### 基础配置

```typescript
// vite.config.ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default {
  plugins: [
    // UI 级别图标
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'packages/ui/src/assets/svg-icon')],
      symbolId: 'le-ui-[name]',
      customDomId: '__svg__icons__ui__',
    }),

    // 项目级别图标
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'projects/*/src/assets/svg-icon')],
      symbolId: 'le-local-[name]',
      customDomId: '__svg__icons__local__',
    }),
  ],
};
```

### 注册图标

```typescript
// main.ts
import 'virtual:svg-icons-register';
```

## 实际应用案例

### 导航菜单

```vue
<template>
  <n-menu :options="menuOptions" />
</template>

<script setup>
const menuOptions = [
  {
    label: '首页',
    key: 'home',
    icon: () => h(LeSvgIcon, { name: 'home' }),
  },
  {
    label: '用户',
    key: 'user',
    icon: () => h(LeSvgIcon, { name: 'user' }),
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h(LeSvgIcon, { name: 'settings' }),
  },
];
</script>
```

### 按钮图标

```vue
<template>
  <n-space>
    <n-button type="primary">
      <template #icon>
        <LeSvgIcon name="plus" />
      </template>
      新增
    </n-button>

    <n-button type="error">
      <template #icon>
        <LeSvgIcon name="delete" />
      </template>
      删除
    </n-button>
  </n-space>
</template>
```

### 状态指示

```vue
<template>
  <div class="status-list">
    <div class="status-item">
      <LeSvgIcon name="check-circle" color="var(--le-success)" />
      <span>成功</span>
    </div>

    <div class="status-item">
      <LeSvgIcon name="warning" color="var(--le-warning)" />
      <span>警告</span>
    </div>

    <div class="status-item">
      <LeSvgIcon name="close-circle" color="var(--le-error)" />
      <span>错误</span>
    </div>
  </div>
</template>
```

## 故障排查

### 图标不显示

1. **检查文件路径**
   - UI 图标：`packages/ui/src/assets/svg-icon/`
   - 项目图标：`projects/[name]/src/assets/svg-icon/`

2. **重启开发服务器**
   - Vite 插件在启动时扫描图标
   - 添加新图标后必须重启

3. **检查 scope 属性**
   - UI 图标：不需要 scope 或 `scope="ui"`
   - 项目图标：必须 `scope="local"`

4. **检查 SVG 格式**
   - 必须有 `viewBox` 属性
   - 使用 `currentColor` 作为颜色

5. **检查虚拟模块导入**
   ```typescript
   // main.ts
   import 'virtual:svg-icons-register';
   ```

### 调试工具

浏览器控制台检查 sprite：

```javascript
// 检查 UI 图标容器
document.getElementById('__svg__icons__ui__');

// 检查项目图标容器
document.getElementById('__svg__icons__local__');

// 查看所有已加载的图标
[...document.querySelectorAll('symbol')].map(s => s.id);
```

## 性能优化

### 1. 图标精简

- 使用 SVGO 优化 SVG 文件
- 移除不必要的属性和元数据
- 简化路径数据

### 2. 按需加载

- 只导入使用的图标
- 使用动态导入延迟加载

### 3. 缓存策略

- SVG sprite 会被浏览器缓存
- 配置合适的缓存头

## API 类型定义

```typescript
export interface SvgIconProps {
  /** 图标名称 */
  name: string;
  /** 图标作用域 */
  scope?: 'ui' | 'local';
  /** 图标大小 */
  size?: string | number;
  /** 图标颜色 */
  color?: string;
  /** 是否旋转 */
  spin?: boolean;
  /** 旋转角度 */
  rotate?: number;
  /** 翻转方向 */
  flip?: 'horizontal' | 'vertical' | 'both';
}

export interface SvgIconUtils {
  /** 获取 UI 级别图标列表 */
  getUiSvgIcons(): string[];
  /** 获取项目级别图标列表 */
  getLocalSvgIcons(): string[];
  /** 获取所有图标列表 */
  getAllSvgIcons(): string[];
  /** 检查图标是否存在 */
  hasSvgIcon(name: string, scope?: 'ui' | 'local'): boolean;
}
```

## 相关资源

- [SVG Sprite 技术原理](https://css-tricks.com/svg-sprites-use-better-icon-fonts/)
- [SVGO 优化工具](https://github.com/svg/svgo)
- [Vite SVG 插件](https://github.com/vbenjs/vite-plugin-svg-icons)
