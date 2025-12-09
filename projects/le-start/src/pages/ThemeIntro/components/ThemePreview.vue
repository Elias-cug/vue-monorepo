<template>
  <LeCard title="🎨 主题预览" :bordered="false">
    <n-grid :x-gap="16" :y-gap="16" :cols="4">
      <n-grid-item v-for="(preset, key) in themePresets" :key="key">
        <div
          class="theme-preview-card"
          :class="{ active: theme === key }"
          @click="handleThemeChange(key as ThemeName)"
        >
          <div class="color-blocks">
            <div
              v-for="i in 10"
              :key="i"
              class="color-block"
              :style="{ background: getColorFromPreset(preset, i) }"
            />
          </div>
          <div class="theme-info">
            <div class="theme-name">{{ preset.label }}</div>
            <div class="theme-key">{{ key }}</div>
            <div class="theme-primary" :style="{ background: preset.primaryColor }"></div>
          </div>
        </div>
      </n-grid-item>
    </n-grid>
  </LeCard>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from 'naive-ui';
import { Card as LeCard } from '@lee/ui';
import { useTheme, themePresets } from '@lee/theme';
import type { ThemeName } from '@lee/theme';

const { theme, mode, setTheme } = useTheme();

function getColorFromPreset(preset: any, index: number) {
  const palette = mode.value === 'dark' ? preset.dark : preset.light;
  return palette.primaryPalette?.[index] || palette.primary;
}

function handleThemeChange(value: ThemeName) {
  setTheme(value);
}
</script>

<style lang="scss" scoped>
.theme-preview-card {
  padding: 12px;
  border: 2px solid transparent;
  border-radius: var(--le-radius-lg);
  background: var(--le-card);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--le-shadow-2);
  }

  &.active {
    border-color: var(--le-primary);
    box-shadow: 0 0 0 3px var(--le-primary-1);
  }

  .color-blocks {
    display: flex;
    gap: 2px;
    margin-bottom: 12px;
    height: 32px;
    border-radius: 4px;
    overflow: hidden;

    .color-block {
      flex: 1;
      transition: transform 0.2s;

      &:hover {
        transform: scaleY(1.2);
      }
    }
  }

  .theme-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .theme-name {
      font-weight: 500;
      color: var(--le-text-1);
    }

    .theme-key {
      font-size: 12px;
      color: var(--le-text-3);
    }

    .theme-primary {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-left: auto;
      box-shadow: var(--le-shadow-1);
    }
  }
}
</style>
