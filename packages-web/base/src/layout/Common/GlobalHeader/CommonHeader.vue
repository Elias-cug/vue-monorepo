<template>
  <div class="global-header">
    <div class="global-header-left">
      <slot name="header-left">
        <img class="global-header-logo" src="../../../assets/logo/vite.svg" alt="" />
        <h1 class="global-header-title">{{ appInfo?.name }}</h1>
      </slot>
    </div>
    <div class="global-header-center">
      <slot name="header-center"></slot>
    </div>
    <div class="global-header-right">
      <slot name="header-right">
        <HeaderRightOpts :show-opts="showOpts" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '../../../store/app';
import HeaderRightOpts from './components/HeaderRightOpts.vue';

interface Props {
  /**
   * 右侧操作选项显示配置
   * @example ['doc', 'theme', 'user']
   */
  showOpts?: ('doc' | 'theme' | 'user')[];
}

withDefaults(defineProps<Props>(), {
  showOpts: () => ['doc', 'theme', 'user'],
});

const appStore = useAppStore();
const { appInfo } = storeToRefs(appStore);
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
