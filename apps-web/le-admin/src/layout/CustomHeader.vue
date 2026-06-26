<template>
  <CommonHeader :show-opts="['user', 'theme']"></CommonHeader>
</template>

<script setup lang="ts">
import { CommonHeader } from '@base/layout';
defineOptions({
  name: 'CustomHeader',
});
</script>

<style lang="scss" scoped></style>
