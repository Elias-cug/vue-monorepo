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
import { AdminLayout } from '..';
import GlobalHeader from '../Common/GlobalHeader/index.vue';
import GlobalContent from '../Common/GlobalContent/index.vue';
import { useAppPersist } from '../../composables/useAppPersist';

// 启用 app 状态持久化
useAppPersist({
  tabs: false,
  activeTab: false,
  collapsed: false, // HeaderLayout 没有侧边栏，不需要持久化 collapsed
});
</script>

<style lang="scss" scoped></style>
