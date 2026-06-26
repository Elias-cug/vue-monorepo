<template>
  <LeCard title="🔧 主题控制面板" :bordered="false">
    <n-grid :x-gap="16" :y-gap="16" :cols="2">
      <n-grid-item>
        <n-h4>明暗模式</n-h4>
        <n-switch v-model:value="isDark" size="large" @update:value="handleModeChange">
          <template #checked>暗黑模式</template>
          <template #unchecked>浅色模式</template>
        </n-switch>
      </n-grid-item>

      <n-grid-item>
        <n-h4>当前主题</n-h4>
        <n-select :value="theme" :options="themeOptions" @update:value="handleThemeChange" />
      </n-grid-item>
    </n-grid>

    <n-divider />

    <n-h4>实时预览</n-h4>
    <div class="preview-container">
      <div class="preview-box" :style="previewStyle">
        <div class="preview-header">
          <div class="preview-title">预览区域</div>
          <div class="preview-subtitle">主题实时生效</div>
        </div>
        <div class="preview-content">
          <n-space>
            <n-button type="primary">主要按钮</n-button>
            <n-button>默认按钮</n-button>
            <n-button type="info">信息按钮</n-button>
          </n-space>
          <n-divider />
          <n-grid :x-gap="12" :y-gap="12" :cols="3">
            <n-grid-item v-for="i in 6" :key="i">
              <div class="preview-card">
                <div class="preview-card-title">卡片 {{ i }}</div>
                <div class="preview-card-content">内容区域</div>
              </div>
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </div>

    <n-divider />

    <n-h4>当前配置</n-h4>
    <n-descriptions :column="2" bordered>
      <n-descriptions-item label="主题">{{ theme }}</n-descriptions-item>
      <n-descriptions-item label="模式">{{ mode }}</n-descriptions-item>
      <n-descriptions-item label="主色">
        <div style="display: flex; align-items: center; gap: 8px">
          <div
            :style="{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: config.colors.primary,
            }"
          ></div>
          <span>{{ config.colors.primary }}</span>
        </div>
      </n-descriptions-item>
      <n-descriptions-item label="存储键">
        <n-text code>vue-monorepo-theme-config</n-text>
      </n-descriptions-item>
    </n-descriptions>
  </LeCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NGrid,
  NGridItem,
  NH4,
  NSwitch,
  NSelect,
  NDivider,
  NButton,
  NSpace,
  NDescriptions,
  NDescriptionsItem,
  NText,
} from 'naive-ui';
import { useTheme, themePresets } from '@lee/theme';
import type { ThemeName } from '@lee/theme';

const { theme, mode, config, setTheme, setMode } = useTheme();

const isDark = computed({
  get: () => mode.value === 'dark',
  set: value => setMode(value ? 'dark' : 'light'),
});

const themeOptions = computed(() => {
  return Object.entries(themePresets).map(([key, preset]) => ({
    label: preset.label,
    value: key,
  }));
});

const previewStyle = computed(() => ({
  backgroundColor: getCssVar('--le-card'),
  color: getCssVar('--le-text-1'),
  border: `1px solid ${getCssVar('--le-border')}`,
  borderRadius: getCssVar('--le-radius-lg'),
  padding: '20px',
}));

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function handleThemeChange(value: ThemeName) {
  setTheme(value);
}

function handleModeChange(value: boolean) {
  setMode(value ? 'dark' : 'light');
}
</script>

<style lang="scss" scoped>
.preview-container {
  .preview-box {
    transition: all 0.3s ease;

    .preview-header {
      margin-bottom: 20px;

      .preview-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--le-primary);
        margin-bottom: 4px;
      }

      .preview-subtitle {
        font-size: 14px;
        color: var(--le-text-2);
      }
    }

    .preview-card {
      padding: 12px;
      background: var(--le-primary-1);
      border: 1px solid var(--le-primary-3);
      border-radius: var(--le-radius-md);
      transition: all 0.2s ease;

      &:hover {
        background: var(--le-primary-2);
        transform: translateY(-1px);
        box-shadow: var(--le-shadow-1);
      }

      .preview-card-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--le-primary);
        margin-bottom: 4px;
      }

      .preview-card-content {
        font-size: 12px;
        color: var(--le-text-2);
      }
    }
  }
}
</style>
