<template>
  <component :is="CustomHeaderComponent" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@base/store/app';
import CommonHeader from './CommonHeader.vue';
import { computed } from 'vue';

const appStore = useAppStore();
const { CustomHeader } = storeToRefs(appStore);

const CustomHeaderComponent = computed(() => {
  return CustomHeader.value || CommonHeader;
});
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
