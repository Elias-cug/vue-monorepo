<template>
  <AdminLayout no-sider no-tabs>
    <template #header>
      <GlobalHeader></GlobalHeader>
    </template>
    <template #content>
      <GlobalContent></GlobalContent>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { AdminLayout } from '..';
import GlobalHeader from '../Common/GlobalHeader/index.vue';
import GlobalContent from '../Common/GlobalContent/index.vue';
import { useAppPersist } from '../../composables/useAppPersist';
import { useAppStore } from '../../store/app';
import { initApp } from '../../init';

const appStore = useAppStore();

// 在组件挂载前初始化
onBeforeMount(() => {
  // 1. 设置 appId（从 store 中获取）
  initApp(appStore.appInfo.appId);
  
  // 2. 恢复持久化状态
  appStore.restoreState();
  
  // 3. 启用持久化监听（HeaderLayout 不需要持久化所有状态）
  useAppPersist({
    tabs: false,
    activeTab: false,
    collapsed: false, // HeaderLayout 没有侧边栏，不需要持久化 collapsed
  });
});
</script>

<style lang="scss" scoped></style>
