<!--
 * @Description: LeLeftRightLayout 左右布局全屏示例
-->
<template>
  <LeLeftRightLayout :left-width="260">
      <template #left>
        <div class="sidebar">
          <div class="sidebar__header">
            <LeSvgIcon name="ui-menu" :size="18" />
            <span>导航菜单</span>
          </div>
          <n-menu
            :options="menuOptions"
            :default-value="activeMenu"
            @update:value="handleMenuChange"
          />
        </div>
      </template>
      <template #right>
        <div class="main-content">
          <div class="main-content__header">
            <h2>{{ currentTitle }}</h2>
            <n-space>
              <n-button size="small">
                <template #icon>
                  <LeSvgIcon name="ui-refresh" />
                </template>
                刷新
              </n-button>
              <n-button size="small" type="primary">
                <template #icon>
                  <LeSvgIcon name="ui-add" />
                </template>
                新增
              </n-button>
            </n-space>
          </div>
          <div class="main-content__body">
            <n-card v-if="activeMenu === 'dashboard'" title="数据概览">
              <n-grid :cols="4" :x-gap="16" :y-gap="16">
                <n-grid-item v-for="stat in stats" :key="stat.label">
                  <div class="stat-card">
                    <div class="stat-card__value">{{ stat.value }}</div>
                    <div class="stat-card__label">{{ stat.label }}</div>
                  </div>
                </n-grid-item>
              </n-grid>
            </n-card>

            <n-card v-else-if="activeMenu === 'users'" title="用户列表">
              <n-data-table :columns="userColumns" :data="userData" :bordered="false" />
            </n-card>

            <n-card v-else-if="activeMenu === 'settings'" title="系统设置">
              <n-form label-placement="left" label-width="auto">
                <n-form-item label="站点名称">
                  <n-input placeholder="请输入站点名称" />
                </n-form-item>
                <n-form-item label="站点描述">
                  <n-input type="textarea" placeholder="请输入站点描述" />
                </n-form-item>
                <n-form-item label="开启注册">
                  <n-switch />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary">保存设置</n-button>
                </n-form-item>
              </n-form>
            </n-card>

            <n-card v-else title="欢迎使用">
              <n-empty description="请从左侧菜单选择功能" />
            </n-card>
          </div>
        </div>
      </template>
    </LeLeftRightLayout>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NIcon } from 'naive-ui';
import { 
  HomeOutline, 
  PeopleOutline, 
  SettingsOutline,
  DocumentOutline 
} from '@vicons/ionicons5';

// 当前选中菜单
const activeMenu = ref('dashboard');

// 菜单配置
const menuOptions = [
  {
    label: '数据概览',
    key: 'dashboard',
    icon: () => h(NIcon, null, { default: () => h(HomeOutline) }),
  },
  {
    label: '用户管理',
    key: 'users',
    icon: () => h(NIcon, null, { default: () => h(PeopleOutline) }),
  },
  {
    label: '系统设置',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }),
  },
  {
    label: '文档中心',
    key: 'docs',
    icon: () => h(NIcon, null, { default: () => h(DocumentOutline) }),
  },
];

// 当前标题
const currentTitle = computed(() => {
  const menu = menuOptions.find(m => m.key === activeMenu.value);
  return menu?.label || '欢迎';
});

// 菜单切换
const handleMenuChange = (key: string) => {
  activeMenu.value = key;
};

// 统计数据
const stats = [
  { label: '总用户数', value: '12,345' },
  { label: '今日访问', value: '1,234' },
  { label: '活跃用户', value: '456' },
  { label: '新增用户', value: '78' },
];

// 用户表格列
const userColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  { title: '角色', key: 'role' },
  { title: '状态', key: 'status' },
];

// 用户数据
const userData = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: '正常' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: '普通用户', status: '正常' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: '普通用户', status: '禁用' },
  { id: 4, username: 'editor', email: 'editor@example.com', role: '编辑', status: '正常' },
];
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    color: var(--le-text-1);
    border-bottom: 1px solid var(--le-divider);
  }
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--le-divider);

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--le-text-1);
    }
  }

  &__body {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }
}

.stat-card {
  padding: 20px;
  background: linear-gradient(135deg, var(--le-primary-1) 0%, transparent 100%);
  border-radius: var(--le-radius-md);
  text-align: center;

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: var(--le-primary);
  }

  &__label {
    margin-top: 8px;
    font-size: 14px;
    color: var(--le-text-2);
  }
}
</style>

