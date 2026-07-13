import { computed, reactive, shallowRef } from 'vue';
import { useDialog } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { FilterValues, TablePagination } from '@lee/ui';
import {
  createRole,
  fetchRoles,
  updateRole,
  updateRoleStatus,
  type Role,
  type RoleCreatePayload,
  type RoleUpdatePayload,
} from '@/api/roles';

export type RoleFormMode = 'create' | 'edit';

export interface RoleFormModel {
  id?: number;
  tenantId: number;
  code: string;
  name: string;
  displayName: string | null;
  description: string | null;
  status: number;
  sort: number;
}

const initialFormModel = (): RoleFormModel => ({
  tenantId: 1,
  code: '',
  name: '',
  displayName: null,
  description: null,
  status: 1,
  sort: 0,
});

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export function useRoleManagement() {
  const dialog = useDialog();

  const tableData = shallowRef<Role[]>([]);
  const loading = shallowRef(false);
  const submitting = shallowRef(false);
  const dialogVisible = shallowRef(false);
  const formMode = shallowRef<RoleFormMode>('create');
  const formRef = shallowRef<FormInst | null>(null);
  const filterValues = shallowRef<FilterValues>({});

  const pagination = reactive<TablePagination>({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  const formModel = reactive<RoleFormModel>(initialFormModel());

  const dialogTitle = computed(() => (formMode.value === 'create' ? '新增角色' : '编辑角色'));

  function resetFormModel() {
    Object.assign(formModel, initialFormModel());
  }

  function applyRoleToForm(role: Role) {
    Object.assign(formModel, {
      id: role.id,
      tenantId: role.tenantId ?? 1,
      code: role.code,
      name: role.name,
      displayName: role.displayName ?? null,
      description: role.description ?? null,
      status: role.status,
      sort: role.sort,
    });
  }

  async function loadRoleList() {
    loading.value = true;
    try {
      const result = await fetchRoles({
        page: pagination.page,
        pageSize: pagination.pageSize,
        tenantId: toNumberOrUndefined(filterValues.value.tenantId),
        keyword: filterValues.value.keyword,
        status: filterValues.value.status,
        sortBy: 'sort',
        order: 'asc',
      });

      tableData.value = result.data;
      pagination.total = result.total;
    } finally {
      loading.value = false;
    }
  }

  function handleSearch(values: FilterValues) {
    filterValues.value = values;
    pagination.page = 1;
    loadRoleList();
  }

  function handleReset(values: FilterValues) {
    filterValues.value = values;
    pagination.page = 1;
    loadRoleList();
  }

  function handlePageChange(page: number) {
    pagination.page = page;
    loadRoleList();
  }

  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadRoleList();
  }

  function openCreateDialog() {
    formMode.value = 'create';
    resetFormModel();
    dialogVisible.value = true;
  }

  function openEditDialog(role: Role) {
    formMode.value = 'edit';
    resetFormModel();
    applyRoleToForm(role);
    dialogVisible.value = true;
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function buildCreatePayload(): RoleCreatePayload {
    return {
      tenantId: formModel.tenantId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      description: formModel.description,
      status: formModel.status,
      sort: formModel.sort,
    };
  }

  function buildUpdatePayload(): RoleUpdatePayload {
    return {
      tenantId: formModel.tenantId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      description: formModel.description,
      status: formModel.status,
      sort: formModel.sort,
    };
  }

  async function submitRoleForm() {
    await formRef.value?.validate();
    submitting.value = true;
    try {
      if (formMode.value === 'create') {
        await createRole(buildCreatePayload());
      } else if (formModel.id) {
        await updateRole(formModel.id, buildUpdatePayload());
      }

      closeDialog();
      await loadRoleList();
    } finally {
      submitting.value = false;
    }
  }

  function confirmToggleStatus(role: Role) {
    const nextStatus = role.status === 1 ? 0 : 1;
    const actionText = nextStatus === 1 ? '启用' : '禁用';

    dialog.warning({
      title: `${actionText}角色`,
      content: `确认${actionText}角色「${role.displayName || role.name}」吗？`,
      positiveText: actionText,
      negativeText: '取消',
      onPositiveClick: async () => {
        await updateRoleStatus(role.id, { status: nextStatus });
        await loadRoleList();
      },
    });
  }

  return {
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
    confirmToggleStatus,
    handlePageChange,
    handlePageSizeChange,
    handleReset,
    handleSearch,
    loadRoleList,
    openCreateDialog,
    openEditDialog,
    submitRoleForm,
  };
}
