# LeFilter 过滤组件

统一的查询过滤器组件，支持多种过滤项类型。

## 功能特性

- 支持 input、select、date、daterange 四种过滤项类型
- 查询按钮 emit 出过滤条件
- 重置按钮清空并 emit 重置后的条件
- 灵活的布局，每项最大 200px
- 支持自定义宽度

## 基础用法

```vue
<template>
  <LeFilter :items="filterItems" @search="handleSearch" @reset="handleReset" />
</template>

<script setup lang="ts">
import { Filter as LeFilter } from '@lee/ui';
import type { FilterItem, FilterValues } from '@lee/ui';

const filterItems: FilterItem[] = [
  { field: 'keyword', label: '关键字', type: 'input' },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  { field: 'createDate', label: '创建日期', type: 'date' },
  { field: 'dateRange', label: '日期范围', type: 'daterange' },
];

const handleSearch = (values: FilterValues) => {
  console.log('查询条件:', values);
};

const handleReset = (values: FilterValues) => {
  console.log('已重置');
};
</script>
```

## Props

| 属性       | 类型           | 默认值   | 说明             |
| ---------- | -------------- | -------- | ---------------- |
| items      | `FilterItem[]` | `[]`     | 过滤项配置       |
| searchText | `string`       | `'查询'` | 查询按钮文字     |
| resetText  | `string`       | `'重置'` | 重置按钮文字     |
| showReset  | `boolean`      | `true`   | 是否显示重置按钮 |

## FilterItem 配置

| 属性         | 类型                                           | 必填  | 说明        |
| ------------ | ---------------------------------------------- | ----- | ----------- |
| field        | `string`                                       | ✓     | 字段名      |
| label        | `string`                                       | ✓     | 标签        |
| type         | `'input' \| 'select' \| 'date' \| 'daterange'` | ✓     | 类型        |
| placeholder  | `string`                                       | -     | 占位符      |
| options      | `FilterOption[]`                               | -     | select 选项 |
| defaultValue | `any`                                          | -     | 默认值      |
| width        | `number \| string`                             | `200` | 宽度        |

## Events

| 事件名 | 参数                             | 说明         |
| ------ | -------------------------------- | ------------ |
| search | `(values: FilterValues) => void` | 点击查询按钮 |
| reset  | `(values: FilterValues) => void` | 点击重置按钮 |

## 类型定义

```typescript
type FilterItemType = 'input' | 'select' | 'date' | 'daterange';

interface FilterItem {
  field: string;
  label: string;
  type: FilterItemType;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: any;
  width?: number | string;
}

type FilterValues = Record<string, any>;
```
