<template>
  <div class="global-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="global-tabs-item"
      :class="{ active: activeTab.key === tab.key }"
      @click="onClickTab(tab)"
    >
      <span class="tab-label">{{ tab.label }}</span>
      <n-icon-wrapper
        class="tab-close"
        :color="activeTab.key === tab.key ? '#b5bdc7' : '#8c939c'"
        :border-radius="0"
        :size="16"
        @click.stop="onClickCloseTab(tab)"
      >
        <n-icon :size="16" :component="Close"></n-icon>
      </n-icon-wrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Close } from '@vicons/ionicons5';
import { useAppStore } from '../../../store/app';

const appStore = useAppStore();

const { tabs, activeTab } = storeToRefs(appStore);

const onClickTab = (tab: any) => {
  appStore.setActiveTab(tab);
};

const onClickCloseTab = (tab: any) => {};
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
