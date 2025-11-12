<template>
  <div class="global-sider">
    <div class="global-sider-content">
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menus"
      />
    </div>

    <div class="global-sider-collapse" @click="changeCollapsed">折叠</div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore, useAuthStore } from '../../../store';

const appStore = useAppStore();
const authStore = useAuthStore();

const { collapsed } = storeToRefs(appStore);
const { menus } = storeToRefs(authStore);

const changeCollapsed = () => {
  appStore.switchCollapsed();
};
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
