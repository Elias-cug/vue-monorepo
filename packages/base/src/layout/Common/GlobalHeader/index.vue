<template>
  <div class="global-header">
    <div class="global-header-left">
      <img class="global-header-logo" src="../../../assets/logo/vite.svg" alt="" />
      <h1 class="global-header-title">VUE单体仓库</h1>
    </div>
    <div class="global-header-right">
      <div class="global-header-user" @click="onClickUser">
        <img class="user-avatar" src="../../../assets/avatar/lufei.png" alt="" />
        <span class="user-name">路飞</span>
        <n-icon size="18" :style="{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }">
          <ChevronDownOutline />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownOutline } from '@vicons/ionicons5';
import { transform } from 'typescript';

const collapsed = ref(false);

const onClickUser = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
