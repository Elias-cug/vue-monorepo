<template>
  <div class="global-sider">
    <div class="global-sider-content">
      <n-config-provider :theme-overrides="menuThemeOverrides">
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
        color="#ffffff"
        :size="24"
        :component="LayoutSidebarRightCollapse"
      ></n-icon>
      <n-icon v-else :size="24" color="#ffffff" :component="LayoutSidebarLeftCollapse"></n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { NConfigProvider } from 'naive-ui';
import { CloudFog, LayoutSidebarLeftCollapse, LayoutSidebarRightCollapse } from '@vicons/tabler';
import { createSidebarMenuTheme } from '@lee/theme';
import { useAppStore, useAuthStore } from '../../../store';
import { useRouter, useRoute } from 'vue-router';

const appStore = useAppStore();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const { collapsed } = storeToRefs(appStore);
const { menus, flatMenus } = storeToRefs(authStore);

// 侧边栏菜单主题配置（白色文字）
const menuThemeOverrides = computed(() => ({
  Menu: createSidebarMenuTheme(),
}));

// 当前激活的菜单项
const activeMenuKey = ref<string | null>(null);
// 保存最后一次内部路由的菜单 key
const lastInternalMenuKey = ref<string | null>(null);

// 根据路由路径找到对应的菜单 key
function getMenuKeyByPath(path: string): string | null {
  const menu = flatMenus.value.find(m => m.path === path);
  return menu?.key || null;
}

// 判断菜单项是否为外链
function isExternalLink(key: string | null): boolean {
  if (!key) return false;
  const menu = flatMenus.value.find(m => m.key === key);
  return !!menu?.meta?.href;
}

// 监听路由变化，更新激活的菜单项
watch(
  () => route.path,
  newPath => {
    const menuKey = getMenuKeyByPath(newPath);
    activeMenuKey.value = menuKey;
    // 保存非外链的菜单 key
    if (menuKey && !isExternalLink(menuKey)) {
      lastInternalMenuKey.value = menuKey;
    }
  },
  { immediate: true }
);

// 监听 activeMenuKey 变化，如果选中外链则恢复上次的内部菜单高亮
watch(activeMenuKey, (newKey) => {
  if (newKey && isExternalLink(newKey)) {
    // 延迟恢复，避免与 v-model 冲突
    nextTick(() => {
      activeMenuKey.value = lastInternalMenuKey.value;
    });
  }
});

const changeCollapsed = () => {
  appStore.switchCollapsed();
};

function handleMenuClick(_key: string, item: any) {
  console.log('item--', item);
  if (item.meta.href) {
    window.open(item.meta.href, '_blank');
    return;
  }
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
