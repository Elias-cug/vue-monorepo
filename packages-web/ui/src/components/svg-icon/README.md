# SvgIcon 图标组件

基于 SVG Sprite 技术的图标组件，支持自定义颜色、大小、动画等。

## 特性

- 🎨 **主题响应** - 自动适配主题颜色
- 📦 **按需加载** - 只打包使用到的图标
- 🎯 **类型提示** - TypeScript 支持
- 🔄 **动画效果** - 内置旋转、脉冲动画
- 🎭 **灵活样式** - 支持自定义颜色、大小

## 基础用法

```vue
<template>
  <LeSvgIcon name="home" />
  <LeSvgIcon name="user" size="24" />
  <LeSvgIcon name="settings" color="#1890ff" />
</template>
```

## API

### Props

| 属性      | 说明       | 类型               | 默认值         |
| --------- | ---------- | ------------------ | -------------- |
| name      | 图标名称   | `string`           | -              |
| size      | 图标大小   | `number \| string` | `1em`          |
| color     | 图标颜色   | `string`           | `currentColor` |
| className | 自定义类名 | `string`           | `''`           |
| spin      | 是否旋转   | `boolean`          | `false`        |
| rotate    | 旋转角度   | `number`           | `0`            |

## 添加新图标

1. 将 SVG 文件放入 `packages-web/ui/src/assets/svg-icon/` 目录
2. SVG 文件要求：
   - 移除固定的 `fill` 和 `stroke` 颜色
   - 使用 `currentColor` 或留空让组件控制颜色
   - viewBox 属性必须存在

示例 SVG：

```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="currentColor" stroke-width="2"/>
</svg>
```

## 预设图标

- `home` - 首页
- `user` - 用户
- `settings` - 设置
- `search` - 搜索
- `close` - 关闭
- `menu` - 菜单

## 工具函数

```typescript
import { getAllSvgIconNames, hasSvgIcon } from '@lee/ui';

// 获取所有可用图标
const icons = getAllSvgIconNames();

// 检查图标是否存在
const exists = hasSvgIcon('home');
```

## 示例

### 大小变体

```vue
<LeSvgIcon name="home" size="12" />
<!-- 12px -->
<LeSvgIcon name="home" size="2em" />
<!-- 2em -->
<LeSvgIcon name="home" />
<!-- 1em（默认） -->
```

### 颜色控制

```vue
<LeSvgIcon name="home" color="var(--le-primary)" />
<LeSvgIcon name="home" color="#52c41a" />
<LeSvgIcon name="home" />
<!-- 继承父元素颜色 -->
```

### 动画效果

```vue
<LeSvgIcon name="settings" :spin="true" />
<!-- 旋转动画 -->
<LeSvgIcon name="settings" :rotate="45" />
<!-- 静态旋转45度 -->
```

### 响应式主题

```vue
<style>
.icon-primary {
  color: var(--le-primary);
}

.icon-hover:hover {
  color: var(--le-primary-hover);
  transform: scale(1.2);
}
</style>

<template>
  <LeSvgIcon name="home" class-name="icon-primary icon-hover" />
</template>
```
