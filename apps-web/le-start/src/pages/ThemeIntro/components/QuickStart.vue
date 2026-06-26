<template>
  <LeCard title="🚀 快速开始" :bordered="false">
    <n-tabs type="line" animated>
      <n-tab-pane name="install" tab="安装">
        <n-code code="pnpm add @lee/theme" language="bash" />
      </n-tab-pane>
      <n-tab-pane name="basic" tab="基础用法">
        <n-code :code="basicUsageCode" language="typescript" />
      </n-tab-pane>
      <n-tab-pane name="vue" tab="在 Vue 中使用">
        <n-code :code="vueUsageCode" language="vue" />
      </n-tab-pane>
    </n-tabs>
  </LeCard>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NCode } from 'naive-ui';

const basicUsageCode = `import { useTheme } from '@lee/theme';

const { theme, mode, setTheme, setMode, config, cssVars } = useTheme();

// 切换主题
setTheme('blue'); // 'red', 'green', etc.

// 切换模式
setMode('dark'); // 'light', 'dark'

// 获取当前配置
console.log(config.value.colors);
console.log(cssVars.value);`;

const vueUsageCode = `<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <App />
  </n-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import { NConfigProvider, lightTheme, darkTheme } from 'naive-ui';
import { useTheme, createNaiveTheme } from '@lee/theme';

const { config, mode } = useTheme();

const naiveTheme = computed(() => 
  mode.value === 'dark' ? darkTheme : lightTheme
);

const themeOverrides = computed(() => 
  createNaiveTheme(config.value)
);
<\/script>`;
</script>
