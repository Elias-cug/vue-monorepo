<!--
 * @Description: SVG 图标示例页面
-->
<template>
  <LeContainer>
    <n-card title="SVG 图标组件">
      <n-space vertical :size="24">
        <!-- 基础用法 -->
        <div>
          <h3 class="demo-title">基础用法</h3>
          <n-space :size="20">
            <LeSvgIcon name="home" />
            <LeSvgIcon name="user" />
            <LeSvgIcon name="settings" />
            <LeSvgIcon name="search" />
            <LeSvgIcon name="close" />
            <LeSvgIcon name="menu" />
          </n-space>
        </div>

        <!-- 大小控制 -->
        <div>
          <h3 class="demo-title">大小控制</h3>
          <n-space :size="20" align="center">
            <LeSvgIcon name="home" :size="12" />
            <LeSvgIcon name="home" :size="16" />
            <LeSvgIcon name="home" :size="20" />
            <LeSvgIcon name="home" :size="24" />
            <LeSvgIcon name="home" :size="32" />
            <LeSvgIcon name="home" size="3em" />
          </n-space>
        </div>

        <!-- 颜色控制 -->
        <div>
          <h3 class="demo-title">颜色控制</h3>
          <n-space :size="20">
            <LeSvgIcon name="home" color="var(--le-primary)" />
            <LeSvgIcon name="home" color="var(--le-success)" />
            <LeSvgIcon name="home" color="var(--le-warning)" />
            <LeSvgIcon name="home" color="var(--le-error)" />
            <LeSvgIcon name="home" color="#722ed1" />
            <LeSvgIcon name="home" color="#eb2f96" />
          </n-space>
        </div>

        <!-- 动画效果 -->
        <div>
          <h3 class="demo-title">动画效果</h3>
          <n-space :size="20">
            <LeSvgIcon name="settings" :spin="true" :size="24" />
            <LeSvgIcon name="search" class-name="is-pulse" :size="24" />
            <LeSvgIcon name="home" :rotate="45" :size="24" />
            <LeSvgIcon name="user" :rotate="90" :size="24" />
            <LeSvgIcon name="menu" :rotate="180" :size="24" />
          </n-space>
        </div>

        <!-- 交互效果 -->
        <div>
          <h3 class="demo-title">交互效果</h3>
          <n-space :size="20">
            <LeSvgIcon name="home" class-name="hover-scale" :size="24" />
            <LeSvgIcon name="user" class-name="hover-rotate" :size="24" />
            <LeSvgIcon name="settings" class-name="hover-color" :size="24" />
          </n-space>
        </div>

        <!-- 组合使用 -->
        <div>
          <h3 class="demo-title">组合使用</h3>
          <n-space :size="20">
            <n-button>
              <template #icon>
                <LeSvgIcon name="home" />
              </template>
              首页
            </n-button>
            <n-button type="primary">
              <template #icon>
                <LeSvgIcon name="search" />
              </template>
              搜索
            </n-button>
            <n-button type="success">
              <template #icon>
                <LeSvgIcon name="settings" :spin="true" />
              </template>
              设置中
            </n-button>
          </n-space>
        </div>

        <!-- 图标列表 -->
        <div>
          <h3 class="demo-title">所有可用图标</h3>
          <n-grid :cols="6" :x-gap="12" :y-gap="12">
            <n-grid-item v-for="icon in allIcons" :key="icon">
              <div class="icon-item">
                <LeSvgIcon :name="icon" :size="24" />
                <span class="icon-name">{{ icon }}</span>
              </div>
            </n-grid-item>
          </n-grid>
        </div>
      </n-space>
    </n-card>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LeSvgIcon, Container as LeContainer } from '@lee/ui';

// 预设的图标列表
const allIcons = ref<string[]>(['home', 'user', 'settings', 'search', 'close', 'menu']);
</script>

<style lang="scss" scoped>
.demo-title {
  margin-bottom: 16px;
  color: var(--le-text-1);
  font-size: 16px;
  font-weight: 500;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--le-border);
  border-radius: var(--le-radius-md);
  background-color: var(--le-card);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--le-primary);
    box-shadow: var(--le-shadow-1);
    transform: translateY(-2px);

    :deep(.le-svg-icon) {
      color: var(--le-primary);
    }
  }

  .icon-name {
    margin-top: 8px;
    font-size: 12px;
    color: var(--le-text-3);
  }
}

// 交互效果样式 - 使用 :deep 选择器穿透 scoped
:deep(.le-svg-icon) {
  &.hover-scale:hover {
    transform: scale(1.3);
    color: var(--le-primary);
  }

  &.hover-rotate:hover {
    transform: rotate(180deg);
    color: var(--le-success);
  }

  &.hover-color:hover {
    color: var(--le-error);
  }
}
</style>
