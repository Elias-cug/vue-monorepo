import { computed, reactive, shallowRef } from 'vue';
import { useDialog } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { FilterValues } from '@lee/ui';
import { fetchApplications, type Application } from '@/api/applications';
import {
  createPermission,
  fetchPermissionTree,
  updatePermission,
  updatePermissionStatus,
  type Permission,
  type PermissionCreatePayload,
  type PermissionType,
  type PermissionUpdatePayload,
} from '@/api/permissions';

export type PermissionFormMode = 'create' | 'edit';

export interface PermissionFormModel {
  id?: number;
  tenantId: number;
  applicationId: number | null;
  parentId: number | null;
  code: string;
  name: string;
  displayName: string | null;
  type: PermissionType;
  routePath: string | null;
  component: string | null;
  icon: string | null;
  description: string | null;
  status: number;
  isSystem: boolean;
  sort: number;
}

const initialFormModel = (): PermissionFormModel => ({
  tenantId: 1,
  applicationId: null,
  parentId: null,
  code: '',
  name: '',
  displayName: null,
  type: 'menu',
  routePath: null,
  component: null,
  icon: null,
  description: null,
  status: 1,
  isSystem: false,
  sort: 0,
});

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export function usePermissionManagement() {
  const dialog = useDialog();

  const applications = shallowRef<Application[]>([]);
  const permissionTree = shallowRef<Permission[]>([]);
  const selectedPermissionKeys = shallowRef<number[]>([]);
  const expandedPermissionKeys = shallowRef<number[]>([]);
  const loadingPermissions = shallowRef(false);
  const submitting = shallowRef(false);
  const dialogVisible = shallowRef(false);
  const formMode = shallowRef<PermissionFormMode>('create');
  const formRef = shallowRef<FormInst | null>(null);
  const permissionFilterValues = shallowRef<FilterValues>({});

  const formModel = reactive<PermissionFormModel>(initialFormModel());

  const dialogTitle = computed(() => (formMode.value === 'create' ? '新增权限' : '编辑权限'));

  const selectedPermission = computed(() => {
    const selectedId = selectedPermissionKeys.value[0];
    if (!selectedId) {
      return null;
    }

    return findPermission(permissionTree.value, selectedId);
  });

  function resetFormModel() {
    Object.assign(formModel, initialFormModel());
  }

  function applyPermissionToForm(permission: Permission) {
    Object.assign(formModel, {
      id: permission.id,
      tenantId: permission.tenantId,
      applicationId: permission.applicationId,
      parentId: permission.parentId ?? null,
      code: permission.code,
      name: permission.name,
      displayName: permission.displayName ?? null,
      type: permission.type,
      routePath: permission.routePath ?? null,
      component: permission.component ?? null,
      icon: permission.icon ?? null,
      description: permission.description ?? null,
      status: permission.status,
      isSystem: permission.isSystem,
      sort: permission.sort,
    });
  }

  function findPermission(items: Permission[], permissionId: number): Permission | null {
    for (const item of items) {
      if (item.id === permissionId) {
        return item;
      }

      const child = findPermission(item.children || [], permissionId);
      if (child) {
        return child;
      }
    }

    return null;
  }

  function collectPermissionIds(items: Permission[]): number[] {
    return items.flatMap(item => [item.id, ...collectPermissionIds(item.children || [])]);
  }

  async function loadApplications() {
    const result = await fetchApplications({
      page: 1,
      pageSize: 200,
      status: 1,
      sortBy: 'sort',
      order: 'asc',
    });
    applications.value = result.data;
  }

  async function loadPermissionTree() {
    loadingPermissions.value = true;
    try {
      permissionTree.value = await fetchPermissionTree({
        tenantId: toNumberOrUndefined(permissionFilterValues.value.tenantId),
        applicationId: toNumberOrUndefined(permissionFilterValues.value.applicationId),
        keyword: permissionFilterValues.value.keyword,
        type: permissionFilterValues.value.type,
        status: permissionFilterValues.value.status,
        sortBy: 'sort',
        order: 'asc',
      });
      expandedPermissionKeys.value = collectPermissionIds(permissionTree.value);
    } finally {
      loadingPermissions.value = false;
    }
  }

  async function loadInitialData() {
    await Promise.all([loadApplications(), loadPermissionTree()]);
  }

  function handlePermissionSearch(values: FilterValues) {
    permissionFilterValues.value = values;
    loadPermissionTree();
  }

  function handlePermissionReset(values: FilterValues) {
    permissionFilterValues.value = values;
    loadPermissionTree();
  }

  function openCreateDialog() {
    formMode.value = 'create';
    resetFormModel();
    formModel.applicationId =
      toNumberOrUndefined(permissionFilterValues.value.applicationId) ??
      applications.value[0]?.id ??
      null;
    dialogVisible.value = true;
  }

  function openEditDialog() {
    if (!selectedPermission.value) {
      return;
    }

    formMode.value = 'edit';
    resetFormModel();
    applyPermissionToForm(selectedPermission.value);
    dialogVisible.value = true;
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function handlePermissionTypeChange(type: PermissionType) {
    formModel.type = type;
    if (type === 'app') {
      formModel.parentId = null;
    }
  }

  function handleApplicationChange(applicationId: number | null) {
    formModel.applicationId = applicationId;
    formModel.parentId = null;
  }

  function buildCreatePayload(): PermissionCreatePayload {
    return {
      tenantId: formModel.tenantId,
      applicationId: formModel.applicationId || 0,
      parentId: formModel.parentId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      type: formModel.type,
      routePath: formModel.routePath,
      component: formModel.component,
      icon: formModel.icon,
      description: formModel.description,
      status: formModel.status,
      isSystem: formModel.isSystem,
      sort: formModel.sort,
    };
  }

  function buildUpdatePayload(): PermissionUpdatePayload {
    return {
      tenantId: formModel.tenantId,
      applicationId: formModel.applicationId || undefined,
      parentId: formModel.parentId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      type: formModel.type,
      routePath: formModel.routePath,
      component: formModel.component,
      icon: formModel.icon,
      description: formModel.description,
      status: formModel.status,
      sort: formModel.sort,
    };
  }

  async function submitPermissionForm() {
    await formRef.value?.validate();
    submitting.value = true;
    try {
      if (formMode.value === 'create') {
        await createPermission(buildCreatePayload());
      } else if (formModel.id) {
        await updatePermission(formModel.id, buildUpdatePayload());
      }

      closeDialog();
      await loadPermissionTree();
    } finally {
      submitting.value = false;
    }
  }

  function confirmToggleSelectedPermission() {
    const permission = selectedPermission.value;
    if (!permission) {
      return;
    }

    const nextStatus = permission.status === 1 ? 0 : 1;
    const actionText = nextStatus === 1 ? '启用' : '禁用';
    dialog.warning({
      title: `${actionText}权限`,
      content: `确认${actionText}权限「${permission.displayName || permission.name}」吗？`,
      positiveText: actionText,
      negativeText: '取消',
      onPositiveClick: async () => {
        await updatePermissionStatus(permission.id, { status: nextStatus });
        await loadPermissionTree();
      },
    });
  }

  return {
    applications,
    dialogTitle,
    dialogVisible,
    expandedPermissionKeys,
    formMode,
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
  };
}
