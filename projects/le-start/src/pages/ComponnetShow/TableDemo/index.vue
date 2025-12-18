<template>
  <LeContainer>
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
        :pagination="localPagination"
        @page-change="handleLocalPageChange"
        @page-size-change="handleLocalPageSizeChange"
      />
    </LeCard>

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
        remote
        @page-change="handleRemotePageChange"
        @page-size-change="handleRemotePageSizeChange"
      />
    </LeCard>

    <!-- 条纹表格 -->
    <LeCard title="条纹表格" class="demo-card">
      <LeTable :columns="basicColumns" :data="basicData" :pagination="false" striped />
    </LeCard>

    <!-- 不同尺寸 -->
    <LeCard title="表格尺寸" class="demo-card">
      <n-space vertical :size="16">
        <div>
          <n-text depth="3">Small 尺寸</n-text>
          <LeTable :columns="basicColumns" :data="basicData.slice(0, 2)" :pagination="false" size="small" />
        </div>
        <div>
          <n-text depth="3">Medium 尺寸（默认）</n-text>
          <LeTable :columns="basicColumns" :data="basicData.slice(0, 2)" :pagination="false" size="medium" />
        </div>
        <div>
          <n-text depth="3">Large 尺寸</n-text>
          <LeTable :columns="basicColumns" :data="basicData.slice(0, 2)" :pagination="false" size="large" />
        </div>
      </n-space>
    </LeCard>

    <!-- 分页位置 -->
    <LeCard title="分页位置" class="demo-card">
      <n-space vertical :size="24">
        <div>
          <n-text depth="3">左对齐</n-text>
          <LeTable :columns="basicColumns" :data="basicData" pagination-position="left" />
        </div>
        <div>
          <n-text depth="3">居中</n-text>
          <LeTable :columns="basicColumns" :data="basicData" pagination-position="center" />
        </div>
        <div>
          <n-text depth="3">右对齐（默认）</n-text>
          <LeTable :columns="basicColumns" :data="basicData" pagination-position="right" />
        </div>
      </n-space>
    </LeCard>

    <!-- 固定高度 -->
    <LeCard title="固定高度（可滚动）" class="demo-card">
      <LeTable :columns="basicColumns" :data="scrollData" :pagination="false" :max-height="200" />
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
          <LeTable :columns="basicColumns" :data="[]" :pagination="false" empty-description="没有找到匹配的数据" />
        </div>
      </n-space>
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { NTag, NButton, NSpace, NText } from 'naive-ui';
import { Container as LeContainer, Card as LeCard, Table as LeTable } from '@lee/ui';
import type { TablePagination } from '@lee/ui';

// 基础列配置
const basicColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', width: 80 },
  { title: '地址', key: 'address' },
  { title: '邮箱', key: 'email' },
];

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

