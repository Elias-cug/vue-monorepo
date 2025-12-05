<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { useTheme, createNaiveOverrides } from '@lee/theme';

const { currentTheme } = useTheme();

// 全局主题配置 - 使用 theme 包提供的配置
const themeOverrides = computed(() => {
  return createNaiveOverrides(currentTheme.value);
});

onMounted(() => {});
</script>
