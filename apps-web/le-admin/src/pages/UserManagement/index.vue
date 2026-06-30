<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import type { DataTableColumn, FormRules, TreeOption } from 'naive-ui';
import { NTag } from 'naive-ui';
import type { FilterItem, OperateColumnConfig, OperateOption } from '@lee/ui';
import type { User } from '@/api/users';
import { useUserManagement } from './composables/useUserManagement';

defineOptions({
  name: 'UserManagementPage',
});

const departmentTree = ref<TreeOption[]>([
  {
    key: 'all',
    label: '全部部门',
    children: [
      { key: 'tech', label: '技术部' },
      { key: 'product', label: '产品部' },
      { key: 'market', label: '市场部' },
      { key: 'hr', label: '人力资源部' },
      { key: 'finance', label: '财务部' },
    ],
  },
]);

const defaultExpandedKeys = ref<string[]>(['all']);
const selectedKeys = ref<string[]>(['all']);

const {
  dialogTitle,
  dialogVisible,
  filterValues,
  formMode,
  formModel,
  formRef,
  loading,
  pagination,
  submitting,
  tableData,
  closeDialog,
  confirmDelete,
  confirmResetPassword,
  handlePageChange,
  handlePageSizeChange,
  handleReset,
  handleSearch,
  loadUserList,
  openCreateDialog,
  openEditDialog,
  submitUserForm,
} = useUserManagement();

const statusEnabled = computed({
  get: () => formModel.status === 1,
  set: value => {
    formModel.status = value ? 1 : 0;
  },
});

const filterItems: FilterItem[] = [
  {
    field: 'username',
    label: '账号',
    type: 'input',
    placeholder: '请输入账号',
    width: 180,
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    width: 200,
  },
  {
    field: 'phone',
    label: '手机号',
    type: 'input',
    placeholder: '请输入手机号',
    width: 180,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: 140,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
];

const formRules: FormRules = {
  tenantId: [{ required: true, type: 'number', message: '请输入租户 ID', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'input'] }],
};

const headerOperateOptions: OperateOption[] = [
  {
    value: 'add',
    label: '新增用户',
    type: 'primary',
    iconName: 'ui-add',
    onClick: openCreateDialog,
  },
];

const columns: DataTableColumn<User>[] = [
  {
    title: '账号',
    key: 'username',
    width: 140,
  },
  {
    title: '显示名称',
    key: 'displayName',
    width: 140,
    render: row => row.displayName || '-',
  },
  {
    title: '邮箱',
    key: 'email',
    width: 220,
    render: row => row.email || '-',
  },
  {
    title: '手机号',
    key: 'phone',
    width: 150,
    render: row => row.phone || '-',
  },
  {
    title: '租户',
    key: 'tenantId',
    width: 90,
  },
  {
    title: '状态',
    key: 'status',
    width: 90,
    render: row =>
      h(
        NTag,
        { type: row.status === 1 ? 'success' : 'error', size: 'small', bordered: false },
        { default: () => (row.status === 1 ? '启用' : '禁用') }
      ),
  },
  {
    title: '最后登录',
    key: 'lastLoginAt',
    width: 180,
    render: row => row.lastLoginAt || '-',
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
  },
];

const operateColumn: OperateColumnConfig = {
  title: '操作',
  width: 220,
  fixed: 'right',
  options: rowData => [
    {
      value: 'edit',
      label: '编辑',
      iconName: 'ui-edit',
      onClick: () => openEditDialog(rowData as User),
    },
    {
      value: 'reset-password',
      label: '重置密码',
      type: 'warning',
      more: true,
      onClick: () => confirmResetPassword(rowData as User),
    },
    {
      value: 'delete',
      label: '删除',
      iconName: 'ui-delete',
      type: 'error',
      more: true,
      onClick: () => confirmDelete(rowData as User),
    },
  ],
};

function handleDepartmentSelect(keys: string[]) {
  selectedKeys.value = keys.length ? keys : ['all'];
}

onMounted(() => {
  loadUserList();
});
</script>

<template>
  <LeLeftRightLayout :left-width="280" :gap="16" right-transparent>
    <template #left>
      <LeCard title="部门列表" class="h-full">
        <NTree
          :data="departmentTree"
          :default-expanded-keys="defaultExpandedKeys"
          :selected-keys="selectedKeys"
          block-line
          selectable
          @update:selected-keys="handleDepartmentSelect"
        />
      </LeCard>
    </template>

    <template #right>
      <div class="user-management-page">
        <LeCard title="查询" collapsible>
          <LeFilter
            v-model="filterValues"
            :items="filterItems"
            @search="handleSearch"
            @reset="handleReset"
          />
        </LeCard>

        <LeCard class="user-management-page__table">
          <div class="user-management-page__toolbar">
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

  <LeDialog
    v-model:visible="dialogVisible"
    :title="dialogTitle"
    :width="620"
    :mask-closable="false"
    destroy-on-close
  >
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-placement="left"
      label-width="90"
    >
      <NFormItem label="租户 ID" path="tenantId">
        <NInputNumber
          v-model:value="formModel.tenantId"
          :min="1"
          :show-button="false"
          class="user-management-page__form-control"
        />
      </NFormItem>

      <NFormItem label="账号" path="username">
        <NInput
          v-model:value="formModel.username"
          :disabled="formMode === 'edit'"
          placeholder="请输入账号"
        />
      </NFormItem>

      <NFormItem label="显示名称" path="displayName">
        <NInput v-model:value="formModel.displayName" placeholder="请输入显示名称" />
      </NFormItem>

      <NFormItem label="邮箱" path="email">
        <NInput v-model:value="formModel.email" placeholder="请输入邮箱" />
      </NFormItem>

      <NFormItem label="手机号" path="phone">
        <NInput v-model:value="formModel.phone" placeholder="请输入手机号" />
      </NFormItem>

      <NFormItem label="头像地址" path="avatarUrl">
        <NInput v-model:value="formModel.avatarUrl" placeholder="请输入头像 URL" />
      </NFormItem>

      <NFormItem label="状态" path="status">
        <NSwitch v-model:value="statusEnabled">
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </NSwitch>
      </NFormItem>
    </NForm>

    <template #footer>
      <NSpace justify="end">
        <NButton @click="closeDialog">取消</NButton>
        <NButton type="primary" :loading="submitting" @click="submitUserForm">保存</NButton>
      </NSpace>
    </template>
  </LeDialog>
</template>

<style lang="scss" scoped>
.user-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  &__form-control {
    width: 100%;
  }
}
</style>
