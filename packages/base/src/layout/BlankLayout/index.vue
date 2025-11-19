<template>
  <AdminLayout no-heade no-sider no-tabs>
    <template #content>
      <GlobalContent></GlobalContent>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { AdminLayout } from '..';
import GlobalContent from '../Common/GlobalContent/index.vue';
</script>

<style lang="scss" scoped></style>
