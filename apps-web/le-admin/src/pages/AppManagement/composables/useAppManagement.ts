import { computed, reactive, shallowRef } from 'vue';
import { useDialog } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { FilterValues, TablePagination } from '@lee/ui';
import {
  createApplication,
  fetchApplications,
  updateApplication,
  updateApplicationStatus,
  type Application,
  type ApplicationCreatePayload,
  type ApplicationUpdatePayload,
} from '@/api/applications';

export type AppFormMode = 'create' | 'edit';

export interface AppFormModel {
  id?: number;
  tenantId: number;
  code: string;
  name: string;
  displayName: string | null;
  entryUrl: string | null;
  icon: string | null;
  description: string | null;
  status: number;
  sort: number;
}

const initialFormModel = (): AppFormModel => ({
  tenantId: 1,
  code: '',
  name: '',
  displayName: null,
  entryUrl: null,
  icon: null,
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

export function useAppManagement() {
  const dialog = useDialog();

  const tableData = shallowRef<Application[]>([]);
  const loading = shallowRef(false);
  const submitting = shallowRef(false);
  const dialogVisible = shallowRef(false);
  const formMode = shallowRef<AppFormMode>('create');
  const formRef = shallowRef<FormInst | null>(null);
  const filterValues = shallowRef<FilterValues>({});

  const pagination = reactive<TablePagination>({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  const formModel = reactive<AppFormModel>(initialFormModel());

  const dialogTitle = computed(() => (formMode.value === 'create' ? '新增应用' : '编辑应用'));

  function resetFormModel() {
    Object.assign(formModel, initialFormModel());
  }

  function applyApplicationToForm(application: Application) {
    Object.assign(formModel, {
      id: application.id,
      tenantId: application.tenantId ?? 1,
      code: application.code,
      name: application.name,
      displayName: application.displayName ?? null,
      entryUrl: application.entryUrl ?? null,
      icon: application.icon ?? null,
      description: application.description ?? null,
      status: application.status,
      sort: application.sort,
    });
  }

  async function loadApplicationList() {
    loading.value = true;
    try {
      const result = await fetchApplications({
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
    loadApplicationList();
  }

  function handleReset(values: FilterValues) {
    filterValues.value = values;
    pagination.page = 1;
    loadApplicationList();
  }

  function handlePageChange(page: number) {
    pagination.page = page;
    loadApplicationList();
  }

  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadApplicationList();
  }

  function openCreateDialog() {
    formMode.value = 'create';
    resetFormModel();
    dialogVisible.value = true;
  }

  function openEditDialog(application: Application) {
    formMode.value = 'edit';
    resetFormModel();
    applyApplicationToForm(application);
    dialogVisible.value = true;
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function buildCreatePayload(): ApplicationCreatePayload {
    return {
      tenantId: formModel.tenantId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      entryUrl: formModel.entryUrl,
      icon: formModel.icon,
      description: formModel.description,
      status: formModel.status,
      sort: formModel.sort,
    };
  }

  function buildUpdatePayload(): ApplicationUpdatePayload {
    return {
      tenantId: formModel.tenantId,
      code: formModel.code,
      name: formModel.name,
      displayName: formModel.displayName,
      entryUrl: formModel.entryUrl,
      icon: formModel.icon,
      description: formModel.description,
      status: formModel.status,
      sort: formModel.sort,
    };
  }

  async function submitApplicationForm() {
    await formRef.value?.validate();
    submitting.value = true;
    try {
      if (formMode.value === 'create') {
        await createApplication(buildCreatePayload());
      } else if (formModel.id) {
        await updateApplication(formModel.id, buildUpdatePayload());
      }

      closeDialog();
      await loadApplicationList();
    } finally {
      submitting.value = false;
    }
  }

  function confirmToggleStatus(application: Application) {
    const nextStatus = application.status === 1 ? 0 : 1;
    const actionText = nextStatus === 1 ? '启用' : '禁用';

    dialog.warning({
      title: `${actionText}应用`,
      content: `确认${actionText}应用「${application.displayName || application.name}」吗？`,
      positiveText: actionText,
      negativeText: '取消',
      onPositiveClick: async () => {
        await updateApplicationStatus(application.id, { status: nextStatus });
        await loadApplicationList();
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
    loadApplicationList,
    openCreateDialog,
    openEditDialog,
    submitApplicationForm,
  };
}
