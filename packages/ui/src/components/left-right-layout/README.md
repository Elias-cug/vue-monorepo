# LeLeftRightLayout 左右布局组件

左右布局组件，支持左侧可收起、自定义宽度和间隔。组件默认使用 `LeContainer` 包裹，可直接作为页面根组件使用。

## 基础用法

```vue
<template>
  <LeLeftRightLayout>
    <template #left>
      <div>左侧内容</div>
    </template>
    <template #right>
      <div>右侧内容</div>
    </template>
  </LeLeftRightLayout>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| leftWidth | 左侧宽度 | `string \| number` | `240` |
| gap | 左右间隔 | `string \| number` | `16` |
| padding | 内边距 | `string \| number` | `16px` |
| collapsed | 左侧是否收起（v-model） | `boolean` | - |
| defaultCollapsed | 是否默认收起左侧（非受控模式） | `boolean` | `false` |
| collapseTooltip | 收起按钮 tooltip | `string` | `'收起左侧'` |
| expandTooltip | 展开按钮 tooltip | `string` | `'展开左侧'` |
| rightTransparent | 右侧面板是否透明 | `boolean` | `false` |
| style | 自定义样式 | `CSSProperties` | - |
| class | 自定义类名 | `string` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:collapsed | 折叠状态变化时触发 | `(collapsed: boolean)` |
| collapse | 收起时触发 | - |
| expand | 展开时触发 | - |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| left | 左侧内容 |
| right | 右侧内容 |
| default | 默认插槽，会渲染到右侧区域 |

## 自定义宽度示例

```vue
<template>
  <LeLeftRightLayout :left-width="300" :gap="24">
    <template #left>
      <div>宽度 300px 的左侧面板</div>
    </template>
    <template #right>
      <div>右侧内容</div>
    </template>
  </LeLeftRightLayout>
</template>
```

## 默认收起示例

```vue
<template>
  <LeLeftRightLayout default-collapsed>
    <template #left>
      <div>左侧内容（默认收起）</div>
    </template>
    <template #right>
      <div>右侧内容</div>
    </template>
  </LeLeftRightLayout>
</template>
```

## 受控模式（v-model）

使用 `v-model:collapsed` 可以外部控制收起状态：

```vue
<template>
  <n-button @click="collapsed = !collapsed">切换</n-button>
  <LeLeftRightLayout v-model:collapsed="collapsed">
    <template #left>
      <div>左侧内容</div>
    </template>
    <template #right>
      <div>右侧内容</div>
    </template>
  </LeLeftRightLayout>
</template>

<script setup>
import { ref } from 'vue';
const collapsed = ref(false);
</script>
```

## 右侧透明示例

当右侧需要放置多个卡片时，可以使用 `rightTransparent` 属性让右侧面板透明：

```vue
<template>
  <LeLeftRightLayout right-transparent>
    <template #left>
      <div>左侧菜单</div>
    </template>
    <template #right>
      <n-space vertical :size="16">
        <LeCard title="卡片1">内容1</LeCard>
        <LeCard title="卡片2">内容2</LeCard>
      </n-space>
    </template>
  </LeLeftRightLayout>
</template>
```

