<template>
  <LeContainer overflow="auto">
    <div class="flex flex-col gap-16px">
      <!-- 页面标题 -->
      <IntroHeader />

      <!-- 快速开始 -->
      <QuickStart />

      <!-- 主题预览 -->
      <ThemePreview />

      <!-- API 文档 -->
      <ApiDocs />

      <!-- CSS 变量展示 -->
      <CssVariables />

      <!-- 组件主题化示例 -->
      <ComponentExamples />

      <!-- 主题控制面板 -->
      <ThemeControl />

      <!-- 使用指南 -->
      <UsageGuide />
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
import IntroHeader from './components/IntroHeader.vue';
import QuickStart from './components/QuickStart.vue';
import ThemePreview from './components/ThemePreview.vue';
import ApiDocs from './components/ApiDocs.vue';
import CssVariables from './components/CssVariables.vue';
import ComponentExamples from './components/ComponentExamples.vue';
import ThemeControl from './components/ThemeControl.vue';
import UsageGuide from './components/UsageGuide.vue';
</script>

<style lang="scss" scoped>
.theme-intro-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
