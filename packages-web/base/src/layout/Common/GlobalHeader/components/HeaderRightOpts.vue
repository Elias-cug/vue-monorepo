<template>
  <div class="header-actions">
    <DocLink v-if="isOptVisible('doc')" />
    <ThemeSetting v-if="isOptVisible('theme')" />
    <UserDropdown v-if="isOptVisible('user')" />
  </div>
</template>

<script setup lang="ts">
import UserDropdown from './UserDropdown.vue';
import ThemeSetting from './ThemeSetting.vue';
import DocLink from './DocLink.vue';

interface Props {
  /**
   * 显示的右侧操作选项
   * @example ['doc', 'theme', 'user']
   */
  showOpts?: ('doc' | 'theme' | 'user')[];
}

const props = withDefaults(defineProps<Props>(), {
  showOpts: () => ['doc', 'theme', 'user'],
});

/**
 * 检查指定的操作是否应该显示
 */
const isOptVisible = (optName: string): boolean => {
  return props.showOpts.includes(optName as any);
};
</script>

<style lang="scss" scoped></style>
