import { computed, reactive, shallowRef } from 'vue';
import { useDialog } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { FilterValues } from '@lee/ui';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizationTree,
  updateOrganization,
  type Organization,
  type OrganizationCreatePayload,
  type OrganizationUpdatePayload,
} from '@/api/organizations';

export type OrganizationFormMode = 'create' | 'edit';

export interface OrganizationFormModel {
  id?: number;
  tenantId: number;
  parentId: number | null;
  name: string;
  code: string;
  orgType: string;
  sortOrder: number;
  status: number;
  remark: string | null;
}

const initialFormModel = (): OrganizationFormModel => ({
  tenantId: 1,
  parentId: null,
  name: '',
  code: '',
  orgType: 'department',
  sortOrder: 0,
  status: 1,
  remark: null,
});

export function useOrganizationManagement() {
  const dialog = useDialog();

  const treeData = shallowRef<Organization[]>([]);
  const loading = shallowRef(false);
  const submitting = shallowRef(false);
  const dialogVisible = shallowRef(false);
  const formMode = shallowRef<OrganizationFormMode>('create');
  const formRef = shallowRef<FormInst | null>(null);
  const filterValues = shallowRef<FilterValues>({});

  const formModel = reactive<OrganizationFormModel>(initialFormModel());

  const dialogTitle = computed(() => (formMode.value === 'create' ? '新增组织' : '编辑组织'));

  function resetFormModel() {
    Object.assign(formModel, initialFormModel());
  }

  function applyOrganizationToForm(organization: Organization) {
    Object.assign(formModel, {
      id: organization.id,
      tenantId: organization.tenantId,
      parentId: organization.parentId ?? null,
      name: organization.name,
      code: organization.code,
      orgType: organization.orgType,
      sortOrder: organization.sortOrder,
      status: organization.status,
      remark: organization.remark ?? null,
    });
  }

  async function loadOrganizationTree() {
    loading.value = true;
    try {
      treeData.value = await fetchOrganizationTree({
        keyword: filterValues.value.keyword,
        orgType: filterValues.value.orgType,
        status: filterValues.value.status,
      });
    } finally {
      loading.value = false;
    }
  }

  function handleSearch(values: FilterValues) {
    filterValues.value = values;
    loadOrganizationTree();
  }

  function handleReset(values: FilterValues) {
    filterValues.value = values;
    loadOrganizationTree();
  }

  function openCreateDialog(parent?: Organization) {
    formMode.value = 'create';
    resetFormModel();
    if (parent) {
      formModel.tenantId = parent.tenantId;
      formModel.parentId = parent.id;
    }
    dialogVisible.value = true;
  }

  function openEditDialog(organization: Organization) {
    formMode.value = 'edit';
    resetFormModel();
    applyOrganizationToForm(organization);
    dialogVisible.value = true;
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function buildCreatePayload(): OrganizationCreatePayload {
    return {
      tenantId: formModel.tenantId,
      parentId: formModel.parentId,
      name: formModel.name,
      code: formModel.code,
      orgType: formModel.orgType,
      sortOrder: formModel.sortOrder,
      status: formModel.status,
      remark: formModel.remark,
    };
  }

  function buildUpdatePayload(): OrganizationUpdatePayload {
    return {
      tenantId: formModel.tenantId,
      parentId: formModel.parentId,
      name: formModel.name,
      code: formModel.code,
      orgType: formModel.orgType,
      sortOrder: formModel.sortOrder,
      status: formModel.status,
      remark: formModel.remark,
    };
  }

  async function submitOrganizationForm() {
    await formRef.value?.validate();
    submitting.value = true;
    try {
      if (formMode.value === 'create') {
        await createOrganization(buildCreatePayload());
      } else if (formModel.id) {
        await updateOrganization(formModel.id, buildUpdatePayload());
      }

      closeDialog();
      await loadOrganizationTree();
    } finally {
      submitting.value = false;
    }
  }

  function confirmDelete(organization: Organization) {
    dialog.warning({
      title: '删除组织',
      content: `确认删除组织「${organization.name}」吗？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteOrganization(organization.id);
        await loadOrganizationTree();
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
  };
}
