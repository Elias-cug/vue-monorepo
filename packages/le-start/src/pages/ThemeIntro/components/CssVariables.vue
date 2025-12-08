<template>
  <LeCard title="🎯 CSS 变量系统" :bordered="false">
    <n-tabs type="line" animated>
      <n-tab-pane name="colors" tab="颜色变量">
        <n-h4>主题色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="i in 10" :key="`primary-${i}`">
            <ColorDisplay
              :name="`--le-primary-${i}`"
              :value="getCssVar(`--le-primary-${i}`)"
              :label="`色阶 ${i}`"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>文本色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="text in textColors" :key="text.name">
            <ColorDisplay :name="text.name" :value="getCssVar(text.name)" :label="text.label" />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>背景色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="bg in bgColors" :key="bg.name">
            <ColorDisplay :name="bg.name" :value="getCssVar(bg.name)" :label="bg.label" />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <n-tab-pane name="design" tab="设计变量">
        <n-h4>间距系统</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="7">
          <n-grid-item v-for="spacing in spacingList" :key="spacing">
            <DesignToken
              type="spacing"
              :name="`--le-spacing-${spacing}`"
              :value="getCssVar(`--le-spacing-${spacing}`)"
              :label="spacing"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>圆角系统</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="7">
          <n-grid-item v-for="radius in radiusList" :key="radius">
            <DesignToken
              type="radius"
              :name="`--le-radius-${radius}`"
              :value="getCssVar(`--le-radius-${radius}`)"
              :label="radius"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>字体大小</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="8">
          <n-grid-item v-for="fontSize in fontSizeList" :key="fontSize">
            <DesignToken
              type="fontSize"
              :name="`--le-font-size-${fontSize}`"
              :value="getCssVar(`--le-font-size-${fontSize}`)"
              :label="fontSize"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>字体粗细</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="weight in fontWeightList" :key="weight">
            <DesignToken
              type="fontWeight"
              :name="`--le-font-weight-${weight}`"
              :value="getCssVar(`--le-font-weight-${weight}`)"
              :label="weight"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>行高系统</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="4">
          <n-grid-item v-for="height in lineHeightList" :key="height">
            <DesignToken
              type="lineHeight"
              :name="`--le-line-height-${height}`"
              :value="getCssVar(`--le-line-height-${height}`)"
              :label="height"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>阴影系统</n-h4>
        <n-space direction="vertical" size="large" style="width: 100%">
          <div v-for="shadow in shadowList" :key="shadow" class="shadow-demo">
            <div class="shadow-box" :style="{ boxShadow: getCssVar(`--le-shadow-${shadow}`) }">
              <n-text>{{ `shadow-${shadow}` }}</n-text>
            </div>
            <n-text depth="3" style="font-size: 12px">
              {{ getCssVar(`--le-shadow-${shadow}`) }}
            </n-text>
          </div>
        </n-space>

        <n-divider />
        <n-h4>动画时长</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="3">
          <n-grid-item v-for="duration in durationList" :key="duration">
            <DesignToken
              type="duration"
              :name="`--le-duration-${duration}`"
              :value="getCssVar(`--le-duration-${duration}`)"
              :label="duration"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>层级系统</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="7">
          <n-grid-item v-for="zIndex in zIndexList" :key="zIndex">
            <DesignToken
              type="zIndex"
              :name="`--le-z-index-${zIndex}`"
              :value="getCssVar(`--le-z-index-${zIndex}`)"
              :label="zIndex"
            />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </LeCard>
</template>

<script setup lang="ts">
// 不需要导入 ref，已移除所有变量相关功能
import { NTabs, NTabPane, NH4, NGrid, NGridItem, NDivider, NSpace, NText } from 'naive-ui';
import { Card as LeCard } from '@lee/ui';
import ColorDisplay from './ColorDisplay.vue';
import DesignToken from './DesignToken.vue';

// 颜色配置
const textColors = [
  { name: '--le-text-1', label: '主要文本' },
  { name: '--le-text-2', label: '次要文本' },
  { name: '--le-text-3', label: '辅助文本' },
  { name: '--le-text-disabled', label: '禁用文本' },
  { name: '--le-text-invert', label: '反色文本' },
];

const bgColors = [
  { name: '--le-card', label: '卡片背景' },
  { name: '--le-neutral-body', label: '页面背景' },
  { name: '--le-hover', label: '悬停背景' },
  { name: '--le-pressed', label: '按下背景' },
  { name: '--le-sider-bg', label: '侧边栏背景' },
];

// 设计 token 列表
const spacingList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];
const radiusList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'round'];
const fontSizeList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'display'];
const fontWeightList = ['light', 'regular', 'medium', 'semibold', 'bold'];
const lineHeightList = ['tight', 'normal', 'relaxed', 'loose'];
const shadowList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '1', '2', '3'];
const durationList = ['fast', 'normal', 'slow'];
const zIndexList = ['dropdown', 'sticky', 'fixed', 'modalBackdrop', 'modal', 'popover', 'tooltip'];

// 获取 CSS 变量
function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
</script>

<style lang="scss" scoped>
.shadow-demo {
  .shadow-box {
    padding: 24px;
    background: var(--le-card);
    border-radius: var(--le-radius-lg);
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
