<template>
  <div class="global-sider">
    <div class="global-sider-content">
      <n-config-provider :theme-overrides="themeOverrides">
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menus"
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
import { storeToRefs } from 'pinia';
import { LayoutSidebarLeftCollapse, LayoutSidebarRightCollapse } from '@vicons/tabler';
import { useAppStore, useAuthStore } from '../../../store';

const appStore = useAppStore();
const authStore = useAuthStore();

const { collapsed } = storeToRefs(appStore);
const { menus } = storeToRefs(authStore);

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
  },
};

const changeCollapsed = () => {
  appStore.switchCollapsed();
};
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
