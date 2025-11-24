<template>
  <AdminLayout no-header no-sider no-tabs>
    <template #content>
      <GlobalContent></GlobalContent>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { AdminLayout } from '..';
import GlobalContent from '../Common/GlobalContent/index.vue';
import { useAppPersist } from '../../composables/useAppPersist';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();

// 在组件挂载前初始化
onBeforeMount(() => {
  // 注意：appId 已在路由守卫中设置（guard.ts）

  // 1. 恢复持久化状态
  appStore.restoreState();

  // 2. 启用持久化监听（BlankLayout 不需要持久化所有状态）
  useAppPersist({
    tabs: false, // BlankLayout 通常不显示 tabs
    activeTab: false,
    collapsed: false, // BlankLayout 没有侧边栏
  });
});
</script>

<style lang="scss" scoped></style>
