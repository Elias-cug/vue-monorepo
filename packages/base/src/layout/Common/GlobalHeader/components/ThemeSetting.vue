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
import { ref } from 'vue';
import { ColorPaletteOutline, CheckmarkOutline } from '@vicons/ionicons5';
import { NPopover, NButton, NIcon } from 'naive-ui';
import { getThemeOptions } from '@lee/theme';

// 从 theme 包获取主题配置
const themeOptions = getThemeOptions();

// 当前主题
const currentTheme = ref('light');

// 主题切换事件
const emit = defineEmits<{
  change: [theme: string];
}>();

// 处理主题切换
const handleThemeChange = (theme: string) => {
  currentTheme.value = theme;
  console.log('切换主题到：', theme);
};
</script>

<style lang="scss" scoped>
.theme-setting {
  padding: 12px;
  min-width: 280px;

  .theme-setting-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--le-text);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--le-border-soft);
  }

  .theme-setting-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .theme-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--le-bg-soft);
    }

    &.active {
      background-color: var(--le-bg-muted);
    }

    .theme-color {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .theme-label {
      font-size: 12px;
      color: var(--le-text-soft);
      white-space: nowrap;
    }
  }
}
</style>
