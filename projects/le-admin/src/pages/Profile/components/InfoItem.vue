<!--
 * 信息项组件
 * 用于展示标签-值形式的信息
-->
<template>
  <div class="flex flex-col gap-4px">
    <span class="text-xs text-gray-400">{{ label }}</span>
    <span class="text-sm">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'InfoItem',
});

interface Props {
  /** 标签 */
  label: string;
  /** 值 */
  value?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped></style>
