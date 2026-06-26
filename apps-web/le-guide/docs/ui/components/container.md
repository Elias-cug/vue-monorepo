# LeContainer 容器组件

## 概述

LeContainer 是一个功能完善的容器组件，内置滚动条、内边距管理和多种主题变体，为页面内容提供统一的布局容器。

## 核心特性

- 📦 **内置滚动条** - 集成 NScrollbar，提供优雅的滚动体验
- 🎨 **主题变体** - 多种预设样式，完全响应主题切换
- 📏 **灵活布局** - 支持自定义内边距和高度
- 🚀 **性能优化** - 虚拟滚动支持，处理大量内容
- ♿ **无障碍** - 完整的键盘导航和屏幕阅读器支持

## 基础用法

```vue
<template>
  <LeContainer>
    <h1>页面标题</h1>
    <p>页面内容...</p>
  </LeContainer>
</template>

<script setup>
import { LeContainer } from '@lee/ui';
</script>
```

## 组件属性

| 属性           | 类型               | 默认值      | 说明              |
| -------------- | ------------------ | ----------- | ----------------- |
| padding        | `string \| number` | `'16px'`    | 内边距            |
| height         | `string`           | `'100%'`    | 容器高度          |
| theme          | `string`           | `'default'` | 主题变体          |
| bordered       | `boolean`          | `false`     | 带边框样式        |
| accent         | `boolean`          | `false`     | 顶部装饰线        |
| scrollbar      | `boolean`          | `true`      | 是否显示滚动条    |
| scrollbarProps | `object`           | -           | NScrollbar 的属性 |
| contentStyle   | `string \| object` | -           | 内容区域样式      |
| xScrollable    | `boolean`          | `false`     | 是否横向滚动      |

## 主题变体

### Default 默认

```vue
<LeContainer>
  默认样式，使用 neutral-body 背景
</LeContainer>
```

### Bordered 边框

```vue
<LeContainer bordered>
  带边框样式，hover 时显示主题色
</LeContainer>
```

### Accent 装饰

```vue
<LeContainer accent>
  顶部渐变装饰线
</LeContainer>
```

### Primary 主题色

```vue
<LeContainer theme="primary">
  主题色浅色背景
</LeContainer>
```

### Card 卡片

```vue
<LeContainer theme="card">
  卡片样式，圆角+阴影
</LeContainer>
```

### Gradient 渐变

```vue
<LeContainer theme="gradient">
  主题色渐变背景
</LeContainer>
```

## 内边距控制

```vue
<!-- 数字值 -->
<LeContainer :padding="24">
  内容
</LeContainer>

<!-- 字符串值 -->
<LeContainer padding="32px">
  内容
</LeContainer>

<!-- 不同方向 -->
<LeContainer padding="24px 16px">
  内容
</LeContainer>

<!-- 无内边距 -->
<LeContainer :padding="0">
  内容
</LeContainer>
```

## 高度控制

```vue
<!-- 固定高度 -->
<LeContainer height="500px">
  内容超过高度时自动滚动
</LeContainer>

<!-- 视口高度 -->
<LeContainer height="100vh">
  全屏高度容器
</LeContainer>

<!-- 自适应高度 -->
<LeContainer height="auto">
  根据内容自动调整高度
</LeContainer>
```

## 滚动条配置

```vue
<template>
  <LeContainer
    :scrollbar-props="{
      trigger: 'hover',
      xScrollable: true,
      contentStyle: 'padding-right: 20px',
    }"
  >
    内容区域
  </LeContainer>
</template>
```

### 隐藏滚动条

```vue
<LeContainer :scrollbar="false">
  不显示滚动条，但内容仍可滚动
</LeContainer>
```

## 嵌套使用

```vue
<template>
  <LeContainer theme="card" padding="24px">
    <h1>外层容器</h1>

    <LeContainer bordered height="300px" padding="16px">
      <h2>内层容器</h2>
      <p v-for="i in 20" :key="i">内层容器内容 {{ i }}</p>
    </LeContainer>
  </LeContainer>
</template>
```

## 布局示例

### 页面布局

```vue
<template>
  <div class="page-layout">
    <LeContainer padding="24px">
      <n-breadcrumb>
        <n-breadcrumb-item>首页</n-breadcrumb-item>
        <n-breadcrumb-item>用户管理</n-breadcrumb-item>
      </n-breadcrumb>

      <h1 class="page-title">用户列表</h1>

      <LeCard>
        <!-- 页面内容 -->
      </LeCard>
    </LeContainer>
  </div>
</template>
```

### 侧边栏布局

```vue
<template>
  <div class="sidebar-layout">
    <LeContainer theme="bordered" height="calc(100vh - 60px)" padding="0">
      <n-menu :options="menuOptions" />
    </LeContainer>
  </div>
</template>
```

### 内容区域

```vue
<template>
  <LeContainer theme="gradient" padding="32px">
    <n-grid :cols="3" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="i in 9" :key="i">
        <LeCard :title="`卡片 ${i}`">卡片内容</LeCard>
      </n-grid-item>
    </n-grid>
  </LeContainer>
</template>
```

## 主题响应

### CSS 变量

```scss
.le-container {
  // 背景色
  background-color: var(--le-neutral-body);

  // 边框样式
  &--bordered {
    border: 1px solid var(--le-border);
    &:hover {
      border-color: var(--le-primary-3);
    }
  }

  // 装饰线
  &--accent::before {
    background: linear-gradient(
      90deg,
      var(--le-primary-3) 0%,
      var(--le-primary) 50%,
      var(--le-primary-3) 100%
    );
  }

  // 主题色背景
  &--primary {
    background-color: var(--le-primary-1);
  }

  // 卡片样式
  &--card {
    background-color: var(--le-card);
    border-radius: var(--le-radius-lg);
    box-shadow: var(--le-shadow-1);
  }

  // 渐变背景
  &--gradient {
    background: linear-gradient(135deg, var(--le-primary-1) 0%, var(--le-card) 100%);
  }
}
```

## 性能优化

### 虚拟滚动

处理大量数据时使用虚拟滚动：

```vue
<template>
  <LeContainer height="500px">
    <n-virtual-list :items="items" :item-size="50" :height="500">
      <template #default="{ item }">
        <div class="list-item">{{ item }}</div>
      </template>
    </n-virtual-list>
  </LeContainer>
</template>
```

### 懒加载内容

```vue
<template>
  <LeContainer>
    <n-lazy-container @load="loadMore" :loading="loading">
      <div v-for="item in items" :key="item.id">
        {{ item.content }}
      </div>
    </n-lazy-container>
  </LeContainer>
</template>
```

## 最佳实践

### ✅ 推荐用法

1. **使用 props 而非样式覆盖**

```vue
<!-- 好 -->
<LeContainer padding="24px"></LeContainer>
```

2. **合理选择主题变体**

```vue
<!-- 页面主容器 -->
<LeContainer></LeContainer>
```

3. **避免多层嵌套滚动**

```vue
<!-- 好：只有一层滚动 -->
<LeContainer height="100vh">
  <LeCard v-for="item in items">
    {{ item }}
  </LeCard>
</LeContainer>

<!-- 避免：多层滚动 -->
<LeContainer height="100vh">
  <LeContainer height="500px">
    <!-- 内容 -->
  </LeContainer>
</LeContainer>
```

### ❌ 避免的用法

1. **不要重复设置内边距**

```vue
<!-- 错误 -->
<LeContainer padding="16px">
  <div style="padding: 16px"> <!-- 重复的内边距 -->
</LeContainer>
```

2. **不要覆盖内置滚动条**

```vue
<!-- 错误 -->
<LeContainer style="overflow-y: auto"> <!-- 已内置滚动 -->
</LeContainer>
```

## API 类型定义

```typescript
export interface ContainerProps {
  /** 内边距 */
  padding?: string | number;
  /** 容器高度 */
  height?: string;
  /** 主题变体 */
  theme?: 'default' | 'bordered' | 'accent' | 'primary' | 'card' | 'gradient';
  /** 是否带边框 */
  bordered?: boolean;
  /** 是否显示装饰线 */
  accent?: boolean;
  /** 是否显示滚动条 */
  scrollbar?: boolean;
  /** 滚动条属性 */
  scrollbarProps?: ScrollbarProps;
  /** 内容样式 */
  contentStyle?: string | CSSProperties;
  /** 是否横向滚动 */
  xScrollable?: boolean;
}

export interface ContainerSlots {
  /** 默认插槽 */
  default: () => VNode[];
}
```

## 常见问题

### Q: 为什么内容没有滚动条？

A: 确保容器有明确的高度限制，如 `height="500px"` 或 `height="100vh"`。

### Q: 如何去掉默认内边距？

A: 设置 `:padding="0"` 或 `padding="0"`。

### Q: 如何实现横向滚动？

A: 设置 `:x-scrollable="true"` 并确保内容宽度超过容器。

### Q: 主题变体之间有什么区别？

A:

- `default`: 标准背景
- `bordered`: 带边框，适合分区
- `accent`: 顶部装饰，突出重要区域
- `primary`: 主题色背景，强调内容
- `card`: 卡片风格，独立模块
- `gradient`: 渐变背景，视觉焦点

## 相关组件

- [LeCard](/ui/components/card) - 卡片组件
- [NScrollbar](https://www.naiveui.com/zh-CN/os-theme/components/scrollbar) - Naive UI 滚动条
- [NGrid](https://www.naiveui.com/zh-CN/os-theme/components/grid) - Naive UI 栅格布局
