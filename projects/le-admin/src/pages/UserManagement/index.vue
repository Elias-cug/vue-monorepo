<!--
 * 用户管理页面
 * 左侧：部门树
 * 右侧：用户列表（支持搜索、新增、编辑）
-->
<template>
  <LeLeftRightLayout :left-width="280" :gap="16" right-transparent>
    <!-- 左侧：部门树 -->
    <template #left>
      <LeCard title="部门列表" class="h-full">
        <n-tree
          :data="departmentTree"
          :default-expanded-keys="defaultExpandedKeys"
          :selected-keys="selectedKeys"
          block-line
          selectable
          @update:selected-keys="handleDepartmentSelect"
        />
      </LeCard>
    </template>

    <!-- 右侧：用户列表 -->
    <template #right>
      <div class="flex flex-col h-full" style="gap: 16px">
        <!-- 搜索区域 -->
        <LeCard title="查询" collapsible>
          <LeFilter
            v-model="filterValues"
            :items="filterItems"
            @search="handleSearch"
            @reset="handleReset"
          />
        </LeCard>

        <!-- 用户表格 -->
        <LeCard class="flex-1">
          <!-- 表格顶部操作栏 -->
          <div class="flex justify-end mb-12px">
            <LeOperateGroup type="button" :options="headerOperateOptions" />
          </div>

          <LeTable
            :columns="columns"
            :data="tableData"
            :loading="loading"
            :pagination="pagination"
            :operate-column="operateColumn"
            show-index
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </LeCard>
      </div>
    </template>
  </LeLeftRightLayout>
</template>

<script setup lang="ts">
/**
 * 用户管理页面组件
 * 使用左右布局，左侧部门树，右侧用户列表
 */
import { ref, reactive } from 'vue';
import type { TreeOption } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import type { FilterItem, FilterValues } from '@lee/ui';
import type { TablePagination, OperateOption, OperateColumnConfig } from '@lee/ui';

defineOptions({
  name: 'UserManagementPage',
});

// ==================== 部门树相关 ====================
// 部门树数据（Mock）
const departmentTree = ref<TreeOption[]>([
  {
    key: 'all',
    label: '全部部门',
    children: [
      {
        key: 'tech',
        label: '技术部',
        children: [
          { key: 'tech-frontend', label: '前端组' },
          { key: 'tech-backend', label: '后端组' },
          { key: 'tech-mobile', label: '移动端组' },
        ],
      },
      {
        key: 'product',
        label: '产品部',
        children: [
          { key: 'product-design', label: '设计组' },
          { key: 'product-operation', label: '运营组' },
        ],
      },
      {
        key: 'market',
        label: '市场部',
        children: [
          { key: 'market-sales', label: '销售组' },
          { key: 'market-bd', label: '商务组' },
        ],
      },
      {
        key: 'hr',
        label: '人力资源部',
      },
      {
        key: 'finance',
        label: '财务部',
      },
    ],
  },
]);

// 默认展开的节点
const defaultExpandedKeys = ref<string[]>(['all', 'tech', 'product', 'market']);

// 选中的部门
const selectedKeys = ref<string[]>(['all']);
const selectedDepartmentKey = ref<string>('all');

// 处理部门选择
const handleDepartmentSelect = (keys: string[]) => {
  if (keys.length > 0) {
    selectedKeys.value = keys;
    selectedDepartmentKey.value = keys[0] || 'all';
    // 重新加载用户列表
    loadUserList();
  }
};

// ==================== 搜索过滤相关 ====================
// 过滤条件
const filterValues = ref<FilterValues>({});

// 过滤项配置
const filterItems: FilterItem[] = [
  {
    field: 'account',
    label: '账号',
    type: 'input',
    placeholder: '请输入账号',
    width: 200,
  },
  {
    field: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    width: 200,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: 150,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
];

// 处理搜索
const handleSearch = (values: FilterValues) => {
  console.log('搜索条件：', values);
  pagination.page = 1;
  loadUserList();
};

// 处理重置
const handleReset = (values: FilterValues) => {
  console.log('重置搜索条件：', values);
  pagination.page = 1;
  loadUserList();
};

// ==================== 头部操作按钮 ====================
// 头部操作按钮配置
const headerOperateOptions: OperateOption[] = [
  {
    value: 'add',
    label: '新增用户',
    type: 'primary',
    iconName: 'ui-add',
    onClick: () => handleAdd(),
  },
];

// ==================== 表格相关 ====================
// 表格列配置
const columns: DataTableColumn[] = [
  {
    title: '账号',
    key: 'account',
    width: 120,
  },
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: '邮箱',
    key: 'email',
    width: 200,
  },
  {
    title: '手机号',
    key: 'phone',
    width: 130,
  },
  {
    title: '部门',
    key: 'department',
    width: 120,
  },
  {
    title: '角色',
    key: 'role',
    width: 120,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render: (row: any) => {
      return row.status === 1 ? '启用' : '禁用';
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
];

// 操作列配置
const operateColumn: OperateColumnConfig = {
  title: '操作',
  width: 150,
  fixed: 'right',
  options: (rowData: any) => [
    {
      value: 'edit',
      label: '编辑',
      iconName: 'ui-edit',
      onClick: () => handleEdit(rowData),
    },
    {
      value: 'delete',
      label: '删除',
      iconName: 'ui-delete',
      type: 'error',
      onClick: () => handleDelete(rowData),
    },
  ],
};

// 表格数据
const tableData = ref<any[]>([]);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive<TablePagination>({
  page: 1,
  pageSize: 20,
  total: 0,
});

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.page = page;
  loadUserList();
};

// 处理每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  loadUserList();
};

// ==================== Mock 数据 ====================
// 部门映射
const departmentMap: Record<string, string> = {
  'tech-frontend': '前端组',
  'tech-backend': '后端组',
  'tech-mobile': '移动端组',
  'product-design': '设计组',
  'product-operation': '运营组',
  'market-sales': '销售组',
  'market-bd': '商务组',
  hr: '人力资源部',
  finance: '财务部',
};

// 生成 Mock 用户数据
const generateMockUsers = (count: number = 50): any[] => {
  const users: any[] = [];
  const roles = ['管理员', '普通用户', '访客'];
  const departments = Object.keys(departmentMap);

  for (let i = 1; i <= count; i++) {
    const deptIndex = Math.floor(Math.random() * departments.length);
    const deptKey = departments[deptIndex] || 'hr';
    users.push({
      id: i,
      account: `user${String(i).padStart(3, '0')}`,
      username: `用户${i}`,
      email: `user${i}@example.com`,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      department: departmentMap[deptKey] || '未知部门',
      departmentKey: deptKey,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: Math.random() > 0.2 ? 1 : 0,
      createTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(
        Math.floor(Math.random() * 28) + 1
      ).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    });
  }

  return users;
};

// 所有用户数据
const allUsers = ref<any[]>(generateMockUsers(50));

// 加载用户列表
const loadUserList = () => {
  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    // 过滤数据
    let filteredUsers = [...allUsers.value];

    // 根据部门过滤
    if (selectedDepartmentKey.value !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        // 如果是父级部门，显示所有子部门的用户
        if (selectedDepartmentKey.value === 'tech') {
          return user.departmentKey.startsWith('tech-');
        } else if (selectedDepartmentKey.value === 'product') {
          return user.departmentKey.startsWith('product-');
        } else if (selectedDepartmentKey.value === 'market') {
          return user.departmentKey.startsWith('market-');
        } else {
          return user.departmentKey === selectedDepartmentKey.value;
        }
      });
    }

    // 根据搜索条件过滤
    if (filterValues.value.account) {
      filteredUsers = filteredUsers.filter(user =>
        user.account.toLowerCase().includes(filterValues.value.account.toLowerCase())
      );
    }
    if (filterValues.value.username) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.includes(filterValues.value.username)
      );
    }
    if (filterValues.value.status !== undefined && filterValues.value.status !== null) {
      filteredUsers = filteredUsers.filter(user => user.status === filterValues.value.status);
    }

    // 更新总数
    pagination.total = filteredUsers.length;

    // 分页
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    tableData.value = filteredUsers.slice(start, end);

    loading.value = false;
  }, 300);
};

// ==================== 操作处理 ====================
// 新增用户
const handleAdd = () => {
  console.log('新增用户');
  // TODO: 打开新增用户对话框
};

// 编辑用户
const handleEdit = (row: any) => {
  console.log('编辑用户：', row);
  // TODO: 打开编辑用户对话框
};

// 删除用户
const handleDelete = (row: any) => {
  console.log('删除用户：', row);
  // TODO: 显示删除确认对话框
};

// 初始化加载数据
loadUserList();
</script>

<style lang="scss" scoped></style>
