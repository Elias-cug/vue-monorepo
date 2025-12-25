<template>
  <LeContainer padding="24px">
    <div class="demo-section">
      <LeCard title="文字按钮模式（默认）">
        <LeOperateGroup :options="textOptions" :data="rowData" />
      </LeCard>

      <LeCard title="按钮模式">
        <LeOperateGroup type="button" :options="buttonOptions" :data="rowData" />
      </LeCard>

      <LeCard title="带图标按钮（按钮模式）">
        <p class="mb-2 text-sm text-gray-500">通过 iconName 属性为按钮添加图标</p>
        <LeOperateGroup type="button" :options="iconButtonOptions" />
      </LeCard>

      <LeCard title="不同类型按钮">
        <LeOperateGroup :options="typeOptions" />
      </LeCard>

      <LeCard title="禁用状态">
        <LeOperateGroup :options="disabledOptions" />
      </LeCard>

      <LeCard title="更多操作下拉（文字模式）">
        <p class="mb-2 text-sm text-gray-500">
          将 more 设为 true 的操作项会收纳到下拉菜单中，显示为省略号图标
        </p>
        <LeOperateGroup :options="moreOptions" />
      </LeCard>

      <LeCard title="更多操作下拉（按钮模式）">
        <p class="mb-2 text-sm text-gray-500">按钮模式下显示为「更多」下拉按钮组</p>
        <LeOperateGroup type="button" :options="moreButtonOptions" />
      </LeCard>

      <LeCard title="在表格中使用">
        <n-table :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th>名称</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.status }}</td>
              <td>
                <LeOperateGroup :options="getTableOptions(item)" :data="item" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </LeCard>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NTable, useMessage } from 'naive-ui';

const message = useMessage();

const rowData = { id: 1, name: '示例数据' };

const textOptions = [
  {
    value: 'edit',
    label: '编辑',
    type: 'primary' as const,
    disabled: false,
    loading: false,
    onClick: ({ data }: any) => message.info(`编辑: ${JSON.stringify(data)}`),
  },
  {
    value: 'delete',
    label: '删除',
    type: 'error' as const,
    disabled: false,
    loading: false,
    onClick: ({ value }: any) => message.warning(`删除操作: ${value}`),
  },
];

const btnLoading = ref(false);

const buttonOptions = computed(() => [
  {
    value: 'view',
    label: '查看',
    type: 'primary' as const,
    onClick: () => message.info('查看详情'),
  },
  {
    value: 'edit',
    label: '编辑',
    type: 'warning' as const,
    onClick: () => message.info('编辑'),
  },
  {
    value: 'save',
    label: '保存',
    type: 'success' as const,
    loading: btnLoading.value,
    onClick: () => {
      btnLoading.value = true;
      setTimeout(() => {
        btnLoading.value = false;
        message.success('保存成功');
      }, 2000);
    },
  },
]);

const iconButtonOptions = [
  {
    value: 'home',
    label: '首页',
    type: 'primary' as const,
    iconName: 'custom-menu-home',
    onClick: () => message.info('首页'),
  },
  {
    value: 'code',
    label: '代码',
    type: 'success' as const,
    iconName: 'custom-menu-code',
    onClick: () => message.info('代码'),
  },
  {
    value: 'theme',
    label: '主题',
    type: 'warning' as const,
    iconName: 'custom-menu-theme',
    onClick: () => message.info('主题'),
  },
];

const typeOptions = [
  {
    value: 'primary',
    label: 'Primary',
    type: 'primary' as const,
    disabled: false,
    loading: false,
    onClick: () => message.info('Primary'),
  },
  {
    value: 'success',
    label: 'Success',
    type: 'success' as const,
    disabled: false,
    loading: false,
    onClick: () => message.success('Success'),
  },
  {
    value: 'warning',
    label: 'Warning',
    type: 'warning' as const,
    disabled: false,
    loading: false,
    onClick: () => message.warning('Warning'),
  },
  {
    value: 'error',
    label: 'Error',
    type: 'error' as const,
    disabled: false,
    loading: false,
    onClick: () => message.error('Error'),
  },
];

const disabledOptions = [
  {
    value: 'enabled',
    label: '可用',
    type: 'primary' as const,
    disabled: false,
    loading: false,
    onClick: () => message.info('可用'),
  },
  {
    value: 'disabled',
    label: '禁用',
    type: 'primary' as const,
    disabled: true,
    loading: false,
    onClick: () => {},
  },
];

const moreOptions = [
  {
    value: 'view',
    label: '查看',
    type: 'primary' as const,
    onClick: () => message.info('查看'),
  },
  {
    value: 'edit',
    label: '编辑',
    type: 'warning' as const,
    onClick: () => message.info('编辑'),
  },
  {
    value: 'copy',
    label: '复制',
    more: true,
    onClick: () => message.info('复制'),
  },
  {
    value: 'move',
    label: '移动',
    more: true,
    onClick: () => message.info('移动'),
  },
  {
    value: 'archive',
    label: '归档',
    more: true,
    onClick: () => message.info('归档'),
  },
  {
    value: 'delete',
    label: '删除',
    more: true,
    disabled: true,
    onClick: () => message.warning('删除'),
  },
];

const moreButtonOptions = [
  {
    value: 'create',
    label: '新建',
    type: 'primary' as const,
    onClick: () => message.info('新建'),
  },
  {
    value: 'import',
    label: '导入',
    type: 'success' as const,
    onClick: () => message.info('导入'),
  },
  {
    value: 'export',
    label: '导出',
    more: true,
    onClick: () => message.info('导出'),
  },
  {
    value: 'print',
    label: '打印',
    more: true,
    onClick: () => message.info('打印'),
  },
  {
    value: 'refresh',
    label: '刷新',
    more: true,
    onClick: () => message.info('刷新'),
  },
];

const tableData = [
  { id: 1, name: '项目 A', status: '进行中' },
  { id: 2, name: '项目 B', status: '已完成' },
  { id: 3, name: '项目 C', status: '待开始' },
];

function getTableOptions(item: any) {
  return [
    {
      value: 'view',
      label: '查看',
      type: 'primary' as const,
      onClick: () => message.info(`查看: ${item.name}`),
    },
    {
      value: 'edit',
      label: '编辑',
      type: 'warning' as const,
      disabled: item.status === '已完成',
      onClick: () => message.info(`编辑: ${item.name}`),
    },
    {
      value: 'copy',
      label: '复制',
      more: true,
      onClick: () => message.info(`复制: ${item.name}`),
    },
    {
      value: 'delete',
      label: '删除',
      type: 'error' as const,
      more: true,
      onClick: () => message.warning(`删除: ${item.name}`),
    },
  ];
}
</script>

<style lang="scss" scoped>
.demo-section {
  @apply flex flex-col gap-4;
}
</style>
