# LeOperateGroup 操作按钮组

用于表格行操作、批量操作等场景的按钮组组件，支持文字模式和按钮模式，以及「更多」下拉功能。

## 基础用法

```vue
<template>
  <LeOperateGroup :options="options" :data="rowData" />
</template>

<script setup lang="ts">
const rowData = { id: 1, name: '示例' };

const options = [
  {
    value: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: ({ data }) => console.log('编辑', data),
  },
  {
    value: 'delete',
    label: '删除',
    type: 'error',
    onClick: ({ data }) => console.log('删除', data),
  },
];
</script>
```

## 按钮模式

```vue
<template>
  <LeOperateGroup type="button" :options="options" />
</template>
```

## 带图标按钮

```vue
<script setup lang="ts">
const options = [
  {
    value: 'home',
    label: '首页',
    type: 'primary',
    iconName: 'custom-menu-home',
    onClick: () => {},
  },
];
</script>
```

## 更多下拉

将 `more: true` 的选项收纳到下拉菜单中：

```vue
<script setup lang="ts">
const options = [
  { value: 'edit', label: '编辑', type: 'primary', onClick: () => {} },
  { value: 'copy', label: '复制', type: 'primary', more: true, onClick: () => {} },
  { value: 'delete', label: '删除', type: 'error', more: true, onClick: () => {} },
];
</script>
```

- **文字模式**：显示为省略号图标
- **按钮模式**：显示为「更多」下拉按钮组

## 加载状态

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const loading = ref(false);

const options = computed(() => [
  {
    value: 'save',
    label: '保存',
    type: 'primary',
    loading: loading.value,
    onClick: () => {
      loading.value = true;
      setTimeout(() => (loading.value = false), 2000);
    },
  },
]);
</script>
```

## Props

| 属性    | 类型                 | 默认值   | 说明                 |
| ------- | -------------------- | -------- | -------------------- |
| type    | `'text' \| 'button'` | `'text'` | 展示形式             |
| options | `OperateOption[]`    | -        | 操作项配置（必填）   |
| data    | `any`                | -        | 额外数据，点击时回传 |

## OperateOption

| 属性     | 类型                                             | 默认值      | 说明                        |
| -------- | ------------------------------------------------ | ----------- | --------------------------- |
| value    | `string \| number`                               | -           | 唯一标识（必填）            |
| label    | `string`                                         | -           | 显示文本（必填）            |
| type     | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | 按钮类型                    |
| iconName | `string`                                         | -           | 图标名称，使用 SvgIcon 渲染 |
| disabled | `boolean`                                        | `false`     | 是否禁用                    |
| loading  | `boolean`                                        | `false`     | 是否加载中                  |
| more     | `boolean`                                        | `false`     | 是否收纳到「更多」下拉      |
| onClick  | `(params) => void`                               | -           | 点击回调（必填）            |

### onClick 回调参数

```typescript
interface ClickParams {
  value: string | number; // 当前项的 value
  label: string; // 当前项的 label
  data?: any; // 组件传入的 data
}
```
