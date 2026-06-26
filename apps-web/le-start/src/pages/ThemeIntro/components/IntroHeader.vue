<template>
  <n-card class="intro-header" size="large">
    <div class="header-content">
      <div class="header-text">
        <h1>🎨 主题系统介绍</h1>
        <p>
          基于 CSS 变量和 Naive UI 的现代化主题系统，支持 12
          种预设主题、明暗模式切换、实时主题定制等功能
        </p>
        <n-space style="margin-top: 16px">
          <n-tag :bordered="false" style="background: rgba(255, 255, 255, 0.2); color: white">
            版本 1.0.0
          </n-tag>
          <n-tag :bordered="false" style="background: rgba(255, 255, 255, 0.2); color: white">
            Vue 3 + TypeScript
          </n-tag>
        </n-space>
      </div>
      <n-icon size="100" color="rgba(255,255,255,0.9)">
        <ColorPaletteOutline />
      </n-icon>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NTag, NIcon } from 'naive-ui';
import { ColorPaletteOutline } from '@vicons/ionicons5';
</script>

<style lang="scss" scoped>
.intro-header {
  background: linear-gradient(135deg, var(--le-primary-5) 0%, var(--le-primary-7) 100%);

  :deep(.n-card__content) {
    padding: 32px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    .header-text {
      flex: 1;

      h1 {
        font-size: 32px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: white;
      }

      p {
        font-size: 16px;
        opacity: 0.95;
        margin: 0;
        color: white;
        line-height: 1.6;
      }
    }
  }
}
</style>
