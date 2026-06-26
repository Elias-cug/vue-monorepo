# LeCard 卡片组件

## 概述

LeCard 是一个功能丰富的卡片组件，提供了多种主题变体和交互效果，完全响应主题系统变化。

## 基础用法

```vue
<template>
  <LeCard title="卡片标题">这是卡片内容</LeCard>
</template>

<script setup>
import { LeCard } from '@lee/ui';
</script>
```

## 组件属性

| 属性         | 类型                             | 默认值      | 说明         |
| ------------ | -------------------------------- | ----------- | ------------ |
| title        | `string`                         | -           | 卡片标题     |
| bordered     | `boolean`                        | `true`      | 是否显示边框 |
| hoverable    | `boolean`                        | `false`     | 是否可悬停   |
| segmented    | `boolean \| object`              | `false`     | 分段配置     |
| size         | `'small' \| 'medium' \| 'large'` | `'medium'`  | 卡片尺寸     |
| theme        | `string`                         | `'default'` | 主题变体     |
| selected     | `boolean`                        | `false`     | 是否选中状态 |
| borderless   | `boolean`                        | `false`     | 无边框样式   |
| contentStyle | `string \| object`               | -           | 内容区域样式 |
| headerStyle  | `string \| object`               | -           | 标题区域样式 |
| footerStyle  | `string \| object`               | -           | 底部区域样式 |

## 主题变体

### Default 默认

```vue
<LeCard title="默认卡片">
  标准样式，适配明暗模式
</LeCard>
```

### Primary 主题色

```vue
<LeCard theme="primary" title="主题色卡片">
  主题色边框，header 使用主题色淡背景
</LeCard>
```

### Gradient 渐变

```vue
<LeCard theme="gradient" title="渐变卡片">
  渐变背景效果
</LeCard>
```

### Borderless 无边框

```vue
<LeCard borderless title="无边框卡片">
  无边框透明背景
</LeCard>
```

### Float 浮动

```vue
<LeCard theme="float" title="浮动卡片">
  浮动效果，更强的阴影
</LeCard>
```

### Selected 选中

```vue
<LeCard selected title="选中状态">
  主题色边框和光晕效果
</LeCard>
```

## 插槽

| 插槽名       | 说明             |
| ------------ | ---------------- |
| default      | 卡片内容         |
| header       | 自定义标题区域   |
| header-extra | 标题右侧扩展区域 |
| footer       | 卡片底部区域     |
| cover        | 卡片封面         |

### 使用插槽示例

```vue
<template>
  <LeCard>
    <template #header>
      <div class="custom-header">
        <h3>自定义标题</h3>
      </div>
    </template>

    <template #header-extra>
      <n-button size="small">操作</n-button>
    </template>

    <template #default>卡片内容区域</template>

    <template #footer>
      <div class="card-footer">
        <n-button type="primary">确定</n-button>
        <n-button>取消</n-button>
      </div>
    </template>
  </LeCard>
</template>
```

## 嵌套卡片

```vue
<LeCard title="外层卡片">
  <LeCard title="内层卡片" size="small" borderless>
    嵌套卡片内容
  </LeCard>
</LeCard>
```

## 加载状态

```vue
<LeCard title="加载中" :loading="true">
  内容加载中...
</LeCard>
```

## 响应式布局

```vue
<template>
  <n-grid :cols="3" :x-gap="12" :y-gap="12">
    <n-grid-item>
      <LeCard title="卡片 1">内容 1</LeCard>
    </n-grid-item>
    <n-grid-item>
      <LeCard title="卡片 2">内容 2</LeCard>
    </n-grid-item>
    <n-grid-item>
      <LeCard title="卡片 3">内容 3</LeCard>
    </n-grid-item>
  </n-grid>
</template>
```

## 主题响应

LeCard 组件完全响应主题系统：

### CSS 变量

- `--le-card` - 卡片背景色
- `--le-text-1` - 标题文字色
- `--le-text-2` - 内容文字色
- `--le-border` - 边框颜色
- `--le-divider` - 分割线颜色
- `--le-shadow-1` - 默认阴影
- `--le-shadow-2` - hover 阴影
- `--le-primary` - 主题色
- `--le-primary-1` - 主题色淡背景
- `--le-primary-3` - 主题色边框

### 自定义样式

```scss
.le-card {
  // 基础样式
  background-color: var(--le-card);
  border-radius: var(--le-radius-lg);
  box-shadow: var(--le-shadow-1);

  // hover 效果
  &--hoverable:hover {
    box-shadow: var(--le-shadow-2);
    transform: translateY(-2px);
  }

  // 主题色变体
  &--primary {
    border-color: var(--le-primary-3);
    .le-card__header {
      background-color: var(--le-primary-1);
    }
  }

  // 选中状态
  &--selected {
    border-color: var(--le-primary);
    box-shadow: 0 0 0 2px var(--le-primary-1);
  }
}
```

## 最佳实践

1. **合理使用主题变体** - 根据内容重要性选择合适的主题
2. **保持一致性** - 同一页面的卡片风格应保持一致
3. **注意层次** - 嵌套卡片应使用不同的样式区分
4. **响应式考虑** - 配合 Grid 组件实现响应式布局
5. **性能优化** - 大量卡片时考虑使用虚拟滚动

## 示例代码

```vue
<template>
  <div class="card-demo">
    <!-- 文章卡片 -->
    <LeCard hoverable>
      <template #cover>
        <img src="cover.jpg" alt="封面" />
      </template>
      <template #header>
        <div class="article-title">Vue 3 最佳实践</div>
      </template>
      <template #header-extra>
        <n-tag type="success">精选</n-tag>
      </template>
      <div class="article-content">文章摘要内容...</div>
      <template #footer>
        <div class="article-meta">
          <span>作者：张三</span>
          <span>2024-01-01</span>
        </div>
      </template>
    </LeCard>

    <!-- 数据卡片 -->
    <LeCard theme="primary" title="数据统计">
      <n-statistic label="总用户数" value="168,229">
        <template #prefix>
          <n-icon>
            <UserOutlined />
          </n-icon>
        </template>
      </n-statistic>
    </LeCard>

    <!-- 操作卡片 -->
    <LeCard borderless>
      <n-space vertical>
        <n-button type="primary" block>创建项目</n-button>
        <n-button block>导入项目</n-button>
        <n-button block>查看文档</n-button>
      </n-space>
    </LeCard>
  </div>
</template>
```

## API 类型定义

```typescript
export interface CardProps {
  /** 卡片标题 */
  title?: string;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否可悬停 */
  hoverable?: boolean;
  /** 卡片尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 主题变体 */
  theme?: 'default' | 'primary' | 'gradient' | 'borderless' | 'float' | 'selected';
  /** 是否选中 */
  selected?: boolean;
  /** 是否无边框 */
  borderless?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 内容样式 */
  contentStyle?: string | CSSProperties;
  /** 标题样式 */
  headerStyle?: string | CSSProperties;
  /** 底部样式 */
  footerStyle?: string | CSSProperties;
}
```

## 相关组件

- [LeContainer](/ui/components/container) - 容器组件
- [NCard](https://www.naiveui.com/zh-CN/os-theme/components/card) - Naive UI 原生卡片
