# LeContainer 容器组件

一个灵活的容器组件，支持主题变体和可选滚动条。

## 特性

- 宽高为 100%
- 默认 overflow: hidden，可通过 `overflow="auto"` 启用滚动
- 主题响应式背景色
- 支持自定义 padding
- 可选使用 naive-ui 的滚动条组件

## Props

| 属性     | 类型               | 默认值    | 说明                                                            |
| -------- | ------------------ | --------- | --------------------------------------------------------------- |
| padding  | string \| number   | '16px'    | 内边距，可以是字符串（如 '20px'）或数字（如 20，会自动转为 px） |
| overflow | 'hidden' \| 'auto' | 'hidden'  | 溢出处理，auto 时启用 NScrollbar 滚动条                         |
| theme    | string             | 'default' | 主题变体：default/bordered/accent/primary/card/gradient         |
| bordered | boolean            | false     | 是否显示边框（简写属性）                                        |
| accent   | boolean            | false     | 是否显示顶部装饰线（简写属性）                                  |
| style    | CSSProperties      | -         | 自定义样式                                                      |
| class    | string             | -         | 自定义类名                                                      |

## 插槽

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 默认内容插槽 |

## 使用示例

### 基础使用

```vue
<template>
  <LeContainer>
    <div>容器内容</div>
  </LeContainer>
</template>

<script setup lang="ts">
import { Container as LeContainer } from '@lee/ui';
</script>
```

### 启用滚动

```vue
<template>
  <!-- 启用滚动条 -->
  <LeContainer overflow="auto">
    <div>内容超出时可滚动</div>
  </LeContainer>
</template>

<script setup lang="ts">
import { Container as LeContainer } from '@lee/ui';
</script>
```

### 自定义 padding

```vue
<template>
  <!-- 使用字符串 -->
  <LeContainer padding="24px">
    <div>自定义 padding</div>
  </LeContainer>

  <!-- 使用数字 -->
  <LeContainer :padding="32">
    <div>自定义 padding</div>
  </LeContainer>
</template>

<script setup lang="ts">
import { Container as LeContainer } from '@lee/ui';
</script>
```

### 主题变体

```vue
<template>
  <!-- 带边框 -->
  <LeContainer bordered>
    <div>带边框的容器</div>
  </LeContainer>

  <!-- 带顶部装饰线 -->
  <LeContainer accent>
    <div>带主题色装饰线</div>
  </LeContainer>

  <!-- 主题色背景 -->
  <LeContainer theme="primary">
    <div>主题色背景</div>
  </LeContainer>

  <!-- 卡片样式 -->
  <LeContainer theme="card">
    <div>卡片样式容器</div>
  </LeContainer>

  <!-- 渐变背景 -->
  <LeContainer theme="gradient">
    <div>渐变背景容器</div>
  </LeContainer>

  <!-- 组合使用 -->
  <LeContainer bordered accent>
    <div>带边框和装饰线</div>
  </LeContainer>
</template>

<script setup lang="ts">
import { Container as LeContainer } from '@lee/ui';
</script>
```

### 自定义样式

```vue
<template>
  <LeContainer :style="{ backgroundColor: '#fff' }" class="custom-container">
    <div>自定义样式</div>
  </LeContainer>
</template>

<script setup lang="ts">
import { Container as LeContainer } from '@lee/ui';
</script>
```

## 样式变量

组件内部使用 CSS 变量来管理 padding：

- `--le-container-padding`: 内边距值

## 注意事项

1. 组件默认宽高为 100%，请确保父元素有明确的尺寸
2. 默认 `overflow: hidden`，内容超出时不滚动
3. 设置 `overflow="auto"` 时启用 NScrollbar 滚动条
4. 背景色使用 `var(--le-neutral-body)`，自动响应主题切换
