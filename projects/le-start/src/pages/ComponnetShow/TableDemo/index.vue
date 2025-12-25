<template>
  <LeContainer overflow="auto">
    <!-- 远程数据表格 -->
    <LeCard title="远程数据表格（模拟）" class="demo-card">
      <template #header-extra>
        <n-space>
          <n-button size="small" @click="fetchRemoteData">刷新数据</n-button>
          <n-tag type="warning" size="small">远程模式</n-tag>
        </n-space>
      </template>
      <LeTable
        :columns="remoteColumns"
        :data="remoteData"
        :loading="remoteLoading"
        :pagination="remotePagination"
        @page-change="handleRemotePageChange"
        @page-size-change="handleRemotePageSizeChange"
      />
    </LeCard>

    <!-- 序号列 + 操作列 -->
    <LeCard title="序号列 + 操作列" class="demo-card">
      <template #header-extra>
        <n-tag type="success" size="small">自动生成</n-tag>
      </template>
      <LeTable
        :columns="simpleColumns"
        :data="basicData"
        :pagination="false"
        show-index
        :operate-column="operateColumnConfig"
      />
    </LeCard>

    <!-- 高级功能 -->
    <LeCard title="高级功能（事件 + 排序 + 拖拽列宽）" class="demo-card">
      <template #header-extra>
        <n-tag type="error" size="small">交互丰富</n-tag>
      </template>
      <p class="mb-2 text-sm text-gray-500">
        支持：点击行、点击单元格、右键单元格、列排序、拖拽调整列宽
      </p>
      <LeTable
        :columns="advancedColumns"
        :data="basicData"
        :pagination="false"
        :row-props="getRowProps"
        :cell-props="getCellProps"
        resizable
        @update:sorter="handleSorterChange"
      />
    </LeCard>

    <!-- 顶部插槽 -->
    <LeCard title="顶部插槽（左侧提示 + 右侧操作）" class="demo-card">
      <template #header-extra>
        <n-tag type="info" size="small">插槽支持</n-tag>
      </template>
      <LeTable :columns="basicColumns" :data="basicData" :pagination="false">
        <template #headerLeft>注意：删除后不可恢复，请谨慎操作！</template>
        <template #headerRight>
          <LeOperateGroup type="button" :options="headerOperateOptions" />
        </template>
      </LeTable>
    </LeCard>

    <!-- 基础表格 -->
    <LeCard title="基础表格" class="demo-card">
      <template #header-extra>
        <n-tag type="info" size="small">本地数据</n-tag>
      </template>
      <LeTable :columns="basicColumns" :data="basicData" :pagination="false" />
    </LeCard>

    <!-- 带分页表格 -->
    <LeCard title="带分页表格" class="demo-card">
      <template #header-extra>
        <n-tag type="success" size="small">自动分页</n-tag>
      </template>
      <LeTable
        :columns="basicColumns"
        :data="paginationData"
        :remote="false"
        :pagination="localPagination"
        @page-change="handleLocalPageChange"
        @page-size-change="handleLocalPageSizeChange"
      />
    </LeCard>

    <!-- 条纹表格 -->
    <LeCard title="条纹表格" class="demo-card">
      <LeTable :columns="basicColumns" :data="basicData" :pagination="false" striped />
    </LeCard>

    <!-- 固定高度 -->
    <LeCard title="固定高度（可滚动）" class="demo-card">
      <LeTable :columns="basicColumns" :data="scrollData" :pagination="false" :max-height="200" />
    </LeCard>

    <!-- 虚拟滚动大数据 -->
    <LeCard title="虚拟滚动（10000条数据）" class="demo-card">
      <template #header-extra>
        <n-tag type="error" size="small">高性能</n-tag>
      </template>
      <LeTable
        :columns="basicColumns"
        :data="virtualData"
        :pagination="false"
        :max-height="400"
        virtual-scroll
      />
    </LeCard>

    <!-- 空状态 -->
    <LeCard title="空状态" class="demo-card">
      <n-space vertical :size="16">
        <div>
          <n-text depth="3">默认空状态</n-text>
          <LeTable :columns="basicColumns" :data="[]" :pagination="false" />
        </div>
        <div>
          <n-text depth="3">自定义空状态文案</n-text>
          <LeTable
            :columns="basicColumns"
            :data="[]"
            :pagination="false"
            empty-description="没有找到匹配的数据"
          />
        </div>
      </n-space>
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import { NTag, NButton, NSpace, NText, useMessage } from 'naive-ui';
import {
  Container as LeContainer,
  Card as LeCard,
  Table as LeTable,
  OperateGroup as LeOperateGroup,
} from '@lee/ui';
import type { TablePagination, OperateColumnConfig } from '@lee/ui';

const message = useMessage();

// 顶部操作按钮配置
const headerOperateOptions = [
  {
    value: 'add',
    label: '新增',
    type: 'primary' as const,
    iconName: 'custom-menu-home',
    onClick: () => message.success('点击新增'),
  },
  {
    value: 'export',
    label: '导出',
    type: undefined,
    onClick: () => message.info('点击导出'),
  },
  {
    value: 'batchDelete',
    label: '批量删除',
    type: 'error' as const,
    onClick: () => message.warning('点击批量删除'),
  },
];

// 简化列配置（用于序号+操作列示例）
const simpleColumns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', width: 80 },
  { title: '地址', key: 'address' },
];

// 操作列配置
const operateColumnConfig: OperateColumnConfig = {
  title: '操作',
  width: 180,
  fixed: 'right',
  options: row => [
    {
      value: 'view',
      label: '查看',
      type: 'primary',
      iconName: 'custom-menu-home',
      onClick: () => message.info(`查看: ${row.name}`),
    },
    {
      value: 'edit',
      label: '编辑',
      type: 'warning',
      onClick: () => message.info(`编辑: ${row.name}`),
    },
    {
      value: 'delete',
      label: '删除',
      type: 'error',
      more: true,
      onClick: () => message.warning(`删除: ${row.name}`),
    },
  ],
};

// 基础列配置
const basicColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', width: 80 },
  { title: '地址', key: 'address' },
  { title: '邮箱', key: 'email' },
];

// 高级功能列配置（支持排序 + 拖拽列宽）
const advancedColumns = [
  { title: 'ID', key: 'id', width: 80, sorter: true, resizable: true },
  {
    title: '姓名',
    key: 'name',
    width: 120,
    resizable: true,
    render: (row: any) =>
      h(
        'span',
        {
          style: 'color: #1890ff; cursor: pointer;',
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            message.success(`点击姓名: ${row.name}`);
          },
        },
        row.name
      ),
  },
  { title: '年龄', key: 'age', width: 100, sorter: true, resizable: true },
  {
    title: '地址',
    key: 'address',
    width: 200,
    resizable: true,
    render: (row: any) =>
      h(
        'span',
        {
          style: 'cursor: context-menu;',
          onContextmenu: (e: MouseEvent) => {
            e.preventDefault();
            message.warning(`右键地址: ${row.address}`);
          },
        },
        row.address
      ),
  },
  { title: '邮箱', key: 'email', resizable: true },
];

// 行属性（点击行事件）
const getRowProps = (row: any) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      message.info(`点击行: ${row.name}`);
    },
  };
};

// 单元格属性（右键事件）
const getCellProps = (row: any, col: any) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault();
      message.warning(`右键单元格 [${col.title}]: ${row[col.key]}`);
    },
  };
};

// 排序变化处理
const handleSorterChange = (sorter: any) => {
  if (sorter) {
    message.info(`排序: ${sorter.columnKey} - ${sorter.order || '无'}`);
  }
};

// 远程表格列配置（带操作列）
const remoteColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', width: 80 },
  { title: '部门', key: 'department' },
  { title: '职位', key: 'position' },
  { title: '入职时间', key: 'joinDate' },
];

// 基础数据
const basicData = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 30, address: '深圳市南山区', email: 'zhaoliu@example.com' },
  { id: 5, name: '钱七', age: 27, address: '杭州市西湖区', email: 'qianqi@example.com' },
]);

// 带分页的数据
const paginationData = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 30, address: '深圳市南山区', email: 'zhaoliu@example.com' },
  { id: 5, name: '钱七', age: 27, address: '杭州市西湖区', email: 'qianqi@example.com' },
  { id: 6, name: '孙八', age: 35, address: '成都市武侯区', email: 'sunba@example.com' },
  { id: 7, name: '周九', age: 29, address: '武汉市江汉区', email: 'zhoujiu@example.com' },
  { id: 8, name: '吴十', age: 31, address: '南京市鼓楼区', email: 'wushi@example.com' },
  { id: 9, name: '郑十一', age: 26, address: '西安市雁塔区', email: 'zheng11@example.com' },
  { id: 10, name: '冯十二', age: 33, address: '重庆市渝中区', email: 'feng12@example.com' },
  { id: 11, name: '陈十三', age: 24, address: '天津市和平区', email: 'chen13@example.com' },
  { id: 12, name: '褚十四', age: 28, address: '苏州市工业园区', email: 'chu14@example.com' },
]);

// 本地分页状态
const localPagination = reactive<TablePagination>({
  page: 1,
  pageSize: 5,
  total: 12,
});

const handleLocalPageChange = (page: number) => {
  localPagination.page = page;
  console.log('本地分页 - 页码变化:', page);
};

const handleLocalPageSizeChange = (pageSize: number) => {
  localPagination.pageSize = pageSize;
  localPagination.page = 1;
  console.log('本地分页 - 每页条数变化:', pageSize);
};

// 滚动数据
const scrollData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    address: `城市${i + 1}区域${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
);

// 虚拟滚动大数据量
const virtualData = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 50),
    address: `城市${(i % 100) + 1}区域${(i % 50) + 1}`,
    email: `user${i + 1}@example.com`,
  }))
);

// 远程数据相关
const remoteData = ref<any[]>([]);
const remoteLoading = ref(false);
const remotePagination = reactive<TablePagination>({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 模拟远程数据
const mockRemoteData = Array.from({ length: 56 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  age: 22 + (i % 20),
  department: ['技术部', '产品部', '设计部', '运营部', '市场部'][i % 5],
  position: ['工程师', '经理', '总监', '专员', '主管'][i % 5],
  joinDate: `202${i % 4}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

const fetchRemoteData = async () => {
  remoteLoading.value = true;

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  const start = (remotePagination.page - 1) * remotePagination.pageSize;
  const end = start + remotePagination.pageSize;

  remoteData.value = mockRemoteData.slice(start, end);
  remotePagination.total = mockRemoteData.length;
  remoteLoading.value = false;
};

const handleRemotePageChange = (page: number) => {
  remotePagination.page = page;
  fetchRemoteData();
};

const handleRemotePageSizeChange = (pageSize: number) => {
  remotePagination.pageSize = pageSize;
  remotePagination.page = 1;
  fetchRemoteData();
};

onMounted(() => {
  fetchRemoteData();
});
</script>

<style lang="scss" scoped>
.demo-card {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
