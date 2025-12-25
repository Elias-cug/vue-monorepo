<template>
  <LeContainer>
    <!-- 基础过滤 -->
    <LeCard title="基础过滤" class="demo-card">
      <template #header-extra>
        <n-tag type="info" size="small">综合示例</n-tag>
      </template>
      <LeFilter
        v-model="filterResult"
        :items="filterItems"
        :default-value="defaultFilterValue"
        @search="handleSearch"
        @reset="handleReset"
      />
      <div class="mt-4">
        <n-text depth="3">过滤结果：</n-text>
        <pre class="mt-2 p-3 bg-gray-100 rounded text-sm">{{
          JSON.stringify(filterResult, null, 2)
        }}</pre>
      </div>
    </LeCard>

    <!-- 自定义宽度 -->
    <LeCard title="自定义宽度" class="demo-card">
      <template #header-extra>
        <n-tag type="success" size="small">灵活布局</n-tag>
      </template>
      <LeFilter
        v-model="filterResult2"
        :items="customWidthItems"
        @search="handleSearch2"
        @reset="handleReset2"
      />
      <div class="mt-4">
        <n-text depth="3">过滤结果：</n-text>
        <pre class="mt-2 p-3 bg-gray-100 rounded text-sm">{{
          JSON.stringify(filterResult2, null, 2)
        }}</pre>
      </div>
    </LeCard>

    <!-- 结合表格使用 -->
    <LeCard title="结合表格使用" class="demo-card">
      <template #header-extra>
        <n-tag type="warning" size="small">实际场景</n-tag>
      </template>
      <LeFilter
        v-model="tableFilter"
        :items="tableFilterItems"
        @search="handleTableSearch"
        @reset="handleTableReset"
      />
      <div class="mt-4">
        <LeTable :columns="tableColumns" :data="filteredData" :pagination="false" show-index />
      </div>
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NTag, NText, useMessage } from 'naive-ui';
import {
  Container as LeContainer,
  Card as LeCard,
  Filter as LeFilter,
  Table as LeTable,
} from '@lee/ui';
import type { FilterItem, FilterValues } from '@lee/ui';

const message = useMessage();

// 基础过滤项配置
const filterItems: FilterItem[] = [
  {
    field: 'keyword',
    label: '关键字',
    type: 'input',
    placeholder: '请输入关键字',
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  {
    field: 'createDate',
    label: '创建日期',
    type: 'date',
  },
  {
    field: 'dateRange',
    label: '日期范围',
    type: 'daterange',
  },
];

const defaultFilterValue = { status: 'enabled' };
const filterResult = ref<FilterValues>({ ...defaultFilterValue });

const handleSearch = (values: FilterValues) => {
  filterResult.value = values;
  message.success('查询：' + JSON.stringify(values));
};

const handleReset = (values: FilterValues) => {
  filterResult.value = values;
  message.info('已重置');
};

// 自定义宽度
const customWidthItems: FilterItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    width: 150,
  },
  {
    field: 'department',
    label: '部门',
    type: 'select',
    width: 180,
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '设计部', value: 'design' },
    ],
  },
  {
    field: 'joinDate',
    label: '入职日期',
    type: 'daterange',
    width: 280,
  },
];

const filterResult2 = ref<FilterValues>({});

const handleSearch2 = (values: FilterValues) => {
  filterResult2.value = values;
  message.success('查询：' + JSON.stringify(values));
};

const handleReset2 = (values: FilterValues) => {
  filterResult2.value = values;
  message.info('已重置');
};

// 表格过滤
const tableFilterItems: FilterItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
  },
  {
    field: 'age',
    label: '年龄段',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '20-25岁', value: '20-25' },
      { label: '26-30岁', value: '26-30' },
      { label: '31-35岁', value: '31-35' },
    ],
  },
];

const tableColumns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', width: 80 },
  { title: '部门', key: 'department' },
  { title: '入职时间', key: 'joinDate' },
];

const tableData = ref([
  { id: 1, name: '张三', age: 28, department: '技术部', joinDate: '2022-01-15' },
  { id: 2, name: '李四', age: 32, department: '产品部', joinDate: '2021-06-20' },
  { id: 3, name: '王五', age: 24, department: '设计部', joinDate: '2023-03-10' },
  { id: 4, name: '赵六', age: 26, department: '技术部', joinDate: '2022-09-05' },
  { id: 5, name: '钱七', age: 35, department: '产品部', joinDate: '2020-12-01' },
]);

const tableFilter = ref<FilterValues>({});

const filteredData = computed(() => {
  let data = [...tableData.value];

  if (tableFilter.value.name) {
    data = data.filter(item => item.name.includes(tableFilter.value.name));
  }

  if (tableFilter.value.age) {
    const [min, max] = tableFilter.value.age.split('-').map(Number);
    data = data.filter(item => item.age >= min && item.age <= max);
  }

  return data;
});

const handleTableSearch = (values: FilterValues) => {
  tableFilter.value = values;
  message.success(`查询到 ${filteredData.value.length} 条数据`);
};

const handleTableReset = (values: FilterValues) => {
  tableFilter.value = values;
  message.info('已重置');
};
</script>

<style lang="scss" scoped>
.demo-card {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
