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
import { onMounted } from 'vue';
import { NConfigProvider } from 'naive-ui';

// 全局主题配置 - 使用 theme 包提供的配置
const themeOverrides = {
  common: {
    primaryColor: '#007bff',
    primaryColorHover: '#0056b3',
    primaryColorPressed: '#004085',
    primaryColorSuppl: '#0056b3',
  },
};

onMounted(() => {});
</script>
