# LeTable 表格组件

基于 Naive UI 的 NDataTable + NPagination 二次封装的表格组件，简化分页表格的使用。

## 特性

- 封装 NDataTable 和 NPagination 为一体
- 支持远程数据模式和本地数据模式
- 自动处理分页逻辑
- 支持排序和筛选
- 集成 Loading 状态
- 支持自定义分页位置
- 集成主题系统，自动适配明暗模式

## Props

| 属性               | 类型                               | 默认值                    | 说明                       |
| ------------------ | ---------------------------------- | ------------------------- | -------------------------- |
| columns            | DataTableColumns                   | []                        | 表格列配置                 |
| data               | any[]                              | []                        | 表格数据                   |
| loading            | boolean                            | false                     | 是否加载中                 |
| pagination         | TablePagination \| false           | { page: 1, pageSize: 10 } | 分页配置，false 禁用分页   |
| remote             | boolean                            | false                     | 是否远程数据模式           |
| rowKey             | (row: any) => DataTableRowKey      | (row) => row.id           | 行键函数                   |
| bordered           | boolean                            | true                      | 是否显示边框               |
| singleLine         | boolean                            | true                      | 是否单行省略               |
| maxHeight          | number \| string                   | -                         | 表格最大高度               |
| minHeight          | number \| string                   | -                         | 表格最小高度               |
| striped            | boolean                            | false                     | 是否开启条纹               |
| size               | 'small' \| 'medium' \| 'large'     | 'medium'                  | 表格尺寸                   |
| style              | CSSProperties                      | -                         | 自定义样式                 |
| class              | string                             | -                         | 自定义类名                 |
| paginationPosition | 'left' \| 'center' \| 'right'      | 'right'                   | 分页位置                   |
| pageSizes          | number[]                           | [10, 20, 30, 50, 100]     | 每页条数选项               |
| showSizePicker     | boolean                            | true                      | 是否显示每页条数选择器     |
| showQuickJumper    | boolean                            | true                      | 是否显示快速跳转           |
| emptyDescription   | string                             | '暂无数据'                | 空状态描述                 |
| scrollX            | number \| string                   | -                         | 横向滚动宽度               |

## TablePagination 类型

```typescript
interface TablePagination {
  page: number;      // 当前页码
  pageSize: number;  // 每页条数
  total: number;     // 总条数
}
```

## 事件

| 事件名           | 参数                   | 说明             |
| ---------------- | ---------------------- | ---------------- |
| update:page      | (page: number)         | 页码变化         |
| update:pageSize  | (pageSize: number)     | 每页条数变化     |
| update:sorter    | (sorter: any)          | 排序变化         |
| update:filters   | (filters: any)         | 筛选变化         |
| page-change      | (page: number)         | 页码变化         |
| page-size-change | (pageSize: number)     | 每页条数变化     |
| sorter-change    | (sorter: any)          | 排序变化         |
| filters-change   | (filters: any)         | 筛选变化         |

## 插槽

| 插槽名  | 说明           |
| ------- | -------------- |
| empty   | 自定义空状态   |

## 使用示例

### 基础使用（本地数据）

```vue
<template>
  <LeTable
    :columns="columns"
    :data="data"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Table as LeTable } from '@lee/ui';

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '地址', key: 'address' },
];

const data = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区' },
]);
</script>
```

### 远程数据模式

```vue
<template>
  <LeTable
    :columns="columns"
    :data="tableData"
    :loading="loading"
    :pagination="pagination"
    remote
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Table as LeTable } from '@lee/ui';
import type { TablePagination } from '@lee/ui';

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '地址', key: 'address' },
];

const tableData = ref([]);
const loading = ref(false);

const pagination = reactive<TablePagination>({
  page: 1,
  pageSize: 10,
  total: 0,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await api.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>
```

### 自定义分页位置

```vue
<template>
  <!-- 分页居中 -->
  <LeTable
    :columns="columns"
    :data="data"
    pagination-position="center"
  />

  <!-- 分页居左 -->
  <LeTable
    :columns="columns"
    :data="data"
    pagination-position="left"
  />
</template>

<script setup lang="ts">
import { Table as LeTable } from '@lee/ui';
</script>
```

### 禁用分页

```vue
<template>
  <LeTable
    :columns="columns"
    :data="data"
    :pagination="false"
  />
</template>

<script setup lang="ts">
import { Table as LeTable } from '@lee/ui';
</script>
```

### 开启条纹和调整尺寸

```vue
<template>
  <LeTable
    :columns="columns"
    :data="data"
    striped
    size="small"
  />
</template>

<script setup lang="ts">
import { Table as LeTable } from '@lee/ui';
</script>
```

### 固定表头

```vue
<template>
  <LeTable
    :columns="columns"
    :data="data"
    :max-height="400"
  />
</template>

<script setup lang="ts">
import { Table as LeTable } from '@lee/ui';
</script>
```

### 带排序和筛选

```vue
<template>
  <LeTable
    :columns="columns"
    :data="data"
    remote
    :pagination="pagination"
    :loading="loading"
    @sorter-change="handleSorterChange"
    @filters-change="handleFiltersChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Table as LeTable } from '@lee/ui';

const columns = [
  {
    title: '姓名',
    key: 'name',
    sorter: true,
  },
  {
    title: '年龄',
    key: 'age',
    sorter: true,
  },
  {
    title: '状态',
    key: 'status',
    filter: true,
    filterOptions: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'disabled' },
    ],
  },
];

const handleSorterChange = (sorter: any) => {
  console.log('排序变化:', sorter);
  // 根据排序重新请求数据
};

const handleFiltersChange = (filters: any) => {
  console.log('筛选变化:', filters);
  // 根据筛选重新请求数据
};
</script>
```

### 自定义空状态

```vue
<template>
  <LeTable
    :columns="columns"
    :data="[]"
    empty-description="没有找到相关数据"
  />

  <!-- 使用插槽自定义 -->
  <LeTable :columns="columns" :data="[]">
    <template #empty>
      <div class="custom-empty">
        <img src="empty.svg" />
        <p>暂无数据</p>
        <button>添加数据</button>
      </div>
    </template>
  </LeTable>
</template>

<script setup lang="ts">
import { Table as LeTable } from '@lee/ui';
</script>
```

## 注意事项

1. **远程模式 vs 本地模式**
   - `remote=true`：需要手动管理分页状态，组件只负责展示
   - `remote=false`：组件自动处理分页逻辑

2. **rowKey 配置**
   - 默认使用 `row.id` 作为行键
   - 如果数据中没有 `id` 字段，请提供自定义的 `rowKey` 函数

3. **分页禁用**
   - 设置 `:pagination="false"` 可以禁用分页

4. **样式定制**
   - 组件使用 CSS 变量，可通过主题系统统一配置
   - 支持 `style` 和 `class` props 自定义样式

5. **性能优化**
   - 对于大数据量，建议使用 `remote` 模式配合后端分页
   - 设置 `maxHeight` 开启虚拟滚动以提升性能

