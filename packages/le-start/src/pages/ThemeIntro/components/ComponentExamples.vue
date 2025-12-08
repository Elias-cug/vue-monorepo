<template>
  <LeCard title="🎭 组件主题化示例" :bordered="false">
    <n-tabs type="line" animated>
      <n-tab-pane name="card" tab="卡片组件">
        <n-grid :x-gap="16" :y-gap="16" :cols="3">
          <n-grid-item>
            <LeCard title="默认卡片">这是默认样式的卡片</LeCard>
          </n-grid-item>
          <n-grid-item>
            <LeCard title="主题色卡片" theme="primary">使用主题色的卡片</LeCard>
          </n-grid-item>
          <n-grid-item>
            <LeCard title="渐变卡片" theme="gradient">渐变背景的卡片</LeCard>
          </n-grid-item>
          <n-grid-item>
            <LeCard title="无边框卡片" borderless>无边框透明背景</LeCard>
          </n-grid-item>
          <n-grid-item>
            <LeCard title="浮动卡片" theme="float">更强的阴影效果</LeCard>
          </n-grid-item>
          <n-grid-item>
            <LeCard title="选中卡片" selected>选中状态的卡片</LeCard>
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <n-tab-pane name="container" tab="容器组件">
        <n-grid :x-gap="16" :y-gap="16" :cols="2">
          <n-grid-item>
            <LeContainer :style="{ height: '100px' }">
              <n-text>默认容器</n-text>
            </LeContainer>
          </n-grid-item>
          <n-grid-item>
            <LeContainer bordered :style="{ height: '100px' }">
              <n-text>带边框容器</n-text>
            </LeContainer>
          </n-grid-item>
          <n-grid-item>
            <LeContainer accent :style="{ height: '100px' }">
              <n-text>带装饰线容器</n-text>
            </LeContainer>
          </n-grid-item>
          <n-grid-item>
            <LeContainer theme="primary" :style="{ height: '100px' }">
              <n-text>主题色背景容器</n-text>
            </LeContainer>
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <n-tab-pane name="tabs" tab="Tabs 示例">
        <div class="tabs-demo">
          <div class="global-tabs">
            <div class="global-tabs-item active">
              <span class="tab-label">激活标签</span>
            </div>
            <div class="global-tabs-item">
              <span class="tab-label">普通标签</span>
            </div>
            <div class="global-tabs-item">
              <span class="tab-label">另一个标签</span>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="buttons" tab="按钮示例">
        <n-space>
          <n-button type="primary">主要按钮</n-button>
          <n-button>默认按钮</n-button>
          <n-button type="info">信息按钮</n-button>
          <n-button type="success">成功按钮</n-button>
          <n-button type="warning">警告按钮</n-button>
          <n-button type="error">错误按钮</n-button>
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </LeCard>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NGrid, NGridItem, NText, NSpace, NButton } from 'naive-ui';
import { Card as LeCard, Container as LeContainer } from '@lee/ui';
</script>

<style lang="scss" scoped>
.tabs-demo {
  padding: 20px;
  background: var(--le-neutral-body);
  border-radius: var(--le-radius-lg);

  .global-tabs {
    display: flex;
    height: 48px;
    background-color: var(--le-primary-1);
    border-radius: var(--le-radius-lg);
    padding: 4px;
    box-shadow: var(--le-shadow-1);

    .global-tabs-item {
      padding: 0 24px;
      display: flex;
      align-items: center;
      color: var(--le-text-2);
      cursor: pointer;
      border-radius: var(--le-radius-md);
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;

      &:hover:not(.active) {
        background-color: var(--le-primary-2);
        color: var(--le-text-1);
      }

      &.active {
        background-color: var(--le-card);
        color: var(--le-primary);
        box-shadow: var(--le-shadow-1);
        border-bottom-color: var(--le-primary);
      }
    }
  }
}
</style>
