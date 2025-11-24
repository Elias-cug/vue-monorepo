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
import { AdminLayout } from '..';
import GlobalSider from '../Common/GlobalSider/index.vue';
import GlobalHeader from '../Common/GlobalHeader/index.vue';
import GlobalContent from '../Common/GlobalContent/index.vue';
import GlobalTabs from '../Common/GlobalTabs/index.vue';
import { useAppPersist } from '../../composables/useAppPersist';

// 启用 app 状态持久化
useAppPersist();
</script>

<style lang="scss" scoped></style>
