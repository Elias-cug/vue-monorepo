<template>
  <LeContainer content-class="filter-table-demo">
    <!-- 过滤区域 -->
    <LeCard title="筛选条件" collapsible class="filter-table-demo__filter">
      <LeFilter
        v-model="filterValues"
        :items="filterItems"
        :default-value="defaultFilterValue"
        @search="handleSearch"
        @reset="handleReset"
      />
    </LeCard>

    <!-- 表格区域 -->
    <LeCard title="用户列表" class="filter-table-demo__table-card">
      <LeTable
        :columns="columns"
        :data="paginatedData"
        :pagination="pagination"
        show-index
        flex-height
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      >
        <template #headerLeft>
          <n-text type="warning">提示：点击操作列可进行数据管理</n-text>
        </template>
        <template #headerRight>
          <LeOperateGroup type="button" :options="headerOperations" />
        </template>
      </LeTable>
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NTag, NText, useMessage, useDialog } from 'naive-ui';
import {
  Container as LeContainer,
  Card as LeCard,
  Filter as LeFilter,
  Table as LeTable,
  OperateGroup as LeOperateGroup,
} from '@lee/ui';
import type { FilterItem, FilterValues, OperateOption } from '@lee/ui';

const message = useMessage();
const dialog = useDialog();

// 过滤配置
const filterItems: FilterItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '在职', value: 'active' },
      { label: '离职', value: 'inactive' },
    ],
  },
  {
    field: 'department',
    label: '部门',
    type: 'select',
    placeholder: '请选择部门',
    options: [
      { label: '全部', value: '' },
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '设计部', value: 'design' },
      { label: '市场部', value: 'market' },
    ],
  },
  {
    field: 'joinDateRange',
    label: '入职日期',
    type: 'daterange',
  },
];

const defaultFilterValue = { status: 'active' };
const filterValues = ref<FilterValues>({ ...defaultFilterValue });

// 表格列配置
const columns = [
  { title: '姓名', key: 'name', width: 120 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row: any) =>
      row.status === 'active'
        ? h(NTag, { type: 'success', size: 'small' }, () => '在职')
        : h(NTag, { type: 'default', size: 'small' }, () => '离职'),
  },
  { title: '部门', key: 'department', width: 120 },
  { title: '职位', key: 'position' },
  { title: '入职日期', key: 'joinDate', width: 120 },
  { title: '邮箱', key: 'email' },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render: (row: any) =>
      h(LeOperateGroup, {
        options: getRowOperations(row),
      }),
  },
];

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    status: 'active',
    department: '技术部',
    position: '前端工程师',
    joinDate: '2022-01-15',
    email: 'zhangsan@example.com',
  },
  {
    id: 2,
    name: '李四',
    status: 'active',
    department: '产品部',
    position: '产品经理',
    joinDate: '2021-06-20',
    email: 'lisi@example.com',
  },
  {
    id: 3,
    name: '王五',
    status: 'inactive',
    department: '设计部',
    position: 'UI设计师',
    joinDate: '2023-03-10',
    email: 'wangwu@example.com',
  },
  {
    id: 4,
    name: '赵六',
    status: 'active',
    department: '技术部',
    position: '后端工程师',
    joinDate: '2022-09-05',
    email: 'zhaoliu@example.com',
  },
  {
    id: 5,
    name: '钱七',
    status: 'active',
    department: '市场部',
    position: '市场专员',
    joinDate: '2020-12-01',
    email: 'qianqi@example.com',
  },
  {
    id: 6,
    name: '孙八',
    status: 'active',
    department: '技术部',
    position: '测试工程师',
    joinDate: '2023-01-08',
    email: 'sunba@example.com',
  },
  {
    id: 7,
    name: '周九',
    status: 'inactive',
    department: '产品部',
    position: '产品助理',
    joinDate: '2022-04-15',
    email: 'zhoujiu@example.com',
  },
  {
    id: 8,
    name: '吴十',
    status: 'active',
    department: '设计部',
    position: '视觉设计师',
    joinDate: '2021-11-20',
    email: 'wushi@example.com',
  },
  {
    id: 9,
    name: '郑十一',
    status: 'active',
    department: '技术部',
    position: '架构师',
    joinDate: '2019-05-10',
    email: 'zheng11@example.com',
  },
  {
    id: 10,
    name: '王十二',
    status: 'active',
    department: '市场部',
    position: '市场总监',
    joinDate: '2018-08-01',
    email: 'wang12@example.com',
  },
]);

// 过滤后的数据
const filteredData = computed(() => {
  let data = [...tableData.value];

  if (filterValues.value.name) {
    data = data.filter(item => item.name.includes(filterValues.value.name));
  }
  if (filterValues.value.status) {
    data = data.filter(item => item.status === filterValues.value.status);
  }
  if (filterValues.value.department) {
    data = data.filter(item => item.department === filterValues.value.department);
  }

  return data;
});

// 分页
const pagination = ref({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [20, 50, 100, 200],
  total: computed(() => filteredData.value.length),
});

const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredData.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  pagination.value.page = page;
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1;
};

// 顶部操作
const headerOperations: OperateOption[] = [
  {
    label: '新增',
    value: 'add',
    type: 'primary',
    iconName: 'ui-add',
    onClick: () => {
      message.success('点击了新增');
    },
  },
  {
    label: '导出',
    value: 'export',
    iconName: 'ui-export',
    onClick: () => {
      message.info('点击了导出');
    },
  },
  {
    label: '批量删除',
    value: 'batchDelete',
    type: 'error',
    iconName: 'ui-delete',
    onClick: () => {
      dialog.warning({
        title: '确认删除',
        content: '确定要批量删除选中的数据吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          message.success('批量删除成功');
        },
      });
    },
  },
];

// 行操作
const getRowOperations = (row: any): OperateOption[] => [
  {
    label: '编辑',
    value: 'edit',
    onClick: () => {
      message.info(`编辑：${row.name}`);
    },
  },
  {
    label: '查看',
    value: 'view',
    onClick: () => {
      message.info(`查看：${row.name}`);
    },
  },
  {
    label: '删除',
    value: 'delete',
    onClick: () => {
      dialog.warning({
        title: '确认删除',
        content: `确定要删除 ${row.name} 吗？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          const index = tableData.value.findIndex(item => item.id === row.id);
          if (index > -1) {
            tableData.value.splice(index, 1);
            message.success('删除成功');
          }
        },
      });
    },
  },
];

// 过滤事件
const handleSearch = (_values: FilterValues) => {
  pagination.value.page = 1;
  message.success(`查询到 ${filteredData.value.length} 条数据`);
};

const handleReset = (_values: FilterValues) => {
  pagination.value.page = 1;
  message.info('已重置筛选条件');
};
</script>

<style lang="scss" scoped>
// Container 内容区域使用 flex 布局
:deep(.filter-table-demo) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.filter-table-demo {
  // 筛选区域不伸缩
  &__filter {
    flex-shrink: 0;
    margin-bottom: 20px;
  }

  // 表格卡片填充剩余空间
  &__table-card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    // Card 内容区域也需要 flex 填充
    :deep(.le-card__content) {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
}
</style>
