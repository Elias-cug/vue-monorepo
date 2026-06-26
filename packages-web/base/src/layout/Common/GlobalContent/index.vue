<template>
  <div class="global-content">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedRoutes">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@base/store';

const appStore = useAppStore();
const { cachedRoutes } = storeToRefs(appStore);
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
