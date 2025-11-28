<template>
  <div class="global-sider">
    <div class="global-sider-content">
      <n-config-provider :theme-overrides="themeOverrides">
        <n-menu
          v-model:value="activeMenuKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menus"
          :indent="28"
          @update:value="handleMenuClick"
        />
      </n-config-provider>
    </div>

    <div class="global-sider-collapse" @click="changeCollapsed">
      <n-icon
        v-if="collapsed"
        color="#0e7a0d"
        :size="24"
        :component="LayoutSidebarRightCollapse"
      ></n-icon>
      <n-icon v-else :size="24" color="#0e7a0d" :component="LayoutSidebarLeftCollapse"></n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { LayoutSidebarLeftCollapse, LayoutSidebarRightCollapse } from '@vicons/tabler';
import { useAppStore, useAuthStore } from '../../../store';
import { useRouter, useRoute } from 'vue-router';

const appStore = useAppStore();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const { collapsed } = storeToRefs(appStore);
const { menus, flatMenus } = storeToRefs(authStore);

// 当前激活的菜单项
const activeMenuKey = ref<string | null>(null);

// 根据路由路径找到对应的菜单 key
function getMenuKeyByPath(path: string): string | null {
  const menu = flatMenus.value.find(m => m.path === path);
  return menu?.key || null;
}

// 监听路由变化，更新激活的菜单项
watch(
  () => route.path,
  newPath => {
    activeMenuKey.value = getMenuKeyByPath(newPath);
  },
  { immediate: true }
);

const themeOverrides = {
  Menu: {
    itemTextColor: '#fff',
    itemTextColorActive: '#fff',
    itemTextColorHover: '#fff',
    itemTextColorPressed: '#fff',
    itemTextColorDisabled: '#fff',
    itemIconColor: '#fff',
    itemIconColorActive: '#fff',
    itemIconColorHover: '#fff',
    itemIconColorPressed: '#fff',
    itemIconColorDisabled: '#fff',

    itemIconColorCollapsed: '#fff',
    // 移入背景
    itemColorHover: '#1890ff',
    // 点击背景
    itemColorPressed: '#1890ff',
    itemColorActive: '#1890ff',
    // 禁用背景
    itemColorDisabled: '#1890ff',

    // 下拉箭头颜色
    arrowColor: '#fff',
    arrowColorHover: '#fff',
    arrowColorActive: '#fff',
    arrowColorActiveHover: '#fff',
  },
};

const changeCollapsed = () => {
  appStore.switchCollapsed();
};

function handleMenuClick(_key: string, item: any) {
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
