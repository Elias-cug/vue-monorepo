<template>
  <n-tooltip trigger="hover" placement="bottom">
    <template #trigger>
      <n-button quaternary circle @click="openDoc">
        <template #icon>
          <n-icon :size="20">
            <BookOutline />
          </n-icon>
        </template>
      </n-button>
    </template>
    <span>查看文档</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { BookOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NTooltip } from 'naive-ui';

// 文档链接
const DOC_URL = 'https://elias-cug.github.io/le-guide/';

// 打开文档
const openDoc = () => {
  window.open(DOC_URL, '_blank');
};
</script>

<style lang="scss" scoped>
// 无需额外样式，复用 NButton 的默认样式
</style>
