<script setup lang="ts">
import { computed, h, onMounted } from 'vue';
import type { FormRules, SelectOption, TreeOption } from 'naive-ui';
import { NTag } from 'naive-ui';
import type { FilterItem, OperateOption } from '@lee/ui';
import type { Permission, PermissionType } from '@/api/permissions';
import { usePermissionManagement } from './composables/usePermissionManagement';

defineOptions({
  name: 'PermissionManagementPage',
});

const {
  applications,
  dialogTitle,
  dialogVisible,
  expandedPermissionKeys,
  formModel,
  formRef,
  loadingPermissions,
  permissionFilterValues,
  permissionTree,
  selectedPermission,
  selectedPermissionKeys,
  submitting,
  closeDialog,
  confirmToggleSelectedPermission,
  handleApplicationChange,
  handlePermissionReset,
  handlePermissionSearch,
  handlePermissionTypeChange,
  loadInitialData,
  openCreateDialog,
  openEditDialog,
  submitPermissionForm,
} = usePermissionManagement();

const permissionTypeOptions: SelectOption[] = [
  { label: '应用', value: 'app' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
];

const permissionTypeLabelMap: Record<PermissionType, string> = {
  app: '应用',
  menu: '菜单',
  button: '按钮',
};

const permissionTypeTagMap: Record<PermissionType, 'info' | 'success' | 'warning'> = {
  app: 'info',
  menu: 'success',
  button: 'warning',
};

const statusEnabled = computed({
  get: () => formModel.status === 1,
  set: value => {
    formModel.status = value ? 1 : 0;
  },
});

const applicationOptions = computed<SelectOption[]>(() =>
  applications.value.map(application => ({
    label: application.displayName || application.name,
    value: application.id,
  }))
);

const permissionFilterItems = computed<FilterItem[]>(() => [
  {
    field: 'applicationId',
    label: '应用',
    type: 'select',
    placeholder: '请选择应用',
    options: applicationOptions.value,
  },
  {
    field: 'type',
    label: '类型',
    type: 'select',
    placeholder: '请选择类型',
    options: permissionTypeOptions,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
]);

const formRules: FormRules = {
  tenantId: [{ required: true, type: 'number', message: '请输入租户 ID', trigger: 'blur' }],
  applicationId: [{ required: true, type: 'number', message: '请选择应用', trigger: 'change' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
};

const parentDisabled = computed(() => formModel.type === 'app');

const parentOptions = computed<SelectOption[]>(() => {
  if (!formModel.applicationId || formModel.type === 'app') {
    return [];
  }

  const options: SelectOption[] = [];
  const allowedTypes = formModel.type === 'button' ? ['menu'] : ['app', 'menu'];

  function walk(items: Permission[], level = 0) {
    items.forEach(item => {
      if (item.applicationId !== formModel.applicationId || item.id === formModel.id) {
        return;
      }

      if (allowedTypes.includes(item.type)) {
        options.push({
          label: `${'　'.repeat(level)}${item.displayName || item.name}`,
          value: item.id,
        });
      }

      if (item.children?.length) {
        walk(item.children, level + 1);
      }
    });
  }

  walk(permissionTree.value);
  return options;
});

const permissionOperateOptions = computed<OperateOption[]>(() => [
  {
    value: 'add',
    label: '新增权限',
    type: 'primary',
    iconName: 'ui-add',
    onClick: openCreateDialog,
  },
  {
    value: 'edit',
    label: '编辑权限',
    iconName: 'ui-edit',
    disabled: !selectedPermission.value,
    onClick: openEditDialog,
  },
  {
    value: 'toggle-status',
    label: selectedPermission.value?.status === 1 ? '禁用权限' : '启用权限',
    type: selectedPermission.value?.status === 1 ? 'warning' : 'primary',
    disabled: !selectedPermission.value,
    onClick: confirmToggleSelectedPermission,
  },
]);

function toTreeOption(permission: Permission): TreeOption {
  return {
    key: permission.id,
    label: permission.displayName || permission.name,
    disabled: permission.status !== 1,
    type: permission.type,
    status: permission.status,
    code: permission.code,
    children: permission.children?.map(toTreeOption),
  };
}

const permissionTreeOptions = computed<TreeOption[]>(() => permissionTree.value.map(toTreeOption));

function renderPermissionLabel({ option }: { option: TreeOption }) {
  const type = option.type as PermissionType;
  return h('div', { class: 'permission-management-page__tree-label' }, [
    h('span', { class: 'permission-management-page__tree-title' }, String(option.label)),
    h(
      NTag,
      {
        type: permissionTypeTagMap[type],
        size: 'small',
        bordered: false,
      },
      { default: () => permissionTypeLabelMap[type] }
    ),
    option.status === 0
      ? h(NTag, { type: 'error', size: 'small', bordered: false }, { default: () => '禁用' })
      : null,
  ]);
}

onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <LeContainer
    class="permission-management-route"
    content-class="permission-management-route__content"
  >
    <div class="permission-management-page">
      <LeCard title="权限筛选" collapsible class="permission-management-page__filter">
        <LeFilter
          v-model="permissionFilterValues"
          :items="permissionFilterItems"
          @search="handlePermissionSearch"
          @reset="handlePermissionReset"
        />
      </LeCard>

      <LeCard class="permission-management-page__tree-card">
        <template #headerLeft>
          <div class="permission-management-page__selected-permission">
            {{
              selectedPermission
                ? `当前权限：${selectedPermission.displayName || selectedPermission.name}`
                : '请选择权限节点'
            }}
          </div>
        </template>

        <template #headerRight>
          <LeOperateGroup type="button" :options="permissionOperateOptions" />
        </template>

        <NSpin :show="loadingPermissions">
          <NTree
            v-model:expanded-keys="expandedPermissionKeys"
            v-model:selected-keys="selectedPermissionKeys"
            :data="permissionTreeOptions"
            :render-label="renderPermissionLabel"
            block-line
            selectable
          />
        </NSpin>
      </LeCard>
    </div>

    <LeDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :width="680"
      :mask-closable="false"
      destroy-on-close
    >
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-placement="left"
        label-width="100"
      >
        <NFormItem label="租户 ID" path="tenantId">
          <NInputNumber
            v-model:value="formModel.tenantId"
            :min="1"
            :show-button="false"
            class="permission-management-page__form-control"
          />
        </NFormItem>

        <NFormItem label="应用" path="applicationId">
          <NSelect
            :value="formModel.applicationId"
            :options="applicationOptions"
            placeholder="请选择应用"
            @update:value="handleApplicationChange"
          />
        </NFormItem>

        <NFormItem label="权限类型" path="type">
          <NSelect
            :value="formModel.type"
            :options="permissionTypeOptions"
            placeholder="请选择权限类型"
            @update:value="handlePermissionTypeChange"
          />
        </NFormItem>

        <NFormItem label="上级权限" path="parentId">
          <NSelect
            v-model:value="formModel.parentId"
            :disabled="parentDisabled"
            :options="parentOptions"
            clearable
            placeholder="请选择上级权限"
          />
        </NFormItem>

        <NFormItem label="权限编码" path="code">
          <NInput v-model:value="formModel.code" placeholder="请输入权限编码" />
        </NFormItem>

        <NFormItem label="权限名称" path="name">
          <NInput v-model:value="formModel.name" placeholder="请输入权限名称" />
        </NFormItem>

        <NFormItem label="显示名称" path="displayName">
          <NInput v-model:value="formModel.displayName" placeholder="请输入显示名称" />
        </NFormItem>

        <NFormItem label="路由路径" path="routePath">
          <NInput v-model:value="formModel.routePath" placeholder="请输入路由路径" />
        </NFormItem>

        <NFormItem label="组件路径" path="component">
          <NInput v-model:value="formModel.component" placeholder="请输入组件路径" />
        </NFormItem>

        <NFormItem label="图标" path="icon">
          <NInput v-model:value="formModel.icon" placeholder="请输入图标名称" />
        </NFormItem>

        <NFormItem label="描述" path="description">
          <NInput
            v-model:value="formModel.description"
            type="textarea"
            placeholder="请输入描述"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </NFormItem>

        <NFormItem label="排序" path="sort">
          <NInputNumber
            v-model:value="formModel.sort"
            :min="0"
            class="permission-management-page__form-control"
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
          <NButton type="primary" :loading="submitting" @click="submitPermissionForm">保存</NButton>
        </NSpace>
      </template>
    </LeDialog>
  </LeContainer>
</template>

<style lang="scss" scoped>
.permission-management-route {
  :deep(.permission-management-route__content) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.permission-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 16px;

  &__filter {
    flex-shrink: 0;
  }

  &__tree-card {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.le-card__content) {
      min-height: 0;
      overflow: auto;
    }
  }

  &__selected-permission {
    font-weight: 500;
  }

  &__tree-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__tree-title {
    min-width: 0;
  }

  &__form-control {
    width: 100%;
  }
}
</style>
