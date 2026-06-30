import { computed, reactive, shallowRef } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { FilterValues, TablePagination } from '@lee/ui';
import {
  createUser,
  deleteUser,
  fetchUsers,
  resetUserPassword,
  updateUser,
  type User,
  type UserCreatePayload,
  type UserUpdatePayload,
} from '@/api/users';

export type UserFormMode = 'create' | 'edit';

export interface UserFormModel {
  id?: number;
  tenantId: number;
  username: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  status: number;
}

const initialFormModel = (): UserFormModel => ({
  tenantId: 1,
  username: '',
  email: null,
  phone: null,
  displayName: null,
  avatarUrl: null,
  status: 1,
});

export function useUserManagement() {
  const message = useMessage();
  const dialog = useDialog();

  const tableData = shallowRef<User[]>([]);
  const loading = shallowRef(false);
  const submitting = shallowRef(false);
  const dialogVisible = shallowRef(false);
  const formMode = shallowRef<UserFormMode>('create');
  const formRef = shallowRef<FormInst | null>(null);
  const filterValues = shallowRef<FilterValues>({});

  const pagination = reactive<TablePagination>({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  const formModel = reactive<UserFormModel>(initialFormModel());

  const dialogTitle = computed(() => (formMode.value === 'create' ? '新增用户' : '编辑用户'));

  function resetFormModel() {
    Object.assign(formModel, initialFormModel());
  }

  function applyUserToForm(user: User) {
    Object.assign(formModel, {
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
      email: user.email ?? null,
      phone: user.phone ?? null,
      displayName: user.displayName ?? null,
      avatarUrl: user.avatarUrl ?? null,
      status: user.status,
    });
  }

  async function loadUserList() {
    loading.value = true;
    try {
      const result = await fetchUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        username: filterValues.value.username,
        email: filterValues.value.email,
        phone: filterValues.value.phone,
        status: filterValues.value.status,
        sortBy: 'created_at',
        order: 'desc',
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
    loadUserList();
  }

  function handleReset(values: FilterValues) {
    filterValues.value = values;
    pagination.page = 1;
    loadUserList();
  }

  function handlePageChange(page: number) {
    pagination.page = page;
    loadUserList();
  }

  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadUserList();
  }

  function openCreateDialog() {
    formMode.value = 'create';
    resetFormModel();
    dialogVisible.value = true;
  }

  function openEditDialog(user: User) {
    formMode.value = 'edit';
    resetFormModel();
    applyUserToForm(user);
    dialogVisible.value = true;
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function buildCreatePayload(): UserCreatePayload {
    return {
      tenantId: formModel.tenantId,
      username: formModel.username,
      email: formModel.email,
      phone: formModel.phone,
      displayName: formModel.displayName,
      avatarUrl: formModel.avatarUrl,
      status: formModel.status,
    };
  }

  function buildUpdatePayload(): UserUpdatePayload {
    return {
      tenantId: formModel.tenantId,
      email: formModel.email,
      phone: formModel.phone,
      displayName: formModel.displayName,
      avatarUrl: formModel.avatarUrl,
      status: formModel.status,
    };
  }

  async function submitUserForm() {
    await formRef.value?.validate();
    submitting.value = true;
    try {
      if (formMode.value === 'create') {
        await createUser(buildCreatePayload());
      } else if (formModel.id) {
        await updateUser(formModel.id, buildUpdatePayload());
      }

      closeDialog();
      await loadUserList();
    } finally {
      submitting.value = false;
    }
  }

  function confirmDelete(user: User) {
    dialog.warning({
      title: '删除用户',
      content: `确认删除用户「${user.displayName || user.username}」吗？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteUser(user.id);
        await loadUserList();
      },
    });
  }

  function confirmResetPassword(user: User) {
    dialog.warning({
      title: '重置密码',
      content: `确认重置用户「${user.displayName || user.username}」的密码吗？`,
      positiveText: '重置',
      negativeText: '取消',
      onPositiveClick: async () => {
        const result = await resetUserPassword(user.id);
        message.success(`密码已重置为：${result.initialPassword}`);
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
  };
}
