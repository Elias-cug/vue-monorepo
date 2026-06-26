<template>
  <LeCard title="📖 API 文档" :bordered="false">
    <n-tabs type="segment" animated>
      <n-tab-pane name="useTheme" tab="useTheme">
        <n-h3>useTheme Composable</n-h3>
        <n-text>主题管理的核心 API，提供主题切换、模式切换等功能。</n-text>
        <n-code :code="useThemeApiCode" language="typescript" />
        <n-divider />
        <n-h4>返回值说明</n-h4>
        <n-table :columns="useThemeColumns" :data="useThemeData" />
      </n-tab-pane>

      <n-tab-pane name="createNaiveTheme" tab="createNaiveTheme">
        <n-h3>createNaiveTheme</n-h3>
        <n-text>创建 Naive UI 主题配置的函数。</n-text>
        <n-code :code="createNaiveThemeCode" language="typescript" />
      </n-tab-pane>

      <n-tab-pane name="menuTheme" tab="菜单主题函数">
        <n-h3>菜单主题函数</n-h3>
        <n-text>专门的菜单主题配置函数。</n-text>
        <n-code :code="menuThemeCode" language="typescript" />
      </n-tab-pane>
    </n-tabs>
  </LeCard>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NCode, NTable, NDivider, NText, NH3, NH4 } from 'naive-ui';

const useThemeApiCode = `interface UseThemeReturn {
  theme: ComputedRef<ThemeName>;      // 当前主题名称
  mode: ComputedRef<ThemeMode>;       // 当前模式（light/dark）
  config: ComputedRef<ThemeConfig>;   // 主题配置对象
  cssVars: ComputedRef<CssVariables>; // CSS 变量对象
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  initTheme: () => void;
}

// 使用示例
const { theme, mode, setTheme, setMode } = useTheme();`;

const createNaiveThemeCode = `import { createNaiveTheme } from '@lee/theme';

// 创建 Naive UI 主题配置
const themeOverrides = createNaiveTheme(themeConfig);

// 在 n-config-provider 中使用
<n-config-provider :theme-overrides="themeOverrides">
  <!-- 你的应用 -->
</n-config-provider>`;

const menuThemeCode = `import { createSidebarMenuTheme, createDefaultMenuTheme } from '@lee/theme';

// 侧边栏菜单（白色文字）
const sidebarTheme = createSidebarMenuTheme();

// 普通菜单（自适应明暗）
const defaultTheme = createDefaultMenuTheme(colors, isDark);

// 在组件中使用
<n-config-provider :theme-overrides="{ Menu: sidebarTheme }">
  <n-menu ... />
</n-config-provider>`;

const useThemeColumns = [
  { title: '属性/方法', key: 'name' },
  { title: '类型', key: 'type' },
  { title: '说明', key: 'description' },
];

const useThemeData = [
  { name: 'theme', type: 'ComputedRef<ThemeName>', description: '当前主题名称' },
  { name: 'mode', type: 'ComputedRef<ThemeMode>', description: '当前模式（light/dark）' },
  { name: 'config', type: 'ComputedRef<ThemeConfig>', description: '主题配置对象' },
  { name: 'cssVars', type: 'ComputedRef<CssVariables>', description: 'CSS 变量对象' },
  { name: 'setTheme', type: '(theme: ThemeName) => void', description: '设置主题' },
  { name: 'setMode', type: '(mode: ThemeMode) => void', description: '设置模式' },
  { name: 'initTheme', type: '() => void', description: '初始化主题' },
];
</script>
