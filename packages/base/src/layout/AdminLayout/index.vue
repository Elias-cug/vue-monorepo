<template>
  <div
    class="admin-layout"
    :class="{
      collapsed: collapsed,
      'no-sider': noSider,
      'no-tabs': noTabs,
      'no-header': noHeader,
    }"
  >
    <header v-if="!noHeader" class="layout-header">
      <slot name="header"></slot>
    </header>

    <div v-if="!noTabs" class="layout-tabs">
      <slot name="tabs"></slot>
    </div>

    <div class="layout-content">
      <slot name="content"></slot>
    </div>

    <div v-if="!noSider" class="layout-sider">
      <slot name="sider"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  noHeader: {
    type: Boolean,
    default: false,
  },
  noSider: {
    type: Boolean,
    default: false,
  },
  noTabs: {
    type: Boolean,
    default: false,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
