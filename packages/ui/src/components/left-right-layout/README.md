# LeLeftRightLayout 左右布局组件

左右布局组件，支持左侧可收起、自定义宽度和间隔。

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
| defaultCollapsed | 是否默认收起左侧 | `boolean` | `false` |
| collapseTooltip | 收起按钮 tooltip | `string` | `'收起左侧'` |
| expandTooltip | 展开按钮 tooltip | `string` | `'展开左侧'` |
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

