<!--
 * @Description: SVG 图标示例页面
-->
<template>
  <LeContainer overflow="auto">
    <LeCard title="SVG 图标组件" padding="24px">
      <n-space vertical :size="24">
        <!-- 基础用法 - UI 公共图标 -->
        <div>
          <h3 class="demo-title">基础用法（UI 公共图标）</h3>
          <n-space :size="20">
            <LeSvgIcon name="ui-home" />
            <LeSvgIcon name="ui-user" />
            <LeSvgIcon name="ui-settings" />
            <LeSvgIcon name="ui-search" />
            <LeSvgIcon name="ui-close" />
            <LeSvgIcon name="ui-menu" />
          </n-space>
        </div>

        <!-- 项目私有图标 -->
        <div>
          <h3 class="demo-title">项目私有图标（菜单图标）</h3>
          <n-space :size="20">
            <LeSvgIcon name="custom-menu-home" />
            <LeSvgIcon name="custom-menu-theme" />
            <LeSvgIcon name="custom-menu-code" />
          </n-space>
        </div>

        <!-- 大小控制 -->
        <div>
          <h3 class="demo-title">大小控制</h3>
          <n-space :size="20" align="center">
            <LeSvgIcon name="ui-home" :size="12" />
            <LeSvgIcon name="ui-home" :size="16" />
            <LeSvgIcon name="ui-home" :size="20" />
            <LeSvgIcon name="ui-home" :size="24" />
            <LeSvgIcon name="ui-home" :size="32" />
            <LeSvgIcon name="ui-home" size="3em" />
          </n-space>
        </div>

        <!-- 颜色控制 -->
        <div>
          <h3 class="demo-title">颜色控制</h3>
          <n-space :size="20">
            <LeSvgIcon name="ui-home" color="var(--le-primary)" />
            <LeSvgIcon name="ui-home" color="var(--le-success)" />
            <LeSvgIcon name="ui-home" color="var(--le-warning)" />
            <LeSvgIcon name="ui-home" color="var(--le-error)" />
            <LeSvgIcon name="ui-home" color="#722ed1" />
            <LeSvgIcon name="ui-home" color="#eb2f96" />
          </n-space>
        </div>

        <!-- 动画效果 -->
        <div>
          <h3 class="demo-title">动画效果</h3>
          <n-space :size="20">
            <LeSvgIcon name="ui-settings" :spin="true" :size="24" />
            <LeSvgIcon name="ui-search" class-name="is-pulse" :size="24" />
            <LeSvgIcon name="ui-home" :rotate="45" :size="24" />
            <LeSvgIcon name="ui-user" :rotate="90" :size="24" />
            <LeSvgIcon name="ui-menu" :rotate="180" :size="24" />
          </n-space>
        </div>

        <!-- 交互效果 -->
        <div>
          <h3 class="demo-title">交互效果</h3>
          <n-space :size="20">
            <LeSvgIcon name="ui-home" class-name="icon-hover-scale" :size="24" />
            <LeSvgIcon name="ui-user" class-name="icon-hover-rotate" :size="24" />
            <LeSvgIcon name="ui-settings" class-name="icon-hover-color" :size="24" />
          </n-space>
        </div>

        <!-- 组合使用 -->
        <div>
          <h3 class="demo-title">组合使用</h3>
          <n-space :size="20">
            <n-button>
              <template #icon>
                <LeSvgIcon name="ui-home" />
              </template>
              首页
            </n-button>
            <n-button type="primary">
              <template #icon>
                <LeSvgIcon name="ui-search" />
              </template>
              搜索
            </n-button>
            <n-button type="success">
              <template #icon>
                <LeSvgIcon name="ui-settings" :spin="true" />
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
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// UI 公共图标列表
const uiIcons = ref<string[]>([
  'ui-home',
  'ui-user',
  'ui-settings',
  'ui-search',
  'ui-close',
  'ui-menu',
]);

// 项目私有图标列表（菜单图标）
const customIcons = ref<string[]>(['custom-menu-home', 'custom-menu-theme', 'custom-menu-code']);

// 所有图标
const allIcons = ref<string[]>([...uiIcons.value, ...customIcons.value]);
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

    // 直接设置 SVG 图标颜色变化
    .le-svg-icon {
      color: var(--le-primary);
    }
  }

  .icon-name {
    margin-top: 8px;
    font-size: 12px;
    color: var(--le-text-3);
  }
}
</style>

<!-- 为交互效果添加全局样式 -->
<style lang="scss">
// 交互效果样式 - 使用全局样式
.icon-hover-scale:hover {
  transform: scale(1.3);
  color: var(--le-primary);
}

.icon-hover-rotate:hover {
  transform: rotate(180deg);
  color: var(--le-success);
}

.icon-hover-color:hover {
  color: var(--le-error);
}
</style>
