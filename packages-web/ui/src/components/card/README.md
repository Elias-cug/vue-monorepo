# LeCard 卡片组件

一个简洁美观的卡片容器组件，集成主题系统，提供多种主题变体。

## 特性

- 支持标题显示
- 支持自定义 padding
- 支持 header 右侧插槽
- 支持折叠/展开功能
- 集成主题系统，多种主题变体
- hover 时阴影加深效果
- 支持暗色模式自动适配
- 响应主题切换

## Props

| 属性             | 类型             | 默认值    | 说明                                                                                    |
| ---------------- | ---------------- | --------- | --------------------------------------------------------------------------------------- |
| title            | string           | -         | 卡片标题                                                                                |
| padding          | string \| number | '16px'    | 内边距，可以是字符串（如 '20px'）或数字（如 20，会自动转为 px）                         |
| style            | CSSProperties    | -         | 自定义样式                                                                              |
| class            | string           | -         | 自定义类名                                                                              |
| collapsible      | boolean          | false     | 是否可折叠                                                                              |
| defaultCollapsed | boolean          | false     | 默认是否折叠                                                                            |
| theme            | string           | 'default' | 主题变体：'default' \| 'primary' \| 'gradient' \| 'borderless' \| 'float' \| 'selected' |
| selected         | boolean          | false     | 是否选中（简写属性）                                                                    |
| borderless       | boolean          | false     | 是否无边框（简写属性）                                                                  |

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

### 可折叠卡片

```vue
<template>
  <!-- 基础折叠 -->
  <LeCard title="可折叠卡片" collapsible>
    <div>点击标题栏可以折叠/展开内容</div>
    <div>这是一些可以被折叠的内容</div>
  </LeCard>

  <!-- 默认折叠状态 -->
  <LeCard title="默认折叠" collapsible default-collapsed>
    <div>这个卡片默认是折叠的</div>
  </LeCard>

  <!-- 带额外操作的可折叠卡片 -->
  <LeCard title="用户列表" collapsible>
    <template #header-extra>
      <n-button size="small" @click.stop="handleAdd">添加</n-button>
    </template>
    <div>用户列表内容...</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';

function handleAdd() {
  console.log('添加用户');
}
</script>
```

### 主题变体

```vue
<template>
  <!-- 主题色边框和标题 -->
  <LeCard title="主题色卡片" theme="primary">
    <div>带主题色边框和标题的卡片</div>
  </LeCard>

  <!-- 渐变背景 -->
  <LeCard title="渐变背景" theme="gradient">
    <div>渐变背景卡片</div>
  </LeCard>

  <!-- 无边框卡片 -->
  <LeCard title="无边框" borderless>
    <div>无边框透明背景卡片</div>
  </LeCard>

  <!-- 浮动卡片 -->
  <LeCard title="浮动效果" theme="float">
    <div>更强的阴影效果</div>
  </LeCard>

  <!-- 选中状态 -->
  <LeCard title="选中状态" selected>
    <div>显示选中状态的卡片</div>
  </LeCard>

  <!-- 组合使用 -->
  <LeCard title="组合效果" theme="primary" collapsible>
    <div>主题色 + 可折叠</div>
  </LeCard>
</template>

<script setup lang="ts">
import { Card as LeCard } from '@lee/ui';
</script>
```

## 主题变体说明

- **default**: 默认样式，白色/深色背景，适配明暗模式
- **primary**: 主题色边框，header 使用主题色淡背景，标题使用主题色
- **gradient**: 渐变背景效果，从卡片背景渐变到主题色浅背景
- **borderless**: 无边框透明背景，适合嵌套使用
- **float**: 浮动效果，更强的阴影，hover 时上浮更明显
- **selected**: 选中状态，主题色边框和光晕效果

## 样式变量

组件内部使用 CSS 变量来管理 padding：

- `--le-card-padding`: 内边距值

## 注意事项

1. 如果不传 `title` 且没有使用 `header-extra` 插槽且未开启折叠功能，则不会显示 header 区域
2. `padding` 属性会同时应用到 header 和 content 区域
3. header 使用 flex 布局，title 在左，extra 和折叠图标在右
4. 设置 `collapsible` 为 `true` 时，点击整个 header 区域都会触发折叠/展开
5. 如果在 `header-extra` 插槽中有按钮等可点击元素，建议使用 `@click.stop` 阻止事件冒泡，避免触发折叠
6. 折叠图标会自动添加在 `header-extra` 插槽内容的右侧
7. 折叠动画使用 Vue 的 `<Transition>` 组件实现，支持平滑的展开/收起效果
