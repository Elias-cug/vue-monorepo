<!--
 * 安全设置项组件
 * 用于展示账户安全相关的设置项
-->
<template>
  <div class="flex items-center justify-between p-12px rounded-8px bg-gray-50 hover:bg-gray-100 transition-colors">
    <div class="flex items-center gap-12px">
      <div class="w-40px h-40px rounded-8px flex items-center justify-center" :class="iconBgClass">
        <n-icon :component="icon" size="20" :class="iconClass" />
      </div>
      <div>
        <div class="text-sm font-medium">{{ title }}</div>
        <div class="text-xs text-gray-400 mt-2px">{{ description }}</div>
      </div>
    </div>
        <LeButton text type="primary" size="small" @click="$emit('action')">
      {{ actionText }}
    </LeButton>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({
  name: 'SecurityItem',
});

interface Props {
  /** 图标组件 */
  icon: Component;
  /** 图标背景色类名 */
  iconBgClass?: string;
  /** 图标颜色类名 */
  iconClass?: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 操作按钮文字 */
  actionText?: string;
}

withDefaults(defineProps<Props>(), {
  iconBgClass: 'bg-primary/10',
  iconClass: 'text-primary',
  actionText: '修改',
});

defineEmits<{
  action: [];
}>();
</script>

<style lang="scss" scoped></style>
