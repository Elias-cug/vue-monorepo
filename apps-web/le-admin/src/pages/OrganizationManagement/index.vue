<template>
  <LeContainer
    class="organization-management-route"
    content-class="organization-management-route__content"
  >
    <div class="organization-management-page">
      <LeCard title="查询" collapsible>
        <LeFilter
          v-model="filterValues"
          :items="filterItems"
          @search="handleSearch"
          @reset="handleReset"
        />
      </LeCard>

      <LeCard class="organization-management-page__table">
        <div class="organization-management-page__toolbar">
          <LeOperateGroup type="button" :options="headerOperateOptions" />
        </div>

        <LeTable
          :columns="columns"
          :data="treeData"
          :loading="loading"
          :operate-column="operateColumn"
          :row-key="getRowKey"
          :pagination="false"
          default-expand-all
        />
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
            class="organization-management-page__form-control"
          />
        </NFormItem>

        <NFormItem label="上级组织" path="parentId">
          <NSelect
            v-model:value="formModel.parentId"
            :options="parentOptions"
            placeholder="请选择上级组织"
          />
        </NFormItem>

        <NFormItem label="组织名称" path="name">
          <NInput v-model:value="formModel.name" placeholder="请输入组织名称" />
        </NFormItem>

        <NFormItem label="组织编码" path="code">
          <NInput v-model:value="formModel.code" placeholder="请输入组织编码" />
        </NFormItem>

        <NFormItem label="组织类型" path="orgType">
          <NSelect
            v-model:value="formModel.orgType"
            :options="organizationTypeOptions"
            placeholder="请选择组织类型"
          />
        </NFormItem>

        <NFormItem label="排序" path="sortOrder">
          <NInputNumber
            v-model:value="formModel.sortOrder"
            :min="0"
            :show-button="false"
            class="organization-management-page__form-control"
          />
        </NFormItem>

        <NFormItem label="状态" path="status">
          <NSwitch v-model:value="statusEnabled">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </NSwitch>
        </NFormItem>

        <NFormItem label="备注" path="remark">
          <NInput
            v-model:value="formModel.remark"
            type="textarea"
            placeholder="请输入备注"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="closeDialog">取消</NButton>
          <NButton type="primary" :loading="submitting" @click="submitOrganizationForm">
            保存
          </NButton>
        </NSpace>
      </template>
    </LeDialog>
  </LeContainer>
</template>

<script setup lang="ts">
import { computed, h, onMounted } from 'vue';
import type { DataTableColumn, FormRules, SelectOption } from 'naive-ui';
import { NButton, NTag } from 'naive-ui';
import type { FilterItem, OperateColumnConfig, OperateOption } from '@lee/ui';
import type { Organization } from '@/api/organizations';
import { useOrganizationManagement } from './composables/useOrganizationManagement';

defineOptions({
  name: 'OrganizationManagement',
});

const {
  dialogTitle,
  dialogVisible,
  filterValues,
  formMode,
  formModel,
  formRef,
  loading,
  submitting,
  treeData,
  closeDialog,
  confirmDelete,
  handleReset,
  handleSearch,
  loadOrganizationTree,
  openCreateDialog,
  openEditDialog,
  submitOrganizationForm,
} = useOrganizationManagement();

const statusEnabled = computed({
  get: () => formModel.status === 1,
  set: value => {
    formModel.status = value ? 1 : 0;
  },
});

const organizationTypeOptions: SelectOption[] = [
  { label: '公司', value: 'company' },
  { label: '部门', value: 'department' },
  { label: '小组', value: 'team' },
];

const parentOptions = computed<SelectOption[]>(() => {
  const options: SelectOption[] = [{ label: '根组织', value: null }];

  function walk(items: Organization[], level = 0) {
    items.forEach(item => {
      if (formMode.value === 'edit' && item.id === formModel.id) {
        return;
      }

      options.push({
        label: `${'　'.repeat(level)}${item.name}`,
        value: item.id,
      });

      if (item.children?.length) {
        walk(item.children, level + 1);
      }
    });
  }

  walk(treeData.value);
  return options;
});

const filterItems: FilterItem[] = [
  {
    field: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '组织名称/编码',
    width: 220,
  },
  {
    field: 'orgType',
    label: '类型',
    type: 'select',
    placeholder: '请选择类型',
    width: 140,
    options: organizationTypeOptions,
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
  name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
  orgType: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
};

const headerOperateOptions: OperateOption[] = [
  {
    value: 'add',
    label: '新增组织',
    type: 'primary',
    iconName: 'ui-add',
    onClick: () => openCreateDialog(),
  },
];

const columns: DataTableColumn<Organization>[] = [
  {
    title: '组织名称',
    key: 'name',
    minWidth: 220,
  },
  {
    title: '组织编码',
    key: 'code',
    width: 160,
  },
  {
    title: '类型',
    key: 'orgType',
    width: 100,
    render: row =>
      organizationTypeOptions.find(option => option.value === row.orgType)?.label || row.orgType,
  },
  {
    title: '排序',
    key: 'sortOrder',
    width: 80,
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
    title: '备注',
    key: 'remark',
    minWidth: 180,
    render: row => row.remark || '-',
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 180,
  },
];

const operateColumn: OperateColumnConfig = {
  title: '操作',
  width: 220,
  fixed: 'right',
  options: rowData => [
    {
      value: 'add-child',
      label: '新增下级',
      onClick: () => openCreateDialog(rowData as Organization),
    },
    {
      value: 'edit',
      label: '编辑',
      iconName: 'ui-edit',
      onClick: () => openEditDialog(rowData as Organization),
    },
    {
      value: 'delete',
      label: '删除',
      iconName: 'ui-delete',
      type: 'error',
      more: true,
      onClick: () => confirmDelete(rowData as Organization),
    },
  ],
};

function getRowKey(row: Organization) {
  return row.id;
}

onMounted(() => {
  loadOrganizationTree();
});
</script>

<style lang="scss" scoped>
.organization-management-route {
  :deep(.organization-management-route__content) {
    display: flex;
    flex-direction: column;
  }
}

.organization-management-page {
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
