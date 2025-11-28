# LeCard 卡片组件

一个简洁美观的卡片容器组件。

## 特性

- 支持标题显示
- 支持自定义 padding
- 支持 header 右侧插槽
- 白色背景，带阴影和圆角
- hover 时阴影加深效果

## Props

| 属性    | 类型             | 默认值 | 说明                                                            |
| ------- | ---------------- | ------ | --------------------------------------------------------------- |
| title   | string           | -      | 卡片标题                                                        |
| padding | string \| number | '16px' | 内边距，可以是字符串（如 '20px'）或数字（如 20，会自动转为 px） |
| style   | CSSProperties    | -      | 自定义样式                                                      |
| class   | string           | -      | 自定义类名                                                      |

## 插槽

| 插槽名       | 说明                |
| ------------ | ------------------- |
| default      | 卡片内容            |
| header-extra | header 右侧额外内容 |

## 使用示例

### 基础使用

```vue
<template>
  <LeCard title="卡片标题">
    <div>卡片内容</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

### 无标题卡片

```vue
<template>
  <LeCard>
    <div>只有内容的卡片</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

### 使用 header-extra 插槽

```vue
<template>
  <LeCard title="用户列表">
    <template #header-extra>
      <button>添加</button>
    </template>
    <div>卡片内容</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

### 自定义 padding

```vue
<template>
  <!-- 使用字符串 -->
  <LeCard title="标题" padding="24px">
    <div>自定义 padding</div>
  </LeCard>

  <!-- 使用数字 -->
  <LeCard title="标题" :padding="32">
    <div>自定义 padding</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

### 自定义样式

```vue
<template>
  <LeCard title="自定义卡片" :style="{ backgroundColor: '#f0f0f0' }" class="custom-card">
    <div>自定义样式</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

## 样式变量

组件内部使用 CSS 变量来管理 padding：

- `--le-card-padding`: 内边距值

## 注意事项

1. 如果不传 `title` 且没有使用 `header-extra` 插槽，则不会显示 header 区域
2. `padding` 属性会同时应用到 header 和 content 区域
3. header 使用 flex 布局，title 在左，extra 在右
