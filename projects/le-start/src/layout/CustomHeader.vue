<template>
  <CommonHeader>
    <template #header-center>我是自定义header</template>
  </CommonHeader>
</template>

<script setup lang="ts">
import { CommonHeader } from '@base/layout';
defineOptions({
  name: 'CustomHeader',
});
</script>

<style lang="scss" scoped></style>
