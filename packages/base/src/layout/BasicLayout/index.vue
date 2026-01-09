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

const appStore = useAppStore();

// 在组件挂载前初始化
onBeforeMount(() => {
  // 获取 appId（从 appStore 或其他方式）
  const appId = appStore.appInfo?.id || 'le-start';

  // 1. 恢复持久化状态
  appStore.restoreState(appId);

  // 2. 启用持久化监听
  useAppPersist(appId);
});
</script>

<style lang="scss" scoped></style>
