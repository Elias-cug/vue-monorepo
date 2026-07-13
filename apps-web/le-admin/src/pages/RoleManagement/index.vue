<script setup lang="ts">
import { computed, h, onMounted } from 'vue';
import type { DataTableColumn, FormRules } from 'naive-ui';
import { NTag } from 'naive-ui';
import type { FilterItem, OperateColumnConfig, OperateOption } from '@lee/ui';
import type { Role } from '@/api/roles';
import { useRoleManagement } from './composables/useRoleManagement';

defineOptions({
  name: 'RoleManagementPage',
});

const {
  dialogTitle,
  dialogVisible,
  filterValues,
  formModel,
  formRef,
  loading,
  pagination,
  submitting,
  tableData,
  closeDialog,
  confirmToggleStatus,
  handlePageChange,
  handlePageSizeChange,
  handleReset,
  handleSearch,
  loadRoleList,
  openCreateDialog,
  openEditDialog,
  submitRoleForm,
} = useRoleManagement();

const statusEnabled = computed({
  get: () => formModel.status === 1,
  set: value => {
    formModel.status = value ? 1 : 0;
  },
});

const filterItems: FilterItem[] = [
  {
    field: 'tenantId',
    label: '租户 ID',
    type: 'input',
    placeholder: '请输入租户 ID',
    width: 140,
  },
  {
    field: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '编码/名称/显示名称',
    width: 220,
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
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
};

const headerOperateOptions: OperateOption[] = [
  {
    value: 'add',
    label: '新增角色',
    type: 'primary',
    iconName: 'ui-add',
    onClick: openCreateDialog,
  },
];

const columns: DataTableColumn<Role>[] = [
  {
    title: '角色编码',
    key: 'code',
    width: 150,
  },
  {
    title: '角色名称',
    key: 'name',
    width: 150,
  },
  {
    title: '显示名称',
    key: 'displayName',
    width: 160,
    render: row => row.displayName || '-',
  },
  {
    title: '描述',
    key: 'description',
    minWidth: 220,
    ellipsis: {
      tooltip: true,
    },
    render: row => row.description || '-',
  },
  {
    title: '租户',
    key: 'tenantId',
    width: 90,
    render: row => row.tenantId ?? '-',
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
    title: '系统角色',
    key: 'isSystem',
    width: 100,
    render: row =>
      h(
        NTag,
        { type: row.isSystem ? 'info' : 'default', size: 'small', bordered: false },
        { default: () => (row.isSystem ? '是' : '否') }
      ),
  },
  {
    title: '排序',
    key: 'sort',
    width: 90,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
  },
];

const operateColumn: OperateColumnConfig = {
  title: '操作',
  width: 180,
  fixed: 'right',
  options: rowData => {
    const role = rowData as Role;
    return [
      {
        value: 'edit',
        label: '编辑',
        iconName: 'ui-edit',
        onClick: () => openEditDialog(role),
      },
      {
        value: 'toggle-status',
        label: role.status === 1 ? '禁用' : '启用',
        type: role.status === 1 ? 'warning' : 'primary',
        more: true,
        onClick: () => confirmToggleStatus(role),
      },
    ];
  },
};

onMounted(() => {
  loadRoleList();
});
</script>

<template>
  <LeContainer class="role-management-route" content-class="role-management-route__content">
    <div class="role-management-page">
      <LeCard title="查询" collapsible class="role-management-page__filter">
        <LeFilter
          v-model="filterValues"
          :items="filterItems"
          @search="handleSearch"
          @reset="handleReset"
        />
      </LeCard>

      <LeCard class="role-management-page__table">
        <LeTable
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          :operate-column="operateColumn"
          :scroll-x="1320"
          flex-height
          show-index
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        >
          <template #headerRight>
            <LeOperateGroup type="button" :options="headerOperateOptions" />
          </template>
        </LeTable>
      </LeCard>
    </div>

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
            class="role-management-page__form-control"
          />
        </NFormItem>

        <NFormItem label="角色编码" path="code">
          <NInput v-model:value="formModel.code" placeholder="请输入角色编码" />
        </NFormItem>

        <NFormItem label="角色名称" path="name">
          <NInput v-model:value="formModel.name" placeholder="请输入角色名称" />
        </NFormItem>

        <NFormItem label="显示名称" path="displayName">
          <NInput v-model:value="formModel.displayName" placeholder="请输入显示名称" />
        </NFormItem>

        <NFormItem label="描述" path="description">
          <NInput
            v-model:value="formModel.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </NFormItem>

        <NFormItem label="排序" path="sort">
          <NInputNumber
            v-model:value="formModel.sort"
            :min="0"
            class="role-management-page__form-control"
          />
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
          <NButton type="primary" :loading="submitting" @click="submitRoleForm">保存</NButton>
        </NSpace>
      </template>
    </LeDialog>
  </LeContainer>
</template>

<style lang="scss" scoped>
.role-management-route {
  :deep(.role-management-route__content) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.role-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 16px;

  &__filter {
    flex-shrink: 0;
  }

  &__table {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.le-card__content) {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
  }

  &__form-control {
    width: 100%;
  }
}
</style>
