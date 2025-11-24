<template>
  <AdminLayout>
    <template #sider>
      <GlobalSider></GlobalSider>
    </template>
    <template #header>
      <GlobalHeader></GlobalHeader>
    </template>
    <template #tabs>
      <GlobalTabs></GlobalTabs>
    </template>
    <template #content>
      <GlobalContent></GlobalContent>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { AdminLayout } from '..';
import GlobalSider from '../Common/GlobalSider/index.vue';
import GlobalHeader from '../Common/GlobalHeader/index.vue';
import GlobalContent from '../Common/GlobalContent/index.vue';
import GlobalTabs from '../Common/GlobalTabs/index.vue';
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
  
  // 3. 启用持久化监听
  useAppPersist();
});
</script>

<style lang="scss" scoped></style>
