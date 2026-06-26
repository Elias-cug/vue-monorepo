# LeButton 按钮组件

基于 Naive UI 的 `NButton` 二次封装，支持通过 `icon-name` 属性使用 SvgIcon 渲染图标。

## 特性

- 完全透传 NButton 的 props 和 events
- 支持 `icon-name` 属性，使用 SvgIcon 组件渲染图标
- Loading 状态时自动使用原始 loading 图标替代自定义图标
- 支持 `icon-size` 和 `icon-color` 自定义图标样式

## 使用方式

```vue
<template>
  <!-- 基础用法 -->
  <LeButton type="primary">Primary</LeButton>

  <!-- 带图标 -->
  <LeButton type="primary" icon-name="menu-home">首页</LeButton>

  <!-- 自定义图标大小和颜色 -->
  <LeButton icon-name="menu-home" icon-size="20px" icon-color="#f5222d">自定义图标</LeButton>

  <!-- Loading 状态 -->
  <LeButton type="primary" :loading="loading" icon-name="menu-home">加载中</LeButton>
</template>
```

## Props

| 属性       | 类型               | 默认值  | 说明                            |
| ---------- | ------------------ | ------- | ------------------------------- |
| icon-name  | `string`           | -       | 图标名称，使用 SvgIcon 组件渲染 |
| icon-size  | `string \| number` | `'1em'` | 图标大小                        |
| icon-color | `string`           | -       | 图标颜色，默认继承按钮颜色      |

> 其他 props 完全透传给 NButton，如 `type`、`size`、`loading`、`disabled` 等。

## Events

所有事件透传给 NButton，如 `@click` 等。

## Slots

| 插槽名  | 说明                                    |
| ------- | --------------------------------------- |
| default | 按钮内容                                |
| icon    | 自定义图标（当未使用 icon-name 时生效） |

## Loading 行为

当按钮处于 loading 状态时：

- 如果设置了 `icon-name`，图标会被 NButton 原生的 loading 图标替代
- loading 结束后恢复显示自定义图标
