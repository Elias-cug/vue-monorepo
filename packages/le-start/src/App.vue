<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { NConfigProvider, NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui';
import { useTheme, createNaiveLightTheme, createNaiveDarkTheme } from '@lee/theme';

// 使用主题系统
const { config, mode, initTheme } = useTheme();

// 初始化主题
onMounted(() => {
  // 从 localStorage 获取保存的主题，如果没有则使用默认值
  const savedTheme = localStorage.getItem('app-theme') || 'blue';
  const savedMode = localStorage.getItem('app-mode') || 'light';

  initTheme({
    theme: savedTheme as any,
    mode: savedMode as 'light' | 'dark',
  });
});

// Naive UI 基础主题
// 按照官方推荐：浅色模式用 null，深色模式用 darkTheme
const naiveTheme = computed(() => {
  return mode.value === 'dark' ? darkTheme : null;
});

// Naive UI 主题覆盖
// 根据模式使用不同的覆盖配置
const themeOverrides = computed(() => {
  return mode.value === 'dark'
    ? createNaiveDarkTheme(config.value) // 深色模式覆盖（配合 darkTheme 使用）
    : createNaiveLightTheme(config.value); // 浅色模式覆盖（配合 null 使用）
});
</script>
