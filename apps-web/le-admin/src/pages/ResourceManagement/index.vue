<template>
  <LeLeftRightLayout :left-width="300" :gap="16" right-transparent>
    <template #left>
      <LeCard title="资源" class="resource-management-page__menu-card">
        <div class="resource-management-page__menu-toolbar">
          <NSelect
            v-model:value="selectedApplicationId"
            :options="applicationOptions"
            :loading="applicationLoading"
            filterable
            placeholder="请选择应用"
            @update:value="handleApplicationChange"
          />
          <NButton type="primary" @click="() => handleAddMenu()">
            <template #icon>
              <NIcon :component="AppsOutline" />
            </template>
            新增
          </NButton>
        </div>

        <NTree
          :data="menuTreeData"
          :selected-keys="selectedKeys"
          default-expand-all
          block-line
          selectable
          class="resource-management-page__menu-tree"
          @update:selected-keys="handleMenuSelect"
        >
          <template #arrow>
            <NIcon :component="ChevronForward" />
          </template>
        </NTree>
      </LeCard>
    </template>

    <template #right>
      <div class="resource-management-page">
        <LeCard class="resource-management-page__detail-card">
          <div class="resource-management-page__section-header">
            <h3 class="resource-management-page__section-title">
              {{ selectedMenu?.name || '菜单详情' }}
            </h3>
            <LeOperateGroup type="button" :options="menuHeaderOperateOptions" />
          </div>

          <NEmpty v-if="!selectedMenu" description="请选择左侧菜单" />
          <div v-else class="resource-management-page__detail-table">
            <div
              v-for="(row, rowIndex) in detailRows"
              :key="rowIndex"
              class="resource-management-page__detail-row"
            >
              <template v-for="cell in row" :key="cell.label">
                <div class="resource-management-page__detail-label">{{ cell.label }}</div>
                <div class="resource-management-page__detail-value">
                  <NIcon
                    v-if="cell.icon"
                    :component="PersonOutline"
                    class="resource-management-page__detail-icon"
                  />
                  <span>{{ cell.value || '-' }}</span>
                </div>
              </template>
            </div>
          </div>
        </LeCard>

        <LeCard class="resource-management-page__button-card">
          <div class="resource-management-page__section-header">
            <h3 class="resource-management-page__section-title">按钮</h3>
            <LeOperateGroup type="button" :options="buttonHeaderOperateOptions" />
          </div>

          <LeTable
            :columns="buttonColumns"
            :data="buttonTableData"
            :pagination="false"
            :operate-column="buttonOperateColumn"
            :scroll-x="720"
            empty-description="暂无按钮"
            flex-height
          />
        </LeCard>
      </div>
    </template>
  </LeLeftRightLayout>
</template>

<script setup lang="ts">
import { computed, h, onMounted, shallowRef } from 'vue';
import type { DataTableColumn, SelectOption, TreeOption } from 'naive-ui';
import { NButton, NIcon, NTag, useMessage } from 'naive-ui';
import { AppsOutline, ChevronForward, PersonOutline } from '@vicons/ionicons5';
import type { OperateColumnConfig, OperateOption } from '@lee/ui';
import { fetchApplications, type Application } from '@/api/applications';

defineOptions({
  name: 'ResourceManagementPage',
});

type ResourceType = 'menu' | 'button';

interface MenuResource {
  id: number;
  applicationId: number;
  parentId: number | null;
  type: Extract<ResourceType, 'menu'>;
  code: string;
  name: string;
  routePath: string;
  componentPath: string;
  icon: string;
  layout: string;
  visible: boolean;
  status: number;
  keepAlive: boolean;
  sort: number;
  children?: MenuResource[];
}

interface ButtonResource {
  id: number;
  menuId: number;
  type: Extract<ResourceType, 'button'>;
  code: string;
  name: string;
  status: number;
}

type ResourceTreeOption = TreeOption & {
  raw: MenuResource;
  children?: ResourceTreeOption[];
};

const message = useMessage();

const applications = shallowRef<Application[]>([]);
const applicationLoading = shallowRef(false);
const selectedApplicationId = shallowRef<number | null>(null);
const selectedMenuId = shallowRef<number | null>(null);

const fallbackApplications: Application[] = [
  {
    id: 1,
    tenantId: 1,
    code: 'le-admin',
    name: 'le-admin',
    displayName: '管理后台',
    entryUrl: '/le-admin',
    icon: 'menu-app-management',
    description: '管理后台应用',
    status: 1,
    sort: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    tenantId: 1,
    code: 'le-start',
    name: 'le-start',
    displayName: '示例应用',
    entryUrl: '/le-start',
    icon: 'menu-app-management',
    description: '示例应用',
    status: 1,
    sort: 2,
    createdAt: '',
    updatedAt: '',
  },
];

const menuResources: MenuResource[] = [
  {
    id: 101,
    applicationId: 1,
    parentId: null,
    type: 'menu',
    code: 'BaseFeature',
    name: '基础功能',
    routePath: '/base',
    componentPath: '/src/views/base/index.vue',
    icon: 'menu-app-management',
    layout: 'basic',
    visible: true,
    status: 1,
    keepAlive: true,
    sort: 1,
  },
  {
    id: 102,
    applicationId: 1,
    parentId: null,
    type: 'menu',
    code: 'BusinessDemo',
    name: '业务示例',
    routePath: '/demo',
    componentPath: '/src/views/demo/index.vue',
    icon: 'menu-resource-management',
    layout: 'basic',
    visible: true,
    status: 1,
    keepAlive: true,
    sort: 2,
  },
  {
    id: 103,
    applicationId: 1,
    parentId: null,
    type: 'menu',
    code: 'SystemManagement',
    name: '系统管理',
    routePath: '/system',
    componentPath: '/src/views/system/index.vue',
    icon: 'menu-organization-management',
    layout: 'basic',
    visible: true,
    status: 1,
    keepAlive: true,
    sort: 3,
  },
  {
    id: 104,
    applicationId: 1,
    parentId: 103,
    type: 'menu',
    code: 'UserMgt',
    name: '用户管理',
    routePath: '/pms/user',
    componentPath: '/src/views/pms/user/index.vue',
    icon: 'i-fe:user',
    layout: 'basic',
    visible: true,
    status: 1,
    keepAlive: true,
    sort: 3,
  },
  {
    id: 201,
    applicationId: 2,
    parentId: null,
    type: 'menu',
    code: 'GuideHome',
    name: '指南首页',
    routePath: '/guide',
    componentPath: '/src/views/guide/index.vue',
    icon: 'menu-home',
    layout: 'basic',
    visible: true,
    status: 1,
    keepAlive: false,
    sort: 1,
  },
];

const buttonResources: ButtonResource[] = [
  {
    id: 1001,
    menuId: 104,
    type: 'button',
    code: 'AddUser',
    name: '创建新用户',
    status: 1,
  },
  {
    id: 1002,
    menuId: 104,
    type: 'button',
    code: 'EditUser',
    name: '编辑用户',
    status: 1,
  },
  {
    id: 1003,
    menuId: 104,
    type: 'button',
    code: 'DeleteUser',
    name: '删除用户',
    status: 0,
  },
  {
    id: 1004,
    menuId: 201,
    type: 'button',
    code: 'PublishGuide',
    name: '发布指南',
    status: 1,
  },
];

const applicationOptions = computed<SelectOption[]>(() =>
  applications.value.map(application => ({
    label: application.displayName || application.name,
    value: application.id,
  }))
);

const currentApplication = computed(() =>
  applications.value.find(application => application.id === selectedApplicationId.value)
);

const currentMenuRoots = computed(() => {
  if (!selectedApplicationId.value) {
    return [];
  }

  const source = menuResources
    .filter(menu => menu.applicationId === selectedApplicationId.value)
    .map(menu => ({ ...menu, children: [] as MenuResource[] }))
    .sort((first, second) => first.sort - second.sort);
  const nodeMap = new Map(source.map(menu => [menu.id, menu]));
  const roots: MenuResource[] = [];

  source.forEach(menu => {
    if (menu.parentId && nodeMap.has(menu.parentId)) {
      nodeMap.get(menu.parentId)?.children?.push(menu);
      return;
    }

    roots.push(menu);
  });

  return roots;
});

const selectedMenu = computed(() => {
  const allMenus: MenuResource[] = [];

  function walk(menus: MenuResource[]) {
    menus.forEach(menu => {
      allMenus.push(menu);
      if (menu.children?.length) {
        walk(menu.children);
      }
    });
  }

  walk(currentMenuRoots.value);
  return allMenus.find(menu => menu.id === selectedMenuId.value) || null;
});

const selectedKeys = computed(() => (selectedMenuId.value ? [selectedMenuId.value] : []));
const buttonTableData = computed(() => {
  if (!selectedMenu.value) {
    return [];
  }

  return buttonResources.filter(button => button.menuId === selectedMenu.value?.id);
});

const detailRows = computed(() => {
  const menu = selectedMenu.value;

  if (!menu) {
    return [];
  }

  return [
    [
      { label: '编码', value: menu.code },
      { label: '名称', value: menu.name },
    ],
    [
      { label: '路由地址', value: menu.routePath },
      { label: '组件路径', value: menu.componentPath },
    ],
    [
      { label: '菜单图标', value: menu.icon, icon: menu.icon },
      { label: 'layout', value: menu.layout },
    ],
    [
      { label: '是否显示', value: menu.visible ? '是' : '否' },
      { label: '是否启用', value: menu.status === 1 ? '是' : '否' },
    ],
    [
      { label: 'KeepAlive', value: menu.keepAlive ? '是' : '否' },
      { label: '排序', value: String(menu.sort) },
    ],
  ];
});

function toTreeOption(menu: MenuResource): ResourceTreeOption {
  return {
    key: menu.id,
    label: menu.name,
    raw: menu,
    suffix: () =>
      h('div', { class: 'resource-management-page__tree-actions' }, [
        h(
          NButton,
          {
            text: true,
            type: 'primary',
            size: 'small',
            class: 'mr-8px',
            onClick: (event: MouseEvent) => {
              event.stopPropagation();
              handleAddMenu(menu);
            },
          },
          { default: () => '新增' }
        ),
        h(
          NButton,
          {
            text: true,
            type: 'error',
            size: 'small',
            onClick: (event: MouseEvent) => {
              event.stopPropagation();
              handleDeleteMenu(menu);
            },
          },
          { default: () => '删除' }
        ),
      ]),
    children: menu.children?.map(toTreeOption),
  };
}

const menuTreeData = computed<ResourceTreeOption[]>(() => currentMenuRoots.value.map(toTreeOption));

const buttonColumns: DataTableColumn<ButtonResource>[] = [
  {
    title: '名称',
    key: 'name',
    minWidth: 180,
  },
  {
    title: '编码',
    key: 'code',
    minWidth: 180,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render: row =>
      h(
        NTag,
        {
          type: row.status === 1 ? 'success' : 'error',
          size: 'small',
          bordered: false,
        },
        { default: () => (row.status === 1 ? '启用' : '禁用') }
      ),
  },
];

const buttonOperateColumn: OperateColumnConfig = {
  title: '操作',
  width: 180,
  fixed: 'right',
  options: rowData => [
    {
      value: 'edit',
      label: '编辑',
      iconName: 'ui-edit',
      onClick: () => handleEditButton(rowData as ButtonResource),
    },
    {
      value: 'delete',
      label: '删除',
      iconName: 'ui-delete',
      type: 'error',
      onClick: () => handleDeleteButton(rowData as ButtonResource),
    },
  ],
};

const menuHeaderOperateOptions = computed<OperateOption[]>(() => [
  {
    value: 'edit',
    label: '编辑',
    type: 'primary',
    iconName: 'ui-edit',
    disabled: !selectedMenu.value,
    onClick: handleEditMenu,
  },
]);

const buttonHeaderOperateOptions = computed<OperateOption[]>(() => [
  {
    value: 'add',
    label: '新增',
    type: 'primary',
    iconName: 'ui-add',
    disabled: !selectedMenu.value,
    onClick: handleAddButton,
  },
]);

function setDefaultSelectedMenu() {
  selectedMenuId.value = currentMenuRoots.value[0]?.id ?? null;
}

async function loadApplications() {
  applicationLoading.value = true;

  try {
    const result = await fetchApplications({
      page: 1,
      pageSize: 100,
      status: 1,
      sortBy: 'sort',
      order: 'asc',
    });

    applications.value = result.data.length ? result.data : fallbackApplications;
  } catch {
    applications.value = fallbackApplications;
    message.warning('应用列表加载失败，已使用页面示例数据');
  } finally {
    selectedApplicationId.value = applications.value[0]?.id ?? null;
    setDefaultSelectedMenu();
    applicationLoading.value = false;
  }
}

function handleApplicationChange() {
  setDefaultSelectedMenu();
}

function handleMenuSelect(keys: Array<string | number>) {
  selectedMenuId.value = keys.length ? Number(keys[0]) : null;
}

function handleAddMenu(parent?: MenuResource) {
  const target =
    parent?.name ||
    currentApplication.value?.displayName ||
    currentApplication.value?.name ||
    '当前应用';
  message.info(`新增资源：${target}`);
}

function handleDeleteMenu(menu: MenuResource) {
  message.info(`删除菜单：${menu.name}`);
}

function handleEditMenu() {
  if (!selectedMenu.value) {
    return;
  }

  message.info(`编辑菜单：${selectedMenu.value.name}`);
}

function handleAddButton() {
  if (!selectedMenu.value) {
    message.warning('请先选择菜单');
    return;
  }

  message.info(`新增按钮：${selectedMenu.value.name}`);
}

function handleEditButton(button: ButtonResource) {
  message.info(`编辑按钮：${button.name}`);
}

function handleDeleteButton(button: ButtonResource) {
  message.info(`删除按钮：${button.name}`);
}

onMounted(() => {
  loadApplications();
});
</script>

<style lang="scss" scoped>
.resource-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 16px;

  &__menu-card {
    height: 100%;
    :deep(.le-card__content) {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
  }

  &__menu-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__tree-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  :deep(.n-tree-node:hover) &__tree-actions,
  :deep(.n-tree-node--selected) &__tree-actions {
    opacity: 1;
  }

  &__detail-card {
    flex-shrink: 0;
  }

  &__button-card {
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

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__section-title {
    margin: 0;
    color: var(--le-text-1);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__detail-table {
    overflow: hidden;
    border: 1px solid var(--le-border);
    border-radius: 6px;
  }

  &__detail-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr) 160px minmax(0, 1fr);
    min-height: 64px;

    &:not(:last-child) {
      border-bottom: 1px solid var(--le-border);
    }
  }

  &__detail-label,
  &__detail-value {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 0 20px;
    border-right: 1px solid var(--le-border);
    color: var(--le-text-1);
    font-size: 15px;
    line-height: 1.5;

    &:last-child {
      border-right: 0;
    }
  }

  &__detail-label {
    background-color: var(--le-hover);
    font-weight: 600;
  }

  &__detail-value {
    gap: 10px;
    font-weight: 500;

    span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__detail-icon {
    flex-shrink: 0;
    color: var(--le-text-2);
    font-size: 24px;
  }
}

@media (max-width: 1200px) {
  .resource-management-page {
    &__detail-row {
      grid-template-columns: 120px minmax(0, 1fr);
    }

    &__detail-label:nth-child(4n + 3),
    &__detail-value:nth-child(4n + 4) {
      border-top: 1px solid var(--le-border);
    }

    &__detail-label:nth-child(4n + 3) {
      border-left: 0;
    }
  }
}
</style>
