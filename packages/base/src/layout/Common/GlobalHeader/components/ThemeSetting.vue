<template>
  <n-popover trigger="click" placement="bottom" :show-arrow="false">
    <template #trigger>
      <n-button quaternary circle>
        <template #icon>
          <n-icon :size="20">
            <ColorPaletteOutline />
          </n-icon>
        </template>
      </n-button>
    </template>
    <div class="theme-setting">
      <div class="theme-setting-title">主题设置</div>

      <!-- 明暗模式切换 -->
      <div class="mode-switch">
        <span class="mode-label">深色模式</span>
        <n-switch v-model:value="isDark" @update:value="handleModeChange">
          <template #checked-icon>
            <n-icon>
              <MoonOutline />
            </n-icon>
          </template>
          <template #unchecked-icon>
            <n-icon>
              <SunnyOutline />
            </n-icon>
          </template>
        </n-switch>
      </div>

      <!-- 主题列表 -->
      <div class="theme-setting-list">
        <div
          v-for="theme in themeOptions"
          :key="theme.name"
          class="theme-item"
          :class="{ active: currentTheme === theme.name }"
          @click="handleThemeChange(theme.name)"
        >
          <div class="theme-color" :style="{ backgroundColor: theme.color }">
            <n-icon v-if="currentTheme === theme.name" :size="16" color="#fff">
              <CheckmarkOutline />
            </n-icon>
          </div>
          <span class="theme-label">{{ theme.label }}</span>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ColorPaletteOutline,
  CheckmarkOutline,
  MoonOutline,
  SunnyOutline,
} from '@vicons/ionicons5';
import { NPopover, NButton, NIcon, NSwitch } from 'naive-ui';
import { useTheme, themePresets } from '@lee/theme';
import type { ThemeName } from '@lee/theme';

// 使用主题 composable
const { theme, mode, setTheme, setMode } = useTheme();

// 当前主题（theme 已经是响应式的）
const currentTheme = theme;

// 深色模式
const isDark = computed({
  get: () => mode.value === 'dark',
  set: value => setMode(value ? 'dark' : 'light'),
});

// 主题选项
const themeOptions = computed(() => {
  return Object.entries(themePresets).map(([name, preset]) => {
    const labels: Record<string, string> = {
      blue: '蓝色',
      red: '红色',
      orange: '橙色',
      green: '绿色',
      purple: '紫色',
      magenta: '品红',
      cyan: '青色',
      geekblue: '极客蓝',
      volcano: '火山橙',
      gold: '金色',
      yellow: '黄色',
      lime: '青柠',
    };

    return {
      name,
      label: labels[name] || name,
      color: preset.primaryColor,
    };
  });
});

// 主题切换事件
const emit = defineEmits<{
  change: [theme: ThemeName];
}>();

// 处理主题切换
const handleThemeChange = (themeName: string) => {
  setTheme(themeName as ThemeName);
  // 保存到 localStorage
  localStorage.setItem('app-theme', themeName);
  emit('change', themeName as ThemeName);
};

// 处理模式切换
const handleModeChange = (value: boolean) => {
  const newMode = value ? 'dark' : 'light';
  setMode(newMode);
  // 保存到 localStorage
  localStorage.setItem('app-mode', newMode);
};
</script>

<style lang="scss" scoped>
.theme-setting {
  padding: 12px;
  min-width: 320px;

  .theme-setting-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--le-text-primary);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--le-border);
  }

  .mode-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    margin-bottom: 12px;

    .mode-label {
      font-size: 13px;
      color: var(--le-text-secondary);
    }
  }

  .theme-setting-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .theme-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--le-bg-hover);
    }

    &.active {
      background-color: var(--le-bg-active);
    }

    .theme-color {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    &.active .theme-color {
      border-color: var(--le-primary);
    }

    .theme-label {
      font-size: 11px;
      color: var(--le-text-secondary);
      white-space: nowrap;
    }
  }
}
</style>
